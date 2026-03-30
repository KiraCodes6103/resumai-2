# ResuMAI — AI-Powered Resume Generator

> Generate 2–5 tailored, ATS-optimized resumes for any job description in under 3 minutes.
> Multi-pass AI evaluation loop with scores, keyword analysis, and PDF/DOCX download.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js)                          │
│  Landing Page · Dashboard · Profile Editor · Job Input ·         │
│  Resume Comparison View · Score Analysis · Download              │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                            │
│                                                                  │
│  API Routes:                                                     │
│  POST /api/jobs         → Create job, enqueue generation        │
│  GET  /api/jobs         → List user's applications              │
│  GET  /api/jobs/[id]/status → Poll for generation status        │
│  PUT  /api/profile      → Save profile, enqueue processing      │
│  GET  /api/profile      → Fetch user profile                    │
│  GET  /api/resumes/[id]/download → Stream PDF or DOCX           │
│  POST /api/queue/process → Internal: process next queued job    │
│  POST /api/webhooks/clerk → Sync users from Clerk               │
└──────┬──────────────────────────┬───────────────────────────────┘
       │                          │
┌──────▼──────┐          ┌────────▼──────────────────────────────┐
│  Clerk Auth │          │           AI Pipeline                  │
│  (Webhooks) │          │                                        │
└─────────────┘          │  1. parseJobDescription()             │
                         │     → Extract: title, company,        │
┌────────────────┐       │       requirements, keywords, stack   │
│ Upstash Redis  │       │                                        │
│                │       │  2. extractStructuredProfile()        │
│ Queue lists:   │       │     → Transform raw text into         │
│ queue:GENERATE │       │       structured JSON with            │
│ queue:PROCESS  │       │       impact-focused bullets          │
│                │       │                                        │
│ Rate limiting  │       │  3. generateResumeVariants()          │
│ rl:generate:*  │       │     → 3-5 variants with different     │
└──────┬─────────┘       │       strategic angles (parallel)     │
       │                 │                                        │
┌──────▼─────────────────▼──┐  4. evaluateResume() × N variants  │
│   PostgreSQL (Neon)        │     → Score: ATS, relevance,      │
│                            │       clarity, impact (0-100)     │
│  users                     │                                    │
│  profiles                  │  5. refineResume() × 2 iterations │
│  experiences               │     → Targeted improvements        │
│  projects                  │       based on lowest scores       │
│  skills                    │                                    │
│  education                 │  6. generatePDF() / generateDOCX() │
│  job_applications          │     → Client-side document         │
│  resumes                   │       generation, no storage       │
│  usage_logs                │       required                    │
│  queue_jobs                └────────────────────────────────────┘
└────────────────────────────┘
```

### Data Flow: Resume Generation

```
User pastes JD
     │
     ▼
POST /api/jobs
     │
     ├── Check credits (≥1 required)
     ├── Check rate limit (5/hour via Redis)
     ├── Create JobApplication record (status: GENERATING)
     ├── Create UsageLog entry
     └── Enqueue job → queue:GENERATE_RESUMES
          │
          ├── Fire-and-forget: POST /api/queue/process
          │
          ▼
     Background Processing (same Vercel function, async)
          │
          ├── parseJobDescription(rawJD)         [1 OpenAI call]
          ├── generateResumeVariants(profile, jd) [N parallel calls]
          │    └── For each variant:
          │         └── generateSingleVariant()   [1 call each]
          └── For each variant:
               ├── evaluateResume()               [1 call]
               ├── if score < 88: refineResume()  [1 call]
               └── evaluateResume() again         [1 call]
                    │
                    ▼
               Save resumes to DB (status: COMPLETE)
               Update JobApplication (status: READY)
               Deduct 1 credit from user
               │
               ▼
Client polls GET /api/jobs/[id]/status every 4s
          │
          ▼
Status changes to READY → Show resume comparison UI
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | Full-stack, SSR, API routes in one repo |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Auth | Clerk | Drop-in auth, webhooks, free 10k MAU |
| Database | PostgreSQL via Neon | Serverless, free tier, scales well |
| ORM | Prisma | Type-safe, great DX, migrations |
| AI | OpenAI gpt-4o-mini | Best cost/quality ratio ($0.00015/1k tokens) |
| Queue | Upstash Redis | Serverless Redis, free 10k cmds/day |
| PDF | pdf-lib | Pure JS, no native deps, works on Vercel |
| DOCX | docx.js | Pure JS Word document generation |
| State | Zustand | Minimal, performant client state |

### Why these choices over alternatives

- **Neon vs Supabase DB**: Neon has better cold start times and larger free tier storage
- **Clerk vs Supabase Auth**: Clerk has better React hooks, pre-built UI, and Vercel integration
- **Upstash vs BullMQ**: BullMQ requires persistent Redis connection; Upstash works in serverless
- **pdf-lib vs puppeteer**: puppeteer requires chromium (~300MB), breaks on Vercel free tier
- **gpt-4o-mini vs GPT-4**: 95% of the quality at ~30x lower cost; ideal for high-volume resume generation

---

## Project Structure

```
resumai/
├── prisma/
│   └── schema.prisma            # Full DB schema
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout (Clerk, fonts)
│   │   ├── globals.css          # Design tokens, animations
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # Sidebar navigation
│   │   │   ├── page.tsx         # Dashboard home (stats, recent)
│   │   │   ├── profile/
│   │   │   │   └── page.tsx     # Profile editor (5 sections)
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx     # Jobs list
│   │   │   │   ├── new/page.tsx # Create new job + generate
│   │   │   │   └── [id]/page.tsx # Resume comparison + scores
│   │   │   └── resumes/
│   │   │       └── page.tsx     # All resumes across jobs
│   │   └── api/
│   │       ├── profile/route.ts        # GET/PUT profile
│   │       ├── jobs/
│   │       │   ├── route.ts            # GET list / POST create
│   │       │   └── [id]/status/route.ts # GET status (polling)
│   │       ├── resumes/
│   │       │   └── [id]/download/route.ts # PDF/DOCX download
│   │       ├── queue/
│   │       │   └── process/route.ts    # Internal job processor
│   │       └── webhooks/
│   │           └── clerk/route.ts      # User sync webhook
│   ├── lib/
│   │   ├── ai/
│   │   │   └── pipeline.ts            # Full AI pipeline
│   │   ├── db/
│   │   │   └── index.ts               # Prisma client singleton
│   │   ├── queue/
│   │   │   └── index.ts               # Queue system (Redis)
│   │   └── utils/
│   │       └── document-generator.ts  # PDF + DOCX generation
│   └── middleware.ts                  # Clerk auth protection
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- A free account on: Neon, Clerk, OpenAI, Upstash

### Step 1: Clone and Install

```bash
git clone https://github.com/you/resumai
cd resumai
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Fill in your `.env.local` — see the section below for where to get each key.

### Step 3: Initialize Database

```bash
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to Neon
```

### Step 4: Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### Step 5: Configure Clerk Webhook (Local)

For local development, use [ngrok](https://ngrok.com) or [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/):

```bash
ngrok http 3000
# Copy the HTTPS URL, e.g. https://abc123.ngrok.io
```

In Clerk Dashboard → Webhooks → Add endpoint:
- URL: `https://abc123.ngrok.io/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`
- Copy the signing secret → `CLERK_WEBHOOK_SECRET`

---

## External Services Setup

### 1. Neon (PostgreSQL) — Free Tier
- **Free tier**: 512MB storage, 10 compute hours/month
- Go to [neon.tech](https://neon.tech) → Create project → Copy connection string
- Set `DATABASE_URL` in `.env.local`

### 2. Clerk (Auth) — Free Tier
- **Free tier**: 10,000 monthly active users
- Go to [clerk.com](https://clerk.com) → Create application → API Keys
- Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- Configure webhook (see Step 5 above)

### 3. OpenAI — Pay as you go
- **Cost estimate**: ~$0.002–0.005 per resume generation (3 variants + eval loops)
- Go to [platform.openai.com](https://platform.openai.com) → API Keys → Create
- Set `OPENAI_API_KEY`
- Recommended: Set a usage limit ($5–10/month for testing)

### 4. Upstash Redis — Free Tier
- **Free tier**: 10,000 commands/day, 256MB
- Go to [upstash.com](https://upstash.com) → Create Redis → REST API
- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 5. Stripe (Optional — Paid Plans)
- Go to [stripe.com](https://stripe.com) → Developers → API Keys
- Create a product with a $12/month price → Copy price ID
- Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRO_PRICE_ID`

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel

- Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
- Add all environment variables from `.env.local`
- Deploy

### 3. Configure Cron Job (Optional but Recommended)

Add `vercel.json` for automatic queue processing:

```json
{
  "crons": [
    {
      "path": "/api/queue/process",
      "schedule": "* * * * *"
    }
  ]
}
```

Add `CRON_SECRET` to Vercel environment variables.

### 4. Update Clerk Webhook

In Clerk Dashboard → Webhooks → Update endpoint URL to your Vercel production URL:
`https://your-app.vercel.app/api/webhooks/clerk`

---

## AI Cost Optimization

### Per Generation Cost Breakdown (gpt-4o-mini)

| Step | Tokens (est.) | Cost |
|------|--------------|------|
| Parse JD | ~1,500 | $0.00023 |
| Extract profile | ~2,000 | $0.00030 |
| Generate 3 variants | ~6,000 | $0.00090 |
| Evaluate 3 variants | ~4,500 | $0.00068 |
| Refine 3 variants | ~6,000 | $0.00090 |
| Final eval 3 variants | ~4,500 | $0.00068 |
| **Total per generation** | **~24,500** | **~$0.0037** |

At $0.004/generation, the free tier of 5 generations costs ~$0.02 total.
Pro plan at $12/month can support ~3,000 generations.

### Optimization Strategies

1. **Cache parsed JDs**: Same JD shouldn't be re-parsed. Hash the JD text and cache in Redis.
2. **Skip refinement for high scores**: Early exit if score ≥ 88 (already implemented).
3. **Profile caching**: Don't re-extract profile on every job — cache until profile changes.
4. **Prompt optimization**: Keep system prompts concise. Every token counts.
5. **Model selection**: Use gpt-4o for complex profiles, gpt-4o-mini for everything else.

---

## Monetization Implementation

### Free Tier (5 credits)
- Users start with `credits: 5` (set in Clerk webhook on user.created)
- Each generation deducts 1 credit
- API checks `user.credits > 0` before enqueuing

### Pro Plan ($12/month)
- Stripe Checkout → Webhook updates `user.plan = PRO`, `user.credits = 9999`
- On subscription cancellation: `user.plan = FREE`, reset credits

### Stripe Integration (Sketch)

```typescript
// POST /api/stripe/checkout
const session = await stripe.checkout.sessions.create({
  customer_email: user.email,
  line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
  mode: "subscription",
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  metadata: { userId: user.id },
});

// POST /api/webhooks/stripe
// Handle: checkout.session.completed → set plan = PRO
// Handle: customer.subscription.deleted → set plan = FREE
```

---

## MVP Roadmap

### Phase 1 — Core (Current Implementation)
- [x] User auth (Clerk)
- [x] Profile editor (raw text → AI structured)
- [x] Job description input
- [x] AI resume generation pipeline
- [x] Multi-variant with different angles
- [x] Evaluation loop with scores
- [x] PDF + DOCX download
- [x] Credit system
- [x] Queue system

### Phase 2 — Quality of Life (Weeks 3–6)
- [ ] Resume preview in-browser (HTML render)
- [ ] Job description URL scraping (Firecrawl)
- [ ] Resume template selection (multiple layouts)
- [ ] LinkedIn profile import
- [ ] Application status tracking (Applied/Interview/Offer)
- [ ] Email notifications when generation completes

### Phase 3 — Growth (Months 2–3)
- [ ] Stripe subscription billing
- [ ] Team/organization accounts
- [ ] Cover letter generation
- [ ] Job board integrations (LinkedIn Easy Apply, Greenhouse)
- [ ] Resume analytics dashboard (views, download counts)
- [ ] A/B testing different resume formats

### Phase 4 — Scale (Months 4+)
- [ ] Vector embeddings for semantic profile matching
- [ ] Persistent Redis worker (Railway or Render)
- [ ] Resume version history
- [ ] Collaborative review (share resume with mentor)
- [ ] Interview prep based on resume + JD
- [ ] Chrome extension for 1-click apply

---

## Performance Optimizations

### Current
- **Parallel variant generation**: 3 variants generated simultaneously with Promise.all
- **Early exit in eval loop**: Stops refining if score ≥ 88
- **Fire-and-forget queue processing**: API responds immediately; processing is async
- **Prisma connection pooling**: Single client instance via global

### Future
- **Redis caching for JD parsing**: Cache parsed JDs by hash for 24 hours
- **Profile embedding cache**: Pre-embed profile into tokens; reuse across jobs
- **Streaming AI responses**: Stream generation progress to client (SSE)
- **Edge runtime for simple API routes**: Move GET routes to edge for faster response
- **CDN for generated PDFs**: Cache PDF bytes in Supabase Storage with signed URLs

---

## Security Considerations

1. **All API routes check Clerk auth** — no unauthenticated access to user data
2. **User data isolation** — all queries filter by `userId` from auth token
3. **Webhook signature verification** — Clerk and Stripe webhooks verified with svix/stripe
4. **Rate limiting** — 5 generations per hour per user via Redis counter
5. **Input validation** — All API inputs validated with Zod schemas
6. **No raw SQL** — Prisma ORM prevents SQL injection
7. **Internal API key** — Queue processor route protected with `x-internal-key` header
8. **Environment secrets** — All sensitive keys in env vars, never committed

---

## Free Tier Limits Summary

| Service | Free Limit | Usage Pattern |
|---------|-----------|--------------|
| Neon DB | 512MB, 10 compute hrs | Easily covers 1k+ users |
| Clerk | 10k MAU | Fine for launch |
| OpenAI | Pay-as-you-go | ~$0.004/generation |
| Upstash Redis | 10k cmds/day | ~6 cmds/generation = 1.6k/day |
| Vercel | 100GB bandwidth | Plenty for early stage |
| Total monthly cost (100 users, 5 gens each) | **~$2** | Pure infra cost |
