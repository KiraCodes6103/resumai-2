// // src/app/dashboard/jobs/new/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Loader2,
//   Sparkles,
//   FileText,
//   ChevronDown,
//   ChevronUp,
//   AlertCircle,
//   Zap,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";

// export default function NewJobPage() {
//   const router = useRouter();
//   const [rawJD, setRawJD] = useState("");
//   const [jobUrl, setJobUrl] = useState("");
//   const [variantCount, setVariantCount] = useState(3);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [showAdvanced, setShowAdvanced] = useState(false);

//   const handleSubmit = async () => {
//     if (rawJD.trim().length < 100) {
//       setError("Please paste the full job description (at least 100 characters).");
//       return;
//     }
//     setError("");
//     setSubmitting(true);

//     try {
//       const res = await fetch("/api/jobs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ rawJD, jobUrl: jobUrl || undefined, variantCount }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Something went wrong. Please try again.");
//         return;
//       }

//       // Redirect to job status page with polling
//       router.push(`/dashboard/jobs/${data.jobApplicationId}`);
//     } catch {
//       setError("Network error. Please check your connection and try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const wordCount = rawJD.trim().split(/\s+/).filter(Boolean).length;

//   return (
//     <div className="max-w-2xl space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold">New Job Application</h1>
//         <p className="text-sm text-muted-foreground mt-1">
//           Paste the job description and we'll generate tailored resumes in 1–3 minutes
//         </p>
//       </div>

//       {/* Optional URL */}
//       <Card>
//         <CardContent className="space-y-4 p-5">
//         <div>
//           <label className="text-sm font-medium block mb-1.5">
//             Job posting URL{" "}
//             <span className="text-muted-foreground font-normal">(optional)</span>
//           </label>
//           <Input
//             type="url"
//             value={jobUrl}
//             onChange={(e) => setJobUrl(e.target.value)}
//             placeholder="https://jobs.company.com/..."
//             className="bg-secondary/50"
//           />
//           <p className="text-xs text-muted-foreground mt-1">
//             For reference only — paste the full text below for best results
//           </p>
//         </div>
//         </CardContent>
//       </Card>

//       {/* JD Text Area */}
//       <Card>
//         <CardContent className="p-5">
//         <div className="flex items-center justify-between mb-1.5">
//           <label className="text-sm font-medium">
//             Job Description <span className="text-red-500">*</span>
//           </label>
//           <Badge variant={wordCount > 100 ? "success" : "secondary"}>{wordCount} words</Badge>
//         </div>
//         <Textarea
//           value={rawJD}
//           onChange={(e) => setRawJD(e.target.value)}
//           placeholder={`Paste the complete job description here...

// Example:
// Senior Software Engineer - Platform Team
// Acme Corp | Remote | $150k–$180k

// About the role:
// We're looking for a Senior Software Engineer to join our Platform team...

// Requirements:
// • 5+ years of backend development experience
// • Strong proficiency in Go or Python
// • Experience with distributed systems
// • PostgreSQL, Redis, Kubernetes
// ...`}
//           className="h-72 resize-none bg-secondary/50 leading-relaxed placeholder:text-muted-foreground/50"
//         />
//         {wordCount > 0 && wordCount < 80 && (
//           <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
//             <AlertCircle className="w-3 h-3" />
//             Paste the full job description for better results
//           </p>
//         )}
//         </CardContent>
//       </Card>

//       {/* Advanced Options */}
//       <Card className="overflow-hidden">
//         <button
//           onClick={() => setShowAdvanced(!showAdvanced)}
//           className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium hover:bg-secondary/50 transition-colors"
//         >
//           <span>Advanced Options</span>
//           {showAdvanced ? (
//             <ChevronUp className="w-4 h-4 text-muted-foreground" />
//           ) : (
//             <ChevronDown className="w-4 h-4 text-muted-foreground" />
//           )}
//         </button>
//         {showAdvanced && (
//           <CardContent className="space-y-4 border-t border-border px-5 pb-5 pt-4">
//             <div>
//               <label className="text-sm font-medium block mb-3">
//                 Number of resume variants
//               </label>
//               <div className="flex gap-2">
//                 {[1, 2, 3, 4, 5].map((n) => (
//                   <Button
//                     key={n}
//                     onClick={() => setVariantCount(n)}
//                     className={`h-10 w-10 text-sm font-medium ${
//                       variantCount === n
//                         ? "bg-primary text-white"
//                         : "bg-secondary text-muted-foreground hover:border-primary/50"
//                     }`}
//                     variant={variantCount === n ? "default" : "outline"}
//                   >
//                     {n}
//                   </Button>
//                 ))}
//               </div>
//               <p className="text-xs text-muted-foreground mt-2">
//                 Each variant uses a different strategic angle. 3 is recommended.
//               </p>
//             </div>
//           </CardContent>
//         )}
//       </Card>

//       {/* Error */}
//       {error && (
//         <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
//           <AlertCircle className="w-4 h-4 flex-shrink-0" />
//           {error}
//         </div>
//       )}

//       {/* Submit */}
//       <div className="flex items-center gap-4">
//         <Button
//           onClick={handleSubmit}
//           disabled={submitting || rawJD.length < 100}
//           size="lg"
//           className="shadow-lg shadow-primary/20"
//         >
//           {submitting ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Starting generation...
//             </>
//           ) : (
//             <>
//               <Sparkles className="w-4 h-4" />
//               Generate {variantCount} Resume{variantCount !== 1 ? "s" : ""}
//             </>
//           )}
//         </Button>
//         <p className="text-xs text-muted-foreground flex items-center gap-1">
//           <Zap className="w-3 h-3" />
//           Uses 1 credit · Takes ~2 minutes
//         </p>
//       </div>

//       {/* What happens next */}
//       <Card className="bg-secondary/50">
//         <CardContent className="p-4">
//         <p className="text-xs font-medium text-muted-foreground mb-2">What happens next:</p>
//         <ol className="text-xs text-muted-foreground space-y-1.5">
//           {[
//             "AI extracts keywords and requirements from your JD",
//             "Matches your profile against role requirements",
//             `Generates ${variantCount} tailored resume variants`,
//             "Evaluates and refines each for ATS score + clarity",
//             "Delivers scored resumes ready for PDF/DOCX download",
//           ].map((step, i) => (
//             <li key={i} className="flex items-start gap-2">
//               <span className="text-primary font-medium w-3 flex-shrink-0">{i + 1}.</span>
//               {step}
//             </li>
//           ))}
//         </ol>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// src/app/dashboard/jobs/new/page.tsx
// src/app/dashboard/jobs/new/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Zap,
  Link,
  FileText,
  CheckCircle2,
  Circle,
  Loader,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// --- Pipeline step definitions ---
function buildSteps(variantCount: number, hasUrl: boolean) {
  const steps: { label: string; duration: number }[] = [];
  if (hasUrl) steps.push({ label: "Fetching job posting from URL", duration: 6000 });
  steps.push({ label: "Parsing job requirements & keywords", duration: 5000 });
  steps.push({ label: "Analysing your profile", duration: 4000 });
  for (let i = 1; i <= variantCount; i++) {
    steps.push({ label: `Crafting Resume ${i}`, duration: 12000 });
    steps.push({ label: `Scoring & refining Resume ${i}`, duration: 8000 });
  }
  steps.push({ label: "Finalising & saving resumes", duration: 3000 });
  return steps;
}

function ProgressOverlay({
  variantCount,
  hasUrl,
  onDone,
}: {
  variantCount: number;
  hasUrl: boolean;
  onDone: () => void;
}) {
  const steps = buildSteps(variantCount, hasUrl);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  // Advance through steps using their durations as weights
  useEffect(() => {
    let stepIndex = 0;
    let elapsed = 0;
    const totalDuration = steps.reduce((s, x) => s + x.duration, 0);

    const tick = setInterval(() => {
      elapsed += 200;

      // Figure out which step we're in
      let cum = 0;
      for (let i = 0; i < steps.length; i++) {
        cum += steps[i].duration;
        if (elapsed < cum) {
          if (stepIndex !== i) stepIndex = i;
          setCurrentStep(i);
          break;
        }
      }

      setProgress(Math.min((elapsed / totalDuration) * 95, 95));
    }, 200);

    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the real fetch resolves, onDone is called from parent — we flash to 100%
  useEffect(() => {
    if (!doneRef.current) return;
    setProgress(100);
    setCurrentStep(steps.length - 1);
  });

  const pct = Math.round(progress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <Card className="border shadow-2xl">
          <CardContent className="p-8 space-y-6">

            {/* Animated icon */}
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-lg font-semibold">Generating your resumes</h2>
              <p className="text-sm text-muted-foreground">
                This takes 1–3 minutes — sit tight!
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2.5">
              {steps.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                      done
                        ? "text-muted-foreground"
                        : active
                        ? "text-foreground font-medium"
                        : "text-muted-foreground/40"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : active ? (
                      <Loader className="w-4 h-4 text-primary flex-shrink-0 animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs text-muted-foreground pt-1">
              Don't close this tab — we'll redirect you automatically
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function NewJobPage() {
  const router = useRouter();
  const [rawJD, setRawJD] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [variantCount, setVariantCount] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasUrl = jobUrl.trim().length > 0;
  const hasJD = rawJD.trim().length >= 100;
  const wordCount = rawJD.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = hasUrl || hasJD;
  const urlOnly = hasUrl && !hasJD;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Please provide a job posting URL or paste the job description.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawJD, jobUrl: jobUrl || undefined, variantCount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push(`/dashboard/jobs/${data.jobApplicationId}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitting && (
        <ProgressOverlay
          variantCount={variantCount}
          hasUrl={urlOnly}
          onDone={() => {}}
        />
      )}

      <div className={`max-w-2xl space-y-6 ${submitting ? "pointer-events-none select-none" : ""}`}>
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">New Job Application</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Provide a job URL or paste the description — we'll generate tailored resumes in 1–3 minutes
          </p>
        </div>

        {/* URL Field */}
        <Card className={hasUrl ? "ring-2 ring-primary/30 border-primary/40" : ""}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <Link className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium">
                Job posting URL <span className="text-red-500">*</span>
              </label>
              {hasUrl && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  ✓ will auto-extract JD
                </Badge>
              )}
            </div>
            <Input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://jobs.company.com/..."
              className="bg-secondary/50"
            />
            {!hasUrl ? (
              <p className="text-xs text-muted-foreground mt-2">
                Paste the job URL and we'll automatically extract the description for you
              </p>
            ) : (
              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                We'll scrape and extract the job description from this URL — no need to paste it below
              </p>
            )}
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium px-1">or paste manually</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* JD Text Area */}
        <Card className={urlOnly ? "opacity-50" : ""}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">
                  Job Description{" "}
                  {!hasUrl ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-muted-foreground font-normal">(optional — URL provided)</span>
                  )}
                </label>
              </div>
              <Badge variant={wordCount > 100 ? "success" : "secondary"}>
                {wordCount} words
              </Badge>
            </div>

            {urlOnly && (
              <div className="mb-3 flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
                <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-primary/80">
                  You've provided a URL — we'll extract the job description automatically. You can skip this field.
                </p>
              </div>
            )}

            <Textarea
              value={rawJD}
              onChange={(e) => setRawJD(e.target.value)}
              disabled={submitting}
              placeholder={`Paste the complete job description here...

Example:
Senior Software Engineer - Platform Team
Acme Corp | Remote | $150k–$180k

About the role:
We're looking for a Senior Software Engineer to join our Platform team...

Requirements:
• 5+ years of backend development experience
• Strong proficiency in Go or Python
• Experience with distributed systems
• PostgreSQL, Redis, Kubernetes
...`}
              className="h-64 resize-none bg-secondary/50 leading-relaxed placeholder:text-muted-foreground/50"
            />

            {wordCount > 0 && wordCount < 80 && !hasUrl && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Paste the full job description for better results
              </p>
            )}
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <span>Advanced Options</span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {showAdvanced && (
            <CardContent className="space-y-4 border-t border-border px-5 pb-5 pt-4">
              <div>
                <label className="text-sm font-medium block mb-3">
                  Number of resume variants
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                      key={n}
                      onClick={() => setVariantCount(n)}
                      className={`h-10 w-10 text-sm font-medium ${
                        variantCount === n
                          ? "bg-primary text-white"
                          : "bg-secondary text-muted-foreground hover:border-primary/50"
                      }`}
                      variant={variantCount === n ? "default" : "outline"}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Each variant uses a different strategic angle. 3 is recommended.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
            size="lg"
            className="shadow-lg shadow-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            Generate {variantCount} Resume{variantCount !== 1 ? "s" : ""}
          </Button>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Uses 1 credit · Takes ~2 minutes
          </p>
        </div>

        {/* What happens next */}
        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">What happens next:</p>
            <ol className="text-xs text-muted-foreground space-y-1.5">
              {[
                urlOnly
                  ? "AI fetches and extracts the job description from your URL"
                  : "AI extracts keywords and requirements from your JD",
                "Matches your profile against role requirements",
                `Generates ${variantCount} tailored resume variants`,
                "Evaluates and refines each for ATS score + clarity",
                "Delivers scored resumes ready for PDF/DOCX download",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-medium w-3 flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
}