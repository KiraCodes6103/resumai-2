// // src/app/api/jobs/route.ts
// import { auth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { enqueue, checkRateLimit } from "@/lib/queue";
// import { z } from "zod";

// const CreateJobSchema = z.object({
//   rawJD: z.string().min(100, "Job description must be at least 100 characters"),
//   jobUrl: z.string().url().optional(),
//   variantCount: z.number().min(1).max(5).default(3),
// });

// // GET /api/jobs — list all job applications for user
// export async function GET() {
//   const { userId: clerkId } = await auth();
//   if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const user = await prisma.user.findUnique({ where: { clerkId } });
//   if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//   const jobs = await prisma.jobApplication.findMany({
//     where: { userId: user.id },
//     include: {
//       resumes: {
//         select: {
//           id: true,
//           variantNumber: true,
//           title: true,
//           overallScore: true,
//           atsScore: true,
//           status: true,
//           createdAt: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   return NextResponse.json({ jobs });
// }

// // POST /api/jobs — create new job application + trigger generation
// export async function POST(req: NextRequest) {
//   const { userId: clerkId } = await auth();
//   if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const user = await prisma.user.findUnique({
//     where: { clerkId },
//     include: { profile: true },
//   });

//   if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//   // Check credits
//   if (user.credits <= 0) {
//     return NextResponse.json(
//       { error: "No credits remaining. Upgrade to Pro for unlimited generations." },
//       { status: 402 }
//     );
//   }

//   // Check rate limit
//   const allowed = await checkRateLimit(user.id);
//   if (!allowed) {
//     return NextResponse.json(
//       { error: "Rate limit exceeded. Max 5 generations per hour." },
//       { status: 429 }
//     );
//   }

//   // Bug fix: gate on raw text not structuredData (which is populated async by AI)
//   if (!user.profile?.rawExperience && !user.profile?.rawSummary) {
//     return NextResponse.json(
//       { error: "Please add your experience or summary to your profile before generating resumes." },
//       { status: 400 }
//     );
//   }

//   // Process profile if not already structured
//   if (!user.profile?.structuredData) {
//     console.log("api/jobs: Profile not processed, processing now");
//     try {
//       const { extractStructuredProfile } = await import("@/lib/ai/pipeline");
//       const structured = await extractStructuredProfile(
//         user.profile.rawExperience || "",
//         user.profile.rawProjects || "",
//         user.profile.rawSkills || "",
//         user.profile.rawEducation || "",
//         user.profile.rawSummary || "",
//         { name: user.name || "", email: user.email }
//       );
//       console.log("api/jobs: Profile extraction completed, updating DB");

//       await prisma.profile.update({
//         where: { id: user.profile.id },
//         data: {
//           structuredData: structured as unknown as Record<string, unknown>,
//           lastProcessedAt: new Date(),
//         },
//       });
//       console.log("api/jobs: Profile processed and saved successfully");
//     } catch (error) {
//       console.error("api/jobs: Profile processing failed", error);
//       return NextResponse.json({ error: "Failed to process profile" }, { status: 500 });
//     }
//   } else {
//     console.log("api/jobs: Profile already processed, skipping");
//   }

//   const body = await req.json();
//   const parsed = CreateJobSchema.safeParse(body);
//   if (!parsed.success) {
//     return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
//   }

//   // Create job application
//   const jobApp = await prisma.jobApplication.create({
//     data: {
//       userId: user.id,
//       rawJD: parsed.data.rawJD,
//       jobUrl: parsed.data.jobUrl,
//       status: "GENERATING",
//     },
//   });

//   // Log usage
//   await prisma.usageLog.create({
//     data: {
//       userId: user.id,
//       action: "resume_generation",
//       metadata: { jobApplicationId: jobApp.id, variantCount: parsed.data.variantCount },
//     },
//   });

//   // Enqueue generation job
//   await enqueue("GENERATE_RESUMES", {
//     jobApplicationId: jobApp.id,
//     userId: user.id,
//     variantCount: parsed.data.variantCount,
//   });

//   console.log("api/jobs: New GENERATE_RESUMES job enqueued", {
//     userId: user.id,
//     jobApplicationId: jobApp.id,
//     variantCount: parsed.data.variantCount,
//     creditsBefore: user.credits,
//   });

//   // Process the job immediately instead of fire-and-forget fetch
//   console.log("api/jobs: About to import queue");
//   try {
//     const { processNext } = await import("@/lib/queue");
//     console.log("api/jobs: Imported processNext successfully");
//     const result = await processNext("GENERATE_RESUMES");
//     console.log("api/jobs: processNext completed with result:", result);
//   } catch (error) {
//     console.error("api/jobs: Failed to import or call processNext", error);
//   }

//   return NextResponse.json(
//     {
//       jobApplicationId: jobApp.id,
//       message: "Resume generation started. This takes 1-3 minutes.",
//       pollUrl: `/api/jobs/${jobApp.id}/status`,
//     },
//     { status: 202 }
//   );
// }

/// src/app/api/jobs/route.ts
// MVP MODE: Queue/Redis bypassed. Pipeline runs synchronously.
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateJobSchema = z
  .object({
    rawJD: z.string().optional().default(""),
    jobUrl: z.string().url().optional(),
    variantCount: z.number().min(1).max(5).default(3),
  })
  .refine((data) => data.rawJD.trim().length >= 100 || !!data.jobUrl, {
    message: "Either paste a job description (100+ characters) or provide a job URL.",
  });

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const jobs = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    include: {
      resumes: {
        select: {
          id: true, variantNumber: true, title: true,
          overallScore: true, atsScore: true, status: true, createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId }, include: { profile: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.credits <= 0) {
    return NextResponse.json(
      { error: "No credits remaining. Upgrade to Pro for unlimited generations." },
      { status: 402 }
    );
  }

  if (!user.profile?.rawExperience && !user.profile?.rawSummary) {
    return NextResponse.json(
      { error: "Please add your experience or summary to your profile before generating resumes." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = CreateJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { extractStructuredProfile, runFullPipeline, scrapeJDFromUrl } =
    await import("@/lib/ai/pipeline");

  // Resolve JD — use pasted text or scrape from URL
  let resolvedJD = parsed.data.rawJD.trim();
  if (resolvedJD.length < 100 && parsed.data.jobUrl) {
    console.log("api/jobs: Scraping JD from URL", parsed.data.jobUrl);
    try {
      resolvedJD = await scrapeJDFromUrl(parsed.data.jobUrl);
      console.log("api/jobs: Scraped JD, length:", resolvedJD.length);
    } catch (error) {
      console.error("api/jobs: URL scraping failed", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to fetch job description from URL. Please paste it manually." },
        { status: 422 }
      );
    }
  }

  // Structure profile if needed
  let profileData = user.profile?.structuredData;
  if (!profileData) {
    console.log("api/jobs: Structuring profile");
    try {
      profileData = (await extractStructuredProfile(
        user.profile!.rawExperience || "",
        user.profile!.rawProjects || "",
        user.profile!.rawSkills || "",
        user.profile!.rawEducation || "",
        user.profile!.rawSummary || "",
        { name: user.name || "", email: user.email }
      )) as unknown as Record<string, unknown>;

      await prisma.profile.update({
        where: { id: user.profile!.id },
        data: { structuredData: profileData, lastProcessedAt: new Date() },
      });
    } catch (error) {
      console.error("api/jobs: Profile processing failed", error);
      return NextResponse.json({ error: "Failed to process profile" }, { status: 500 });
    }
  }

  const jobApp = await prisma.jobApplication.create({
    data: { userId: user.id, rawJD: resolvedJD, jobUrl: parsed.data.jobUrl, status: "GENERATING" },
  });

  await prisma.usageLog.create({
    data: {
      userId: user.id,
      action: "resume_generation",
      metadata: { jobApplicationId: jobApp.id, variantCount: parsed.data.variantCount },
    },
  });

  try {
    const { parsedJD, variants } = await runFullPipeline({
      rawJD: resolvedJD,
      profile: profileData as ReturnType<typeof Object.create>,
      variantCount: parsed.data.variantCount,
      maxIterations: 2,
    });

    await Promise.all(
      variants.map((v) =>
        prisma.resume.create({
          data: {
            userId: user.id,
            jobApplicationId: jobApp.id,
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
      where: { id: jobApp.id },
      data: {
        status: "READY",
        parsedJD: parsedJD as unknown as Record<string, unknown>,
        company: parsedJD.company,
        jobTitle: parsedJD.title,
        jobLevel: parsedJD.level,
        location: parsedJD.location,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
    });

    console.log("api/jobs: Done", { variants: variants.length });
  } catch (error) {
    console.error("api/jobs: Pipeline failed", error);
    await prisma.jobApplication.update({ where: { id: jobApp.id }, data: { status: "ERROR" } });
    return NextResponse.json({ error: "Resume generation failed. Please try again." }, { status: 500 });
  }

  return NextResponse.json(
    { jobApplicationId: jobApp.id, message: "Resumes generated successfully.", pollUrl: `/api/jobs/${jobApp.id}/status` },
    { status: 202 }
  );
}