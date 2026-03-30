#!/usr/bin/env tsx
// scripts/queue-status.ts
// Shows current state of the job queue and recent completions
// Usage: npx tsx scripts/queue-status.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("\n📊 ResuMAI Queue Status\n");
  console.log("─".repeat(50));

  const statuses = ["PENDING", "PROCESSING", "COMPLETE", "FAILED"] as const;

  for (const status of statuses) {
    const jobs = await prisma.queueJob.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    const count = await prisma.queueJob.count({ where: { status } });

    const icon =
      status === "PENDING" ? "⏳" :
      status === "PROCESSING" ? "⚙️ " :
      status === "COMPLETE" ? "✅" : "❌";

    console.log(`\n${icon} ${status} (${count} total):`);
    if (jobs.length === 0) {
      console.log("   (none)");
    } else {
      for (const job of jobs) {
        const age = Math.round((Date.now() - job.createdAt.getTime()) / 1000);
        console.log(`   ${job.id.slice(0, 8)}... | ${job.type.padEnd(18)} | ${age}s ago${job.error ? ` | Error: ${job.error.slice(0, 50)}` : ""}`);
      }
      if (count > 5) console.log(`   ... and ${count - 5} more`);
    }
  }

  console.log("\n─".repeat(50));

  // User stats
  const userCount = await prisma.user.count();
  const resumeCount = await prisma.resume.count();
  const jobAppCount = await prisma.jobApplication.count();

  console.log(`\n👥 Users: ${userCount}`);
  console.log(`📄 Total resumes generated: ${resumeCount}`);
  console.log(`💼 Total job applications: ${jobAppCount}`);
  console.log();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
