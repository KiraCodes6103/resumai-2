// src/app/api/queue/process/route.ts
// Internal route that processes queued jobs
// Called internally after job creation (fire-and-forget)
// Can also be triggered by a cron job on Vercel

import { NextRequest, NextResponse } from "next/server";
import { processNext, JobType } from "@/lib/queue";

export async function POST(req: NextRequest) {
  // Protect with internal key
  const internalKey = req.headers.get("x-internal-key");
  const expectedKey = process.env.INTERNAL_API_KEY || "dev-key";

  if (internalKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const type = body.type as JobType;

  if (!["PARSE_JD", "GENERATE_RESUMES", "PROCESS_PROFILE"].includes(type)) {
    return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
  }

  console.log(`api/queue/process POST: processing type=${type}`);
  const processed = await processNext(type);
  console.log(`api/queue/process POST: processed result=${processed}`);

  return NextResponse.json({ processed });
}

// Also handle GET for Vercel cron jobs
// Add to vercel.json: { "crons": [{ "path": "/api/queue/process", "schedule": "* * * * *" }] }
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Process pending jobs of all types
  const results = await Promise.all([
    processNext("GENERATE_RESUMES"),
    processNext("PROCESS_PROFILE"),
    processNext("PARSE_JD"),
  ]);

  return NextResponse.json({ processed: results.filter(Boolean).length });
}
