// prisma/seed.ts
// Seeds the database with a demo user and sample data for development

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo user (matches a Clerk test user)
  const user = await prisma.user.upsert({
    where: { email: "demo@resumai.dev" },
    update: {},
    create: {
      clerkId: "user_demo_seed",
      email: "demo@resumai.dev",
      name: "Alex Johnson",
      credits: 10,
      plan: "FREE",
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create a sample profile
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      rawExperience: `Senior Software Engineer at TechCorp (2021–2024)
- Led a team of 5 engineers building a real-time payment processing system handling $50M/month
- Reduced API p99 latency from 800ms to 120ms through Redis caching and query optimization
- Migrated monolithic backend to microservices, improving deployment frequency from monthly to daily
- Mentored 3 junior engineers, 2 of whom were promoted within 18 months

Software Engineer at StartupABC (2019–2021)
- Built the core React dashboard used by 40,000+ active customers
- Designed PostgreSQL schema for an analytics pipeline processing 2M events/day
- Implemented CI/CD pipelines reducing release time by 70%
- Collaborated with design team to ship 12 major product features`,

      rawProjects: `Open Source: fast-cli (github.com/alexj/fast-cli)
- Rust-based CLI tool for automating cloud deployments
- 3,200 GitHub stars, used by developers at Google, Stripe, and Shopify
- Featured in Hacker News front page (500+ upvotes)

Personal: BudgetFlow (budgetflow.app)
- Full-stack SaaS for personal finance tracking, 800 paying users
- Built with Next.js, Supabase, Stripe; $1,200 MRR
- Handles Plaid bank integrations and automatic transaction categorization`,

      rawSkills: `Languages: TypeScript, Python, Go, Rust, SQL
Frameworks: React, Next.js, Node.js, FastAPI, Express
Databases: PostgreSQL, Redis, MongoDB, ClickHouse
Cloud: AWS (EC2, Lambda, S3, RDS, CloudFront), GCP, Docker, Kubernetes
Tools: Git, GitHub Actions, Terraform, Datadog, Sentry
Other: System Design, Technical Leadership, Agile/Scrum, REST APIs, GraphQL`,

      rawEducation: `B.S. Computer Science, University of California, Berkeley (2019)
GPA: 3.7/4.0, Dean's List (4 semesters)
Relevant coursework: Distributed Systems, Database Systems, Algorithms, ML

AWS Solutions Architect – Associate (2022)
Certified Kubernetes Administrator (CKA) (2023)`,

      rawSummary: `Senior Software Engineer with 5 years of experience building scalable backend systems and full-stack web applications. Proven track record of leading teams, reducing infrastructure costs, and shipping products that users love. Looking for a senior or staff-level role at a product-focused company where I can make a technical and business impact.`,

      completionScore: 95,
      lastProcessedAt: new Date(),

      structuredData: {
        name: "Alex Johnson",
        email: "demo@resumai.dev",
        github: "github.com/alexj",
        linkedin: "linkedin.com/in/alexjohnson",
        summary:
          "Senior Software Engineer with 5 years of experience building scalable backend systems and leading engineering teams. Shipped products handling millions of users and $50M+ in transactions.",
        experiences: [
          {
            company: "TechCorp",
            title: "Senior Software Engineer",
            startDate: "Jan 2021",
            endDate: "Present",
            bullets: [
              "Led team of 5 engineers building payment processing system handling $50M/month",
              "Reduced API p99 latency by 85% (800ms → 120ms) via Redis caching and query optimization",
              "Migrated monolith to microservices, increasing deployment frequency from monthly to daily",
              "Mentored 3 junior engineers; 2 promoted within 18 months",
            ],
            technologies: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS", "Kubernetes"],
          },
          {
            company: "StartupABC",
            title: "Software Engineer",
            startDate: "Jun 2019",
            endDate: "Dec 2020",
            bullets: [
              "Built React dashboard serving 40,000+ active customers",
              "Designed PostgreSQL schema for analytics pipeline processing 2M events/day",
              "Implemented CI/CD pipelines, reducing release cycle time by 70%",
              "Shipped 12 major product features in collaboration with design and product teams",
            ],
            technologies: ["React", "Python", "PostgreSQL", "Docker", "GitHub Actions"],
          },
        ],
        projects: [
          {
            name: "fast-cli",
            description: "Rust-based CLI tool for automating cloud deployments",
            url: "github.com/alexj/fast-cli",
            techStack: ["Rust", "AWS", "CLI"],
            bullets: [
              "3,200 GitHub stars; used by engineers at Google, Stripe, and Shopify",
              "Featured on Hacker News front page with 500+ upvotes",
            ],
          },
          {
            name: "BudgetFlow",
            description: "Full-stack SaaS for personal finance tracking",
            url: "budgetflow.app",
            techStack: ["Next.js", "Supabase", "Stripe", "Plaid"],
            bullets: [
              "800 paying users, $1,200 MRR",
              "Integrates with Plaid for automatic bank transaction sync and categorization",
            ],
          },
        ],
        skills: [
          { category: "Languages", items: ["TypeScript", "Python", "Go", "Rust", "SQL"] },
          { category: "Frameworks", items: ["React", "Next.js", "Node.js", "FastAPI"] },
          { category: "Databases", items: ["PostgreSQL", "Redis", "MongoDB", "ClickHouse"] },
          { category: "Cloud & DevOps", items: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform"] },
        ],
        education: [
          {
            institution: "UC Berkeley",
            degree: "B.S.",
            field: "Computer Science",
            year: "2019",
            honors: ["Dean's List (4 semesters)", "GPA: 3.7/4.0"],
          },
        ],
      },
    },
  });

  console.log(`✅ Created profile for: ${user.name}`);

  // Create a sample job application
  const jobApp = await prisma.jobApplication.create({
    data: {
      userId: user.id,
      rawJD: `Senior Software Engineer – Platform Team
Stripe | Remote, US | $180k–$220k + equity

About the role:
We're looking for a Senior Software Engineer to join our Platform team, building the infrastructure that powers Stripe's products. You'll work on distributed systems at massive scale, collaborate with teams across the company, and have direct impact on millions of developers and businesses.

Requirements:
• 5+ years of software engineering experience
• Strong proficiency in Go, Java, or Ruby
• Experience designing and operating distributed systems at scale
• Deep understanding of databases (SQL and NoSQL)
• Experience with cloud infrastructure (AWS, GCP, or Azure)
• Strong communication skills and ability to work cross-functionally

Responsibilities:
• Design and build highly reliable, scalable platform services
• Lead technical projects from design through production
• Mentor engineers and contribute to engineering culture
• Participate in on-call rotations for platform reliability
• Collaborate with product and infrastructure teams

Nice to have:
• Experience with Kubernetes or container orchestration
• Open source contributions
• Experience at high-growth startups`,
      company: "Stripe",
      jobTitle: "Senior Software Engineer",
      jobLevel: "Senior",
      status: "READY",
      parsedJD: {
        title: "Senior Software Engineer",
        company: "Stripe",
        level: "Senior",
        location: "Remote, US",
        remote: true,
        requirements: {
          must: ["5+ years experience", "Go/Java/Ruby", "Distributed systems", "SQL/NoSQL"],
          preferred: ["Kubernetes", "Open source", "Startup experience"],
        },
        keywords: ["distributed systems", "platform", "Go", "reliability", "scalability", "Kubernetes"],
        techStack: ["Go", "Java", "Ruby", "AWS", "GCP", "Kubernetes"],
        responsibilities: ["Design platform services", "Lead technical projects", "Mentor engineers"],
        culture: ["high-growth", "collaborative", "reliability-focused"],
      },
      resumes: {
        create: [
          {
            userId: user.id,
            variantNumber: 1,
            title: "Technical Depth",
            atsScore: 88,
            relevanceScore: 85,
            clarityScore: 91,
            impactScore: 87,
            overallScore: 88,
            status: "COMPLETE",
            scoreBreakdown: {
              ats: {
                score: 88,
                feedback: "Strong keyword alignment with job requirements. Most critical terms present.",
                improvements: ["Add 'Go' language explicitly", "Include 'on-call' experience"],
              },
              relevance: {
                score: 85,
                feedback: "Good match on distributed systems and platform experience.",
                improvements: ["Emphasize Kubernetes experience more prominently"],
              },
              clarity: {
                score: 91,
                feedback: "Excellent bullet structure with clear action verbs and quantified outcomes.",
                improvements: [],
              },
              impact: {
                score: 87,
                feedback: "Strong quantified metrics. Payment system scale is compelling.",
                improvements: ["Add team/org scope to leadership bullets"],
              },
              keywordsMatched: ["distributed systems", "platform", "Kubernetes", "PostgreSQL", "AWS", "team leadership"],
              keywordsMissing: ["Go", "reliability", "on-call"],
              topStrengths: ["Quantified impact at scale", "Leadership experience", "Cloud platform depth"],
              topWeaknesses: ["Go not explicitly listed", "Missing reliability/SRE signals"],
            },
            content: {
              name: "Alex Johnson",
              email: "demo@resumai.dev",
              github: "github.com/alexj",
              linkedin: "linkedin.com/in/alexjohnson",
              summary:
                "Senior Software Engineer with 5 years building distributed systems and platform infrastructure at scale. Led teams shipping payment infrastructure handling $50M/month. Passionate about reliability, developer tooling, and mentorship.",
              experiences: [],
              projects: [],
              skills: [],
              education: [],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Created sample job application: ${jobApp.company} – ${jobApp.jobTitle}`);
  console.log("\n🎉 Seed complete! You can now sign in with demo@resumai.dev");
  console.log("   Note: Create this user in Clerk dashboard or update clerkId to match your test account.\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
