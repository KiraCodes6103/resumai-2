// src/lib/queue/index.ts
// Simple queue using Upstash Redis + PostgreSQL for job tracking
// Avoids need for a separate worker process on free tier

import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/db";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export type JobType = "PARSE_JD" | "GENERATE_RESUMES" | "PROCESS_PROFILE";

export interface QueuePayload {
  PARSE_JD: {
    jobApplicationId: string;
    userId: string;
    rawJD: string;
  };
  GENERATE_RESUMES: {
    jobApplicationId: string;
    userId: string;
    variantCount: number;
  };
  PROCESS_PROFILE: {
    profileId: string;
    userId: string;
  };
}

// Enqueue a job (store in DB + push ID to Redis list)
export async function enqueue<T extends JobType>(
  type: T,
  payload: QueuePayload[T]
): Promise<string> {
  console.log(`QUEUE: Enqueue ${type}`, { payload });

  const job = await prisma.queueJob.create({
    data: { type, payload, status: "PENDING" },
  });
  console.log(`QUEUE: Created job ${job.id} in DB`);
  // Push job ID to Redis queue list
  await redis.lpush(`queue:${type}`, job.id);
  console.log(`QUEUE: Pushed job ${job.id} to Redis queue:${type}`);

  return job.id;
}

// Process next job of a given type (called from API route)
export async function processNext(type: JobType): Promise<boolean> {
  console.log(`QUEUE: processNext(${type}) called`);
  const jobId = await redis.rpop<string>(`queue:${type}`);
  console.log(`QUEUE: Redis rpop from queue:${type} returned:`, jobId);
  if (!jobId) {
    console.log(`QUEUE: No pending jobs found in queue:${type}`);
    return false;
  }

  console.log(`QUEUE: Dequeued job ${jobId} from queue:${type}`);
  const job = await prisma.queueJob.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "PENDING") {
    console.log(`QUEUE: Job ${jobId} skipped (status ${job?.status ?? "not found"})`);
    return false;
  }

  await prisma.queueJob.update({
    where: { id: jobId },
    data: { status: "PROCESSING", attempts: { increment: 1 } },
  });
  console.log(`QUEUE: Job ${jobId} marked PROCESSING`);

  try {
    const result = await executeJob(type, job.payload as QueuePayload[typeof type]);

    await prisma.queueJob.update({
      where: { id: jobId },
      data: { status: "COMPLETE", result, processedAt: new Date() },
    });

    console.log(`QUEUE: Job ${jobId} COMPLETE`, { result });
    return true;
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error(`QUEUE: Job ${jobId} ERROR`, { error, type, attempts: job.attempts });

    await prisma.queueJob.update({
      where: { id: jobId },
      data: {
        status: job.attempts >= 3 ? "FAILED" : "PENDING",
        error,
      },
    });

    // Re-queue if not max retries
    if (job.attempts < 3) {
      await redis.lpush(`queue:${type}`, jobId);
    }

    return false;
  }
}

// Job execution logic
async function executeJob(type: JobType, payload: unknown): Promise<unknown> {
  console.log(`QUEUE: executeJob(${type}) payload`, payload);
  const { parseJobDescription, runFullPipeline, extractStructuredProfile } =
    await import("@/lib/ai/pipeline");

  switch (type) {
    case "PARSE_JD": {
      const { jobApplicationId, rawJD } = payload as QueuePayload["PARSE_JD"];
      const parsed = await parseJobDescription(rawJD);

      await prisma.jobApplication.update({
        where: { id: jobApplicationId },
        data: {
          parsedJD: parsed as unknown as Record<string, unknown>,
          company: parsed.company,
          jobTitle: parsed.title,
          jobLevel: parsed.level,
          location: parsed.location,
          remote: parsed.remote,
        },
      });

      return parsed;
    }

    case "GENERATE_RESUMES": {
      const { jobApplicationId, userId, variantCount } =
        payload as QueuePayload["GENERATE_RESUMES"];

      const [jobApp, profile] = await Promise.all([
        prisma.jobApplication.findUnique({ where: { id: jobApplicationId } }),
        prisma.profile.findUnique({ where: { userId } }),
      ]);

      if (!jobApp || !profile?.structuredData) {
        throw new Error("Missing job application or profile data");
      }

      await prisma.jobApplication.update({
        where: { id: jobApplicationId },
        data: { status: "GENERATING" },
      });

      const { parsedJD, variants } = await runFullPipeline({
        rawJD: jobApp.rawJD,
        profile: profile.structuredData as ReturnType<typeof Object.create>,
        variantCount,
        maxIterations: 2,
      });

      // Save variants to DB
      await Promise.all(
        variants.map((v) =>
          prisma.resume.create({
            data: {
              userId,
              jobApplicationId,
              variantNumber: v.variantNumber,
              title: v.title,
              content: v.content as unknown as Record<string, unknown>,
              atsScore: v.scores?.ats,
              relevanceScore: v.scores?.relevance,
              clarityScore: v.scores?.clarity,
              impactScore: v.scores?.impact,
              overallScore: v.scores?.overall,
              scoreBreakdown: v.scoreBreakdown as unknown as Record<string, unknown>,
              status: "COMPLETE",
            },
          })
        )
      );

      await prisma.jobApplication.update({
        where: { id: jobApplicationId },
        data: { status: "READY", parsedJD: parsedJD as unknown as Record<string, unknown> },
      });

      // Deduct credits
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });

      return { variantCount: variants.length };
    }

    case "PROCESS_PROFILE": {
      const { profileId, userId } = payload as QueuePayload["PROCESS_PROFILE"];

      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: { user: true },
      });

      if (!profile) throw new Error("Profile not found");

      const structured = await extractStructuredProfile(
        profile.rawExperience || "",
        profile.rawProjects || "",
        profile.rawSkills || "",
        profile.rawEducation || "",
        profile.rawSummary || "",
        { name: profile.user.name || "", email: profile.user.email }
      );

      await prisma.profile.update({
        where: { id: profileId },
        data: {
          structuredData: structured as unknown as Record<string, unknown>,
          lastProcessedAt: new Date(),
          completionScore: calculateCompletionScore(profile),
        },
      });

      return structured;
    }

    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}

function calculateCompletionScore(profile: {
  rawExperience: string | null;
  rawProjects: string | null;
  rawSkills: string | null;
  rawEducation: string | null;
  rawSummary: string | null;
}): number {
  let score = 0;
  if (profile.rawExperience && profile.rawExperience.length > 100) score += 35;
  if (profile.rawProjects && profile.rawProjects.length > 50) score += 25;
  if (profile.rawSkills && profile.rawSkills.length > 20) score += 20;
  if (profile.rawEducation && profile.rawEducation.length > 20) score += 10;
  if (profile.rawSummary && profile.rawSummary.length > 50) score += 10;
  return score;
}

// Rate limiting helper
export async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rl:generate:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }
  return count <= 5; // max 5 generations per hour
}

// Get queue depth for monitoring
export async function getQueueDepth(type: JobType): Promise<number> {
  return (await redis.llen(`queue:${type}`)) as number;
}
