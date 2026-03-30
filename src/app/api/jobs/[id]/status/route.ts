// src/app/api/jobs/[id]/status/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const job = await prisma.jobApplication.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      resumes: {
        orderBy: { overallScore: "desc" },
        select: {
          id: true,
          variantNumber: true,
          title: true,
          atsScore: true,
          relevanceScore: true,
          clarityScore: true,
          impactScore: true,
          overallScore: true,
          scoreBreakdown: true,
          status: true,
          pdfUrl: true,
          docxUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  // Debug logs
  console.log(`api/jobs/${params.id}/status: job.status=${job.status}, resumes.count=${job.resumes.length}`);

  // Check for queue jobs
  const queueJobs = await prisma.queueJob.findMany({
    where: { type: "GENERATE_RESUMES" },
    select: { id: true, status: true, attempts: true, error: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  console.log(`api/jobs/${params.id}/status: recent GENERATE_RESUMES queue jobs`, queueJobs);

  return NextResponse.json({
    id: job.id,
    status: job.status,
    company: job.company,
    jobTitle: job.jobTitle,
    jobLevel: job.jobLevel,
    parsedJD: job.parsedJD,
    resumes: job.resumes,
    createdAt: job.createdAt,
  });
}
