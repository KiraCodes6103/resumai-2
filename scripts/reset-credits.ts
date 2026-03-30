#!/usr/bin/env tsx
// scripts/reset-credits.ts
// Reset or add credits to a user by email
// Usage: npx tsx scripts/reset-credits.ts user@example.com 10

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const credits = parseInt(process.argv[3] || "5", 10);

  if (!email) {
    console.error("Usage: npx tsx scripts/reset-credits.ts <email> [credits]");
    console.error("Example: npx tsx scripts/reset-credits.ts user@example.com 10");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { credits },
  });

  console.log(`✅ Updated ${email}: credits set to ${updated.credits}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
