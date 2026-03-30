// src/app/api/profile/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { enqueue } from "@/lib/queue";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  rawExperience: z.string().optional(),
  rawProjects: z.string().optional(),
  rawSkills: z.string().optional(),
  rawEducation: z.string().optional(),
  rawSummary: z.string().optional(),
});

async function ensureUser(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!email) return null;

  return prisma.user.upsert({
    where: { clerkId },
    update: {
      email,
      name:
        [clerkUser?.firstName, clerkUser?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() || null,
      avatarUrl: clerkUser?.imageUrl || null,
    },
    create: {
      clerkId,
      email,
      name:
        [clerkUser?.firstName, clerkUser?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() || null,
      avatarUrl: clerkUser?.imageUrl || null,
    },
  });
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await ensureUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const userWithProfile = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      profile: {
        include: {
          experiences: true,
          projects: true,
          skills: true,
          education: true,
        },
      },
    },
  });

  if (!userWithProfile) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ profile: userWithProfile.profile });
}

export async function PUT(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = UpdateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await ensureUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Bug fix: calculate completion score from the NEW incoming data, not stale DB record
  const completionScore = calculateCompletionScore(parsed.data);

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data, completionScore },
    update: { ...parsed.data, completionScore },
  });

  // Bug fix: wrap Redis enqueue in try/catch so profile saves succeed even if Redis is down
  try {
    await enqueue("PROCESS_PROFILE", { profileId: profile.id, userId: user.id });

    // Bug fix: use NEXT_PUBLIC_APP_URL instead of req.nextUrl.origin (breaks on Vercel edge)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    fetch(`${appUrl}/api/queue/process`, {
      method: "POST",
      headers: { "x-internal-key": process.env.INTERNAL_API_KEY || "dev-key" },
      body: JSON.stringify({ type: "PROCESS_PROFILE" }),
    }).catch(() => {});
  } catch {
    // Redis unavailable -- profile is saved, AI processing will run on next cron tick
  }

  return NextResponse.json({ profile, message: "Profile saved. Processing in background..." });
}

function calculateCompletionScore(data: {
  rawExperience?: string;
  rawProjects?: string;
  rawSkills?: string;
  rawEducation?: string;
  rawSummary?: string;
}): number {
  let score = 0;
  if (data.rawExperience && data.rawExperience.length > 100) score += 35;
  if (data.rawProjects && data.rawProjects.length > 50) score += 25;
  if (data.rawSkills && data.rawSkills.length > 20) score += 20;
  if (data.rawEducation && data.rawEducation.length > 20) score += 10;
  if (data.rawSummary && data.rawSummary.length > 50) score += 10;
  return score;
}
