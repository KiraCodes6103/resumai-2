#!/usr/bin/env tsx
// scripts/check-env.ts
// Run before first launch to verify all required environment variables are set
// Usage: npx tsx scripts/check-env.ts

import { execSync } from "child_process";

const REQUIRED = [
  {
    key: "DATABASE_URL",
    hint: "Get from neon.tech → Project → Connection string",
    test: async (val: string) => val.startsWith("postgresql://"),
  },
  {
    key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    hint: "Get from clerk.com → API Keys",
    test: async (val: string) => val.startsWith("pk_"),
  },
  {
    key: "CLERK_SECRET_KEY",
    hint: "Get from clerk.com → API Keys",
    test: async (val: string) => val.startsWith("sk_"),
  },
  {
    key: "CLERK_WEBHOOK_SECRET",
    hint: "Get from clerk.com → Webhooks → Signing secret",
    test: async (val: string) => val.startsWith("whsec_"),
  },
  {
    key: "OPENAI_API_KEY",
    hint: "Get from platform.openai.com → API Keys",
    test: async (val: string) => val.startsWith("sk-"),
  },
  {
    key: "UPSTASH_REDIS_REST_URL",
    hint: "Get from upstash.com → Redis → REST API",
    test: async (val: string) => val.startsWith("https://"),
  },
  {
    key: "UPSTASH_REDIS_REST_TOKEN",
    hint: "Get from upstash.com → Redis → REST API",
    test: async (val: string) => val.length > 20,
  },
  {
    key: "NEXT_PUBLIC_APP_URL",
    hint: "Set to http://localhost:3000 for dev",
    test: async (val: string) => val.startsWith("http"),
  },
];

const OPTIONAL = [
  { key: "STRIPE_SECRET_KEY", hint: "Optional: for paid plans (stripe.com)" },
  { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", hint: "Optional: for paid plans" },
  { key: "STRIPE_PRO_PRICE_ID", hint: "Optional: Pro plan price ID from Stripe" },
  { key: "FIRECRAWL_API_KEY", hint: "Optional: for URL scraping (firecrawl.dev)" },
  { key: "CRON_SECRET", hint: "Optional: random string for securing cron endpoint" },
];

// Load .env.local
try {
  const fs = await import("fs");
  const path = await import("path");
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  }
} catch {}

console.log("\n🔍 ResuMAI Environment Check\n");
console.log("─".repeat(50));

let allGood = true;

console.log("\n📋 Required Variables:\n");
for (const { key, hint, test } of REQUIRED) {
  const val = process.env[key];
  if (!val) {
    console.log(`  ❌ ${key}`);
    console.log(`     Missing! ${hint}`);
    allGood = false;
  } else {
    const valid = await test(val);
    if (valid) {
      console.log(`  ✅ ${key}`);
    } else {
      console.log(`  ⚠️  ${key} (set but format looks wrong)`);
      console.log(`     ${hint}`);
      allGood = false;
    }
  }
}

console.log("\n📋 Optional Variables:\n");
for (const { key, hint } of OPTIONAL) {
  const val = process.env[key];
  console.log(`  ${val ? "✅" : "⬜"} ${key}${!val ? ` — ${hint}` : ""}`);
}

console.log("\n" + "─".repeat(50));

if (allGood) {
  console.log("\n✅ All required environment variables are set!\n");
  console.log("Next steps:");
  console.log("  1. npx prisma db push      # Push schema to database");
  console.log("  2. npm run db:seed         # (Optional) Add demo data");
  console.log("  3. npm run dev             # Start development server\n");
} else {
  console.log("\n❌ Some required variables are missing. Fix them in .env.local\n");
  process.exit(1);
}
