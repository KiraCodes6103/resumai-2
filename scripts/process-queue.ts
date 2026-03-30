#!/usr/bin/env tsx
// scripts/process-queue.ts
// Manually trigger queue processing for a specific job type
// Useful in development when the fire-and-forget trigger doesn't fire
// Usage: npx tsx scripts/process-queue.ts [GENERATE_RESUMES|PROCESS_PROFILE|PARSE_JD]

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const type = (process.argv[2] || "GENERATE_RESUMES") as
    | "GENERATE_RESUMES"
    | "PROCESS_PROFILE"
    | "PARSE_JD";

  const validTypes = ["GENERATE_RESUMES", "PROCESS_PROFILE", "PARSE_JD"];
  if (!validTypes.includes(type)) {
    console.error(`❌ Invalid type. Choose from: ${validTypes.join(", ")}`);
    process.exit(1);
  }

  // Check pending jobs
  const pending = await prisma.queueJob.findMany({
    where: { type, status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 5,
  });

  console.log(`\n📋 Pending ${type} jobs: ${pending.length}`);

  if (pending.length === 0) {
    console.log("Nothing to process.");
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const internalKey = process.env.INTERNAL_API_KEY || "dev-key";

  for (const job of pending) {
    console.log(`\n⚙️  Processing job ${job.id}...`);
    const res = await fetch(`${appUrl}/api/queue/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": internalKey,
      },
      body: JSON.stringify({ type }),
    });
    const result = await res.json();
    console.log(`   Result:`, result);
  }

  console.log("\n✅ Done\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
