// // src/lib/ai/pipeline.ts
// // Core AI pipeline: parse JD → match profile → generate resumes → evaluate → refine

// import OpenAI from "openai";
// import { Profile, JobApplication } from "@prisma/client";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface ParsedJobDescription {
//   title: string;
//   company: string;
//   level: string; // "Senior", "Mid", "Junior", "Staff"
//   location: string;
//   remote: boolean;
//   summary: string;
//   requirements: {
//     must: string[];      // absolute requirements
//     preferred: string[]; // nice-to-have
//   };
//   responsibilities: string[];
//   keywords: string[];    // ATS-critical terms
//   techStack: string[];
//   culture: string[];     // "fast-paced", "collaborative", etc.
//   salaryRange?: string;
// }

// export interface StructuredProfile {
//   name: string;
//   email: string;
//   phone?: string;
//   location?: string;
//   linkedin?: string;
//   github?: string;
//   summary: string;
//   experiences: {
//     company: string;
//     title: string;
//     startDate: string;
//     endDate: string;
//     bullets: string[];
//     technologies: string[];
//   }[];
//   projects: {
//     name: string;
//     description: string;
//     url?: string;
//     techStack: string[];
//     bullets: string[];
//   }[];
//   skills: {
//     category: string;
//     items: string[];
//   }[];
//   education: {
//     institution: string;
//     degree: string;
//     field: string;
//     year: string;
//     honors?: string[];
//   }[];
// }

// export interface ResumeVariant {
//   variantNumber: number;
//   title: string;         // e.g. "Technical Focus", "Leadership Focus"
//   angle: string;         // strategic angle for this variant
//   content: StructuredProfile;
//   scores?: ResumeScores;
//   scoreBreakdown?: ScoreBreakdown;
// }

// export interface ResumeScores {
//   ats: number;
//   relevance: number;
//   clarity: number;
//   impact: number;
//   overall: number;
// }

// export interface ScoreBreakdown {
//   ats: { score: number; feedback: string; improvements: string[] };
//   relevance: { score: number; feedback: string; improvements: string[] };
//   clarity: { score: number; feedback: string; improvements: string[] };
//   impact: { score: number; feedback: string; improvements: string[] };
//   keywordsMatched: string[];
//   keywordsMissing: string[];
//   topStrengths: string[];
//   topWeaknesses: string[];
// }

// // ─── Step 1: Parse Job Description ────────────────────────────────────────────

// export async function parseJobDescription(rawJD: string): Promise<ParsedJobDescription> {
//   console.log("AI: parseJobDescription - calling OpenAI");
//   const response = await openai.chat.completions.create({
//     model: MODEL,
//     temperature: 0.1,
//     response_format: { type: "json_object" },
//     messages: [
//       {
//         role: "system",
//         content: `You are an expert recruiter and ATS specialist. Parse job descriptions with precision.
// Extract ALL technical requirements, keywords, and signals. Return ONLY valid JSON.`,
//       },
//       {
//         role: "user",
//         content: `Parse this job description and return structured JSON:

// ${rawJD}

// Return this exact JSON structure:
// {
//   "title": "Job title",
//   "company": "Company name",
//   "level": "Senior|Mid|Junior|Staff|Principal|IC",
//   "location": "City, State or Remote",
//   "remote": true/false,
//   "summary": "2-3 sentence role summary",
//   "requirements": {
//     "must": ["required skill/experience"],
//     "preferred": ["nice-to-have skill"]
//   },
//   "responsibilities": ["key responsibility"],
//   "keywords": ["ats-critical term"],
//   "techStack": ["specific technology"],
//   "culture": ["culture signal"],
//   "salaryRange": "optional salary range"
// }`,
//       },
//     ],
//   });

//   return JSON.parse(response.choices[0].message.content!) as ParsedJobDescription;
// }

// // ─── Step 2: Extract Structured Profile ────────────────────────────────────────

// export async function extractStructuredProfile(
//   rawExperience: string,
//   rawProjects: string,
//   rawSkills: string,
//   rawEducation: string,
//   rawSummary: string,
//   userMeta: { name: string; email: string }
// ): Promise<StructuredProfile> {
//   console.log("AI: extractStructuredProfile - calling OpenAI");
//   const response = await openai.chat.completions.create({
//     model: MODEL,
//     temperature: 0.2,
//     response_format: { type: "json_object" },
//     messages: [
//       {
//         role: "system",
//         content: `You are an expert career coach. Extract structured, impactful profile data.
// Transform vague descriptions into strong, quantified bullet points using the STAR method.
// Return ONLY valid JSON.`,
//       },
//       {
//         role: "user",
//         content: `Extract structured profile from this raw data:

// === EXPERIENCE ===
// ${rawExperience || "None provided"}

// === PROJECTS ===
// ${rawProjects || "None provided"}

// === SKILLS ===
// ${rawSkills || "None provided"}

// === EDUCATION ===
// ${rawEducation || "None provided"}

// === SUMMARY ===
// ${rawSummary || "None provided"}

// User: ${userMeta.name} (${userMeta.email})

// Return this JSON structure (fill name/email from user meta):
// {
//   "name": "Full Name",
//   "email": "email",
//   "phone": "if mentioned",
//   "location": "if mentioned",
//   "linkedin": "if mentioned",
//   "github": "if mentioned",
//   "summary": "3-4 sentence professional summary",
//   "experiences": [{
//     "company": "Company",
//     "title": "Title",
//     "startDate": "Mon YYYY",
//     "endDate": "Mon YYYY or Present",
//     "bullets": ["Strong action verb + accomplishment + quantified impact"],
//     "technologies": ["tech used"]
//   }],
//   "projects": [{
//     "name": "Project Name",
//     "description": "Brief description",
//     "url": "url if provided",
//     "techStack": ["tech"],
//     "bullets": ["What you built + how + impact"]
//   }],
//   "skills": [{"category": "Category", "items": ["skill"]}],
//   "education": [{
//     "institution": "School",
//     "degree": "BS/MS/PhD",
//     "field": "Field",
//     "year": "YYYY",
//     "honors": ["if any"]
//   }]
// }`,
//       },
//     ],
//   });

//   return JSON.parse(response.choices[0].message.content!) as StructuredProfile;
// }

// // ─── Step 3: Generate Resume Variants ─────────────────────────────────────────

// const VARIANT_ANGLES = [
//   { title: "Technical Depth", angle: "Emphasize technical skills, systems design, and engineering depth. Lead with most relevant tech stack matches." },
//   { title: "Impact & Results", angle: "Lead with quantified business impact, metrics, and outcomes. Show ROI and scale." },
//   { title: "Leadership & Collaboration", angle: "Highlight team leadership, cross-functional work, mentorship, and stakeholder management." },
//   { title: "Growth & Learning", angle: "Show rapid skill acquisition, versatility, and breadth of experience across the stack." },
//   { title: "Domain Alignment", angle: "Mirror the job description's language and domain focus. Maximum keyword density without stuffing." },
// ];

// export async function generateResumeVariants(
//   profile: StructuredProfile,
//   jd: ParsedJobDescription,
//   count: number = 3
// ): Promise<ResumeVariant[]> {
//   const angles = VARIANT_ANGLES.slice(0, count);

//   const variants = await Promise.all(
//     angles.map(async ({ title, angle }, index) => {
//       const content = await generateSingleVariant(profile, jd, angle);
//       return {
//         variantNumber: index + 1,
//         title,
//         angle,
//         content,
//       } as ResumeVariant;
//     })
//   );

//   return variants;
// }

// async function generateSingleVariant(
//   profile: StructuredProfile,
//   jd: ParsedJobDescription,
//   angle: string
// ): Promise<StructuredProfile> {
//   console.log("AI: generateSingleVariant - calling OpenAI");
//   const response = await openai.chat.completions.create({
//     model: MODEL,
//     temperature: 0.4,
//     response_format: { type: "json_object" },
//     messages: [
//       {
//         role: "system",
//         content: `You are an elite resume writer with 15+ years of experience at top recruiting firms.
// You specialize in creating ATS-optimized resumes that land interviews at top companies.

// RULES:
// 1. Every bullet starts with a strong action verb
// 2. Quantify impact wherever possible (%, $, scale, time)
// 3. Naturally incorporate job keywords without stuffing
// 4. Tailor order and emphasis to match the job requirements
// 5. Never invent false information - only reshape/emphasize existing facts
// 6. Return ONLY valid JSON matching the exact input profile structure`,
//       },
//       {
//         role: "user",
//         content: `Create a tailored resume with this specific angle: "${angle}"

// TARGET JOB:
// Title: ${jd.title} at ${jd.company}
// Level: ${jd.level}
// Must-have keywords: ${jd.keywords.join(", ")}
// Required skills: ${jd.requirements.must.join(", ")}
// Tech stack: ${jd.techStack.join(", ")}
// Key responsibilities: ${jd.responsibilities.slice(0, 5).join("; ")}

// USER PROFILE:
// ${JSON.stringify(profile, null, 2)}

// Instructions:
// 1. Rewrite the summary to directly address this role
// 2. Reorder experiences to put most relevant first
// 3. Rewrite bullets to naturally include job keywords
// 4. Quantify impact with realistic numbers based on context
// 5. Highlight skills that match job requirements
// 6. Adjust skill section order for relevance

// Return the SAME JSON structure as the input profile, fully tailored.`,
//       },
//     ],
//   });

//   return JSON.parse(response.choices[0].message.content!) as StructuredProfile;
// }

// // ─── Step 4: Evaluate Resume ───────────────────────────────────────────────────

// export async function evaluateResume(
//   resume: StructuredProfile,
//   jd: ParsedJobDescription
// ): Promise<{ scores: ResumeScores; breakdown: ScoreBreakdown }> {
//   console.log("AI: evaluateResume - calling OpenAI");
//   const response = await openai.chat.completions.create({
//     model: MODEL,
//     temperature: 0.1,
//     response_format: { type: "json_object" },
//     messages: [
//       {
//         role: "system",
//         content: `You are an ATS system and senior recruiter. Evaluate resumes rigorously and fairly.
// Score each dimension 0-100. Be specific in feedback. Return ONLY valid JSON.`,
//       },
//       {
//         role: "user",
//         content: `Evaluate this resume against this job description.

// JOB DESCRIPTION:
// ${JSON.stringify(jd, null, 2)}

// RESUME:
// ${JSON.stringify(resume, null, 2)}

// Return this JSON:
// {
//   "scores": {
//     "ats": 0-100,
//     "relevance": 0-100,
//     "clarity": 0-100,
//     "impact": 0-100,
//     "overall": 0-100
//   },
//   "breakdown": {
//     "ats": {
//       "score": 0-100,
//       "feedback": "explanation",
//       "improvements": ["specific action"]
//     },
//     "relevance": {
//       "score": 0-100,
//       "feedback": "explanation",
//       "improvements": ["specific action"]
//     },
//     "clarity": {
//       "score": 0-100,
//       "feedback": "explanation",
//       "improvements": ["specific action"]
//     },
//     "impact": {
//       "score": 0-100,
//       "feedback": "explanation",
//       "improvements": ["specific action"]
//     },
//     "keywordsMatched": ["keyword found in resume"],
//     "keywordsMissing": ["critical keyword missing"],
//     "topStrengths": ["strength 1", "strength 2", "strength 3"],
//     "topWeaknesses": ["weakness 1", "weakness 2"]
//   }
// }`,
//       },
//     ],
//   });

//   const result = JSON.parse(response.choices[0].message.content!);
//   return { scores: result.scores, breakdown: result.breakdown };
// }

// // ─── Step 5: Iterative Refinement ─────────────────────────────────────────────

// export async function refineResume(
//   resume: StructuredProfile,
//   breakdown: ScoreBreakdown,
//   jd: ParsedJobDescription,
//   iteration: number
// ): Promise<StructuredProfile> {
//   console.log("AI: refineResume - calling OpenAI");
//   // Focus on top 3 improvements from lowest scoring dimension
//   const improvements = [
//     ...breakdown.ats.improvements.slice(0, 2),
//     ...breakdown.relevance.improvements.slice(0, 2),
//     ...breakdown.impact.improvements.slice(0, 1),
//   ].slice(0, 5);

//   const missingKeywords = breakdown.keywordsMissing.slice(0, 8);

//   const response = await openai.chat.completions.create({
//     model: MODEL,
//     temperature: 0.3,
//     response_format: { type: "json_object" },
//     messages: [
//       {
//         role: "system",
//         content: `You are an expert resume optimizer. Make targeted improvements based on feedback.
// Do NOT change factual information. Only rephrase, reorder, and add relevant keywords.
// Return ONLY valid JSON matching the input structure.`,
//       },
//       {
//         role: "user",
//         content: `Iteration ${iteration}: Refine this resume with specific improvements.

// IMPROVEMENTS TO MAKE:
// ${improvements.map((imp, i) => `${i + 1}. ${imp}`).join("\n")}

// MISSING KEYWORDS TO ADD NATURALLY:
// ${missingKeywords.join(", ")}

// CURRENT RESUME:
// ${JSON.stringify(resume, null, 2)}

// TARGET JOB: ${jd.title} at ${jd.company}

// Make the requested improvements while keeping the overall structure intact.
// Return the improved resume in the same JSON structure.`,
//       },
//     ],
//   });

//   return JSON.parse(response.choices[0].message.content!) as StructuredProfile;
// }

// // ─── Full Evaluation Loop ─────────────────────────────────────────────────────

// export async function runEvaluationLoop(
//   variant: ResumeVariant,
//   jd: ParsedJobDescription,
//   maxIterations: number = 2
// ): Promise<ResumeVariant> {
//   let current = variant.content;
//   let lastScores: ResumeScores | undefined;
//   let lastBreakdown: ScoreBreakdown | undefined;

//   for (let i = 0; i < maxIterations; i++) {
//     const { scores, breakdown } = await evaluateResume(current, jd);
//     lastScores = scores;
//     lastBreakdown = breakdown;

//     // If already excellent, stop early — no need to refine or re-evaluate
//     if (scores.overall >= 88) break;

//     // Refine if not last iteration
//     if (i < maxIterations - 1) {
//       current = await refineResume(current, breakdown, jd, i + 1);
//       // After refining, clear lastScores so we know a fresh eval is needed
//       lastScores = undefined;
//     }
//   }

//   // Only run a final evaluation if we refined on the last iteration (scores are stale)
//   if (!lastScores) {
//     const { scores, breakdown } = await evaluateResume(current, jd);
//     lastScores = scores;
//     lastBreakdown = breakdown;
//   }

//   return {
//     ...variant,
//     content: current,
//     scores: lastScores,
//     scoreBreakdown: lastBreakdown,
//   };
// }

// // ─── Master Pipeline ───────────────────────────────────────────────────────────

// export async function runFullPipeline(params: {
//   rawJD: string;
//   profile: StructuredProfile;
//   variantCount?: number;
//   maxIterations?: number;
// }): Promise<{
//   parsedJD: ParsedJobDescription;
//   variants: ResumeVariant[];
// }> {
//   const { rawJD, profile, variantCount = 3, maxIterations = 2 } = params;

//   // Step 1: Parse JD
//   const parsedJD = await parseJobDescription(rawJD);

//   // Step 2: Generate variants
//   const rawVariants = await generateResumeVariants(profile, parsedJD, variantCount);

//   // Step 3: Evaluate + refine each variant (with some parallelism)
//   const refinedVariants = await Promise.all(
//     rawVariants.map((v) => runEvaluationLoop(v, parsedJD, maxIterations))
//   );

//   // Step 4: Sort by overall score
//   refinedVariants.sort((a, b) => (b.scores?.overall ?? 0) - (a.scores?.overall ?? 0));

//   return { parsedJD, variants: refinedVariants };
// }
// src/lib/ai/pipeline.ts
// Core AI pipeline: parse JD → match profile → generate resumes → evaluate → refine

import OpenAI from "openai";
import { Profile, JobApplication } from "@prisma/client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParsedJobDescription {
  title: string;
  company: string;
  level: string; // "Senior", "Mid", "Junior", "Staff"
  location: string;
  remote: boolean;
  summary: string;
  requirements: {
    must: string[];      // absolute requirements
    preferred: string[]; // nice-to-have
  };
  responsibilities: string[];
  keywords: string[];    // ATS-critical terms
  techStack: string[];
  culture: string[];     // "fast-paced", "collaborative", etc.
  salaryRange?: string;
}

export interface StructuredProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  experiences: {
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    bullets: string[];
    technologies: string[];
  }[];
  projects: {
    name: string;
    description: string;
    url?: string;
    techStack: string[];
    bullets: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
    honors?: string[];
  }[];
}

export interface ResumeVariant {
  variantNumber: number;
  title: string;         // e.g. "Technical Focus", "Leadership Focus"
  angle: string;         // strategic angle for this variant
  content: StructuredProfile;
  scores?: ResumeScores;
  scoreBreakdown?: ScoreBreakdown;
}

export interface ResumeScores {
  ats: number;
  relevance: number;
  clarity: number;
  impact: number;
  overall: number;
}

export interface ScoreBreakdown {
  ats: { score: number; feedback: string; improvements: string[] };
  relevance: { score: number; feedback: string; improvements: string[] };
  clarity: { score: number; feedback: string; improvements: string[] };
  impact: { score: number; feedback: string; improvements: string[] };
  keywordsMatched: string[];
  keywordsMissing: string[];
  topStrengths: string[];
  topWeaknesses: string[];
}

// ─── Step 0: Scrape JD from URL ───────────────────────────────────────────────

export async function scrapeJDFromUrl(url: string): Promise<string> {
  console.log("AI: scrapeJDFromUrl - fetching", url);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; CVPiolet/1.0)",
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();

  // Strip all HTML tags, collapse whitespace, trim
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();

  if (text.length < 200) {
    throw new Error("Could not extract enough text from URL. Please paste the job description manually.");
  }

  // Use AI to extract just the job description portion from the page text
  console.log("AI: scrapeJDFromUrl - extracting JD from page text via OpenAI");
  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: `You extract job descriptions from raw webpage text. Return ONLY the job description content — title, company, responsibilities, requirements, qualifications. Strip navigation, ads, footers, cookie notices, and unrelated content. If no job description is found, respond with "NO_JD_FOUND".`,
      },
      {
        role: "user",
        content: `Extract the job description from this webpage text:\n\n${text.slice(0, 12000)}`,
      },
    ],
  });

  const extracted = response.choices[0].message.content?.trim() || "";

  if (!extracted || extracted === "NO_JD_FOUND" || extracted.length < 200) {
    throw new Error("No job description found at this URL. Please paste it manually.");
  }

  return extracted;
}

// ─── Step 1: Parse Job Description ────────────────────────────────────────────

export async function parseJobDescription(rawJD: string): Promise<ParsedJobDescription> {
  console.log("AI: parseJobDescription - calling OpenAI");
  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert recruiter and ATS specialist. Parse job descriptions with precision.
Extract ALL technical requirements, keywords, and signals. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Parse this job description and return structured JSON:

${rawJD}

Return this exact JSON structure:
{
  "title": "Job title",
  "company": "Company name",
  "level": "Senior|Mid|Junior|Staff|Principal|IC",
  "location": "City, State or Remote",
  "remote": true/false,
  "summary": "2-3 sentence role summary",
  "requirements": {
    "must": ["required skill/experience"],
    "preferred": ["nice-to-have skill"]
  },
  "responsibilities": ["key responsibility"],
  "keywords": ["ats-critical term"],
  "techStack": ["specific technology"],
  "culture": ["culture signal"],
  "salaryRange": "optional salary range"
}`,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content!) as ParsedJobDescription;
}

// ─── Step 2: Extract Structured Profile ────────────────────────────────────────

export async function extractStructuredProfile(
  rawExperience: string,
  rawProjects: string,
  rawSkills: string,
  rawEducation: string,
  rawSummary: string,
  userMeta: { name: string; email: string }
): Promise<StructuredProfile> {
  console.log("AI: extractStructuredProfile - calling OpenAI");
  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert career coach. Extract structured, impactful profile data.
Transform vague descriptions into strong, quantified bullet points using the STAR method.
Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Extract structured profile from this raw data:

=== EXPERIENCE ===
${rawExperience || "None provided"}

=== PROJECTS ===
${rawProjects || "None provided"}

=== SKILLS ===
${rawSkills || "None provided"}

=== EDUCATION ===
${rawEducation || "None provided"}

=== SUMMARY ===
${rawSummary || "None provided"}

User: ${userMeta.name} (${userMeta.email})

Return this JSON structure (fill name/email from user meta):
{
  "name": "Full Name",
  "email": "email",
  "phone": "if mentioned",
  "location": "if mentioned",
  "linkedin": "if mentioned",
  "github": "if mentioned",
  "summary": "3-4 sentence professional summary",
  "experiences": [{
    "company": "Company",
    "title": "Title",
    "startDate": "Mon YYYY",
    "endDate": "Mon YYYY or Present",
    "bullets": ["Strong action verb + accomplishment + quantified impact"],
    "technologies": ["tech used"]
  }],
  "projects": [{
    "name": "Project Name",
    "description": "Brief description",
    "url": "url if provided",
    "techStack": ["tech"],
    "bullets": ["What you built + how + impact"]
  }],
  "skills": [{"category": "Category", "items": ["skill"]}],
  "education": [{
    "institution": "School",
    "degree": "BS/MS/PhD",
    "field": "Field",
    "year": "YYYY",
    "honors": ["if any"]
  }]
}`,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content!) as StructuredProfile;
}

// ─── Step 3: Generate Resume Variants ─────────────────────────────────────────

const VARIANT_ANGLES = [
  { title: "Technical Depth", angle: "Emphasize technical skills, systems design, and engineering depth. Lead with most relevant tech stack matches." },
  { title: "Impact & Results", angle: "Lead with quantified business impact, metrics, and outcomes. Show ROI and scale." },
  { title: "Leadership & Collaboration", angle: "Highlight team leadership, cross-functional work, mentorship, and stakeholder management." },
  { title: "Growth & Learning", angle: "Show rapid skill acquisition, versatility, and breadth of experience across the stack." },
  { title: "Domain Alignment", angle: "Mirror the job description's language and domain focus. Maximum keyword density without stuffing." },
];

export async function generateResumeVariants(
  profile: StructuredProfile,
  jd: ParsedJobDescription,
  count: number = 3
): Promise<ResumeVariant[]> {
  const angles = VARIANT_ANGLES.slice(0, count);

  const variants = await Promise.all(
    angles.map(async ({ title, angle }, index) => {
      const content = await generateSingleVariant(profile, jd, angle);
      return {
        variantNumber: index + 1,
        title,
        angle,
        content,
      } as ResumeVariant;
    })
  );

  return variants;
}

async function generateSingleVariant(
  profile: StructuredProfile,
  jd: ParsedJobDescription,
  angle: string
): Promise<StructuredProfile> {
  console.log("AI: generateSingleVariant - calling OpenAI");
  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an elite resume writer with 15+ years of experience at top recruiting firms.
You specialize in creating ATS-optimized resumes that land interviews at top companies.

STRICT HONESTY RULES — these override everything else:
1. NEVER invent metrics, numbers, percentages, or claims not present in the source profile
2. NEVER add technologies, tools, or skills the candidate did not mention
3. NEVER fabricate project outcomes, team sizes, revenue figures, or timelines
4. If a bullet has no metric in the source, do NOT add one — rephrase powerfully without inventing numbers
5. Only HIGHLIGHT and REORDER what already exists — do not manufacture new facts

FORMATTING RULES:
6. Every bullet starts with a strong action verb
7. Naturally incorporate job keywords only where they genuinely apply to existing experience
8. Tailor order and emphasis to match the job requirements
9. Return ONLY valid JSON matching the exact input profile structure`,
      },
      {
        role: "user",
        content: `Create a tailored resume with this specific angle: "${angle}"

TARGET JOB:
Title: ${jd.title} at ${jd.company}
Level: ${jd.level}
Must-have keywords: ${jd.keywords.join(", ")}
Required skills: ${jd.requirements.must.join(", ")}
Tech stack: ${jd.techStack.join(", ")}
Key responsibilities: ${jd.responsibilities.slice(0, 5).join("; ")}

USER PROFILE (source of truth — do not add anything not present here):
${JSON.stringify(profile, null, 2)}

Instructions:
1. Rewrite the summary to directly address this role using only facts from the profile
2. Reorder experiences and projects to put the most relevant ones first
3. For each bullet: rephrase to include job keywords ONLY if that keyword genuinely describes what was done
4. Surface and emphasise existing metrics — do not invent new ones
5. For projects: select and highlight the aspects most relevant to this role; de-emphasise unrelated details
6. Adjust skill section order so matching skills appear first

Return the SAME JSON structure as the input profile, fully tailored.`,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content!) as StructuredProfile;
}

// ─── Step 4: Evaluate Resume ───────────────────────────────────────────────────

export async function evaluateResume(
  resume: StructuredProfile,
  jd: ParsedJobDescription
): Promise<{ scores: ResumeScores; breakdown: ScoreBreakdown }> {
  console.log("AI: evaluateResume - calling OpenAI");
  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an ATS system and senior recruiter. Evaluate resumes rigorously and fairly.
Score each dimension 0-100. Be specific in feedback. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Evaluate this resume against this job description.

JOB DESCRIPTION:
${JSON.stringify(jd, null, 2)}

RESUME:
${JSON.stringify(resume, null, 2)}

Return this JSON:
{
  "scores": {
    "ats": 0-100,
    "relevance": 0-100,
    "clarity": 0-100,
    "impact": 0-100,
    "overall": 0-100
  },
  "breakdown": {
    "ats": {
      "score": 0-100,
      "feedback": "explanation",
      "improvements": ["specific action"]
    },
    "relevance": {
      "score": 0-100,
      "feedback": "explanation",
      "improvements": ["specific action"]
    },
    "clarity": {
      "score": 0-100,
      "feedback": "explanation",
      "improvements": ["specific action"]
    },
    "impact": {
      "score": 0-100,
      "feedback": "explanation",
      "improvements": ["specific action"]
    },
    "keywordsMatched": ["keyword found in resume"],
    "keywordsMissing": ["critical keyword missing"],
    "topStrengths": ["strength 1", "strength 2", "strength 3"],
    "topWeaknesses": ["weakness 1", "weakness 2"]
  }
}`,
      },
    ],
  });

  const result = JSON.parse(response.choices[0].message.content!);
  return { scores: result.scores, breakdown: result.breakdown };
}

// ─── Step 5: Iterative Refinement ─────────────────────────────────────────────

export async function refineResume(
  resume: StructuredProfile,
  breakdown: ScoreBreakdown,
  jd: ParsedJobDescription,
  iteration: number
): Promise<StructuredProfile> {
  console.log("AI: refineResume - calling OpenAI");
  // Focus on top 3 improvements from lowest scoring dimension
  const improvements = [
    ...breakdown.ats.improvements.slice(0, 2),
    ...breakdown.relevance.improvements.slice(0, 2),
    ...breakdown.impact.improvements.slice(0, 1),
  ].slice(0, 5);

  const missingKeywords = breakdown.keywordsMissing.slice(0, 8);

  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert resume optimizer. Make targeted improvements based on feedback.

STRICT HONESTY RULES:
- Do NOT invent metrics, numbers, or claims not already in the resume
- Do NOT add technologies or skills not already listed
- Only rephrase, reorder, and incorporate keywords where they genuinely fit existing content
- If a suggested improvement would require fabricating information, skip it
Return ONLY valid JSON matching the input structure.`,
      },
      {
        role: "user",
        content: `Iteration ${iteration}: Refine this resume with specific improvements.

IMPROVEMENTS TO MAKE:
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join("\n")}

MISSING KEYWORDS TO ADD NATURALLY:
${missingKeywords.join(", ")}

CURRENT RESUME:
${JSON.stringify(resume, null, 2)}

TARGET JOB: ${jd.title} at ${jd.company}

Make the requested improvements while keeping the overall structure intact.
Return the improved resume in the same JSON structure.`,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content!) as StructuredProfile;
}

// ─── Full Evaluation Loop ─────────────────────────────────────────────────────

export async function runEvaluationLoop(
  variant: ResumeVariant,
  jd: ParsedJobDescription,
  maxIterations: number = 2
): Promise<ResumeVariant> {
  let current = variant.content;
  let lastScores: ResumeScores | undefined;
  let lastBreakdown: ScoreBreakdown | undefined;

  for (let i = 0; i < maxIterations; i++) {
    const { scores, breakdown } = await evaluateResume(current, jd);
    lastScores = scores;
    lastBreakdown = breakdown;

    // If already excellent, stop early — no need to refine or re-evaluate
    if (scores.overall >= 88) break;

    // Refine if not last iteration
    if (i < maxIterations - 1) {
      current = await refineResume(current, breakdown, jd, i + 1);
      // After refining, clear lastScores so we know a fresh eval is needed
      lastScores = undefined;
    }
  }

  // Only run a final evaluation if we refined on the last iteration (scores are stale)
  if (!lastScores) {
    const { scores, breakdown } = await evaluateResume(current, jd);
    lastScores = scores;
    lastBreakdown = breakdown;
  }

  return {
    ...variant,
    content: current,
    scores: lastScores,
    scoreBreakdown: lastBreakdown,
  };
}

// ─── Master Pipeline ───────────────────────────────────────────────────────────

export async function runFullPipeline(params: {
  rawJD: string;
  profile: StructuredProfile;
  variantCount?: number;
  maxIterations?: number;
}): Promise<{
  parsedJD: ParsedJobDescription;
  variants: ResumeVariant[];
}> {
  const { rawJD, profile, variantCount = 3, maxIterations = 2 } = params;

  // Step 1: Parse JD
  const parsedJD = await parseJobDescription(rawJD);

  // Step 2: Generate variants
  const rawVariants = await generateResumeVariants(profile, parsedJD, variantCount);

  // Step 3: Evaluate + refine each variant (with some parallelism)
  const refinedVariants = await Promise.all(
    rawVariants.map((v) => runEvaluationLoop(v, parsedJD, maxIterations))
  );

  // Step 4: Sort by overall score
  refinedVariants.sort((a, b) => (b.scores?.overall ?? 0) - (a.scores?.overall ?? 0));

  return { parsedJD, variants: refinedVariants };
}