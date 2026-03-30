// src/app/dashboard/jobs/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Download, ChevronRight, CheckCircle2, AlertCircle,
  Sparkles, FileText, ArrowLeft, RefreshCw, Eye, Star,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScoreBreakdown = {
  ats: { score: number; feedback: string; improvements: string[] };
  relevance: { score: number; feedback: string; improvements: string[] };
  clarity: { score: number; feedback: string; improvements: string[] };
  impact: { score: number; feedback: string; improvements: string[] };
  keywordsMatched: string[];
  keywordsMissing: string[];
  topStrengths: string[];
  topWeaknesses: string[];
};

type Resume = {
  id: string;
  variantNumber: number;
  title: string;
  atsScore: number;
  relevanceScore: number;
  clarityScore: number;
  impactScore: number;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  status: string;
  pdfUrl: string | null;
  docxUrl: string | null;
  createdAt: string;
};

type JobDetail = {
  id: string;
  status: string;
  company: string;
  jobTitle: string;
  jobLevel: string;
  parsedJD: {
    keywords: string[];
    requirements: { must: string[]; preferred: string[] };
    techStack: string[];
  } | null;
  resumes: Resume[];
  createdAt: string;
};

const POLL_INTERVAL = 4000;

// ─── Score helpers ─────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 85) return { text: "text-emerald-600", bg: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700 border-emerald-200", hex: "#10b981" };
  if (s >= 70) return { text: "text-blue-600", bg: "bg-blue-500", light: "bg-blue-50 text-blue-700 border-blue-200", hex: "#3b82f6" };
  if (s >= 55) return { text: "text-amber-600", bg: "bg-amber-500", light: "bg-amber-50 text-amber-700 border-amber-200", hex: "#f59e0b" };
  return { text: "text-red-500", bg: "bg-red-500", light: "bg-red-50 text-red-600 border-red-200", hex: "#ef4444" };
}

function scoreLabel(s: number) {
  if (s >= 90) return "Excellent";
  if (s >= 80) return "Strong";
  if (s >= 70) return "Good";
  if (s >= 55) return "Fair";
  return "Needs Work";
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const { hex } = scoreColor(score);
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={hex} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circ} ${circ}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold" style={{ fontSize: size * 0.24 }}>{score}</span>
      </div>
    </div>
  );
}

// ─── Mini score bar ───────────────────────────────────────────────────────────

function MiniBar({ label, score }: { label: string; score: number }) {
  const { bg, text } = scoreColor(score);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
        <span className={`text-[10px] font-bold ${text}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${bg} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

// ─── PDF Preview ──────────────────────────────────────────────────────────────

function PdfPreview({ resumeId }: { resumeId: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (prevId.current === resumeId) return;
    prevId.current = resumeId;

    let url: string;
    setLoading(true);
    setError(false);
    setBlobUrl(null);

    fetch(`/api/resumes/${resumeId}/download?format=pdf`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.blob();
      })
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-secondary/30 rounded-xl min-h-[500px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading preview…</p>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-secondary/30 rounded-xl min-h-[500px]">
        <FileText className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Preview unavailable</p>
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      className="w-full flex-1 rounded-xl border border-border min-h-[680px]"
      title="Resume Preview"
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const selectedResumeRef = useRef<Resume | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "analysis">("preview");
  const [activeScoreTab, setActiveScoreTab] = useState<"ats" | "relevance" | "clarity" | "impact">("ats");
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${id}/status`);
    if (res.ok) {
      const data: JobDetail = await res.json();
      setJob(data);
      if (data.resumes.length > 0 && !selectedResumeRef.current) {
        setSelectedResume(data.resumes[0]);
        selectedResumeRef.current = data.resumes[0];
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchJob(); }, [fetchJob]);

  useEffect(() => {
    if (!job || job.status === "READY" || job.status === "FAILED") return;
    const interval = setInterval(fetchJob, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [job, fetchJob]);

  const handleDownload = async (resumeId: string, format: "pdf" | "docx") => {
    setDownloading(`${resumeId}-${format}`);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/download?format=${format}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} downloaded`);
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Job application not found</p>
        <Link href="/dashboard/jobs" className="text-primary text-sm mt-2 hover:underline inline-block">
          Back to applications
        </Link>
      </div>
    );
  }

  const isGenerating = job.status === "GENERATING" || job.status === "DRAFT";

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-3 h-3" /> All Applications
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold leading-tight">
              {job.jobTitle || "Untitled Role"}
              {job.company && (
                <span className="text-muted-foreground font-normal"> @ {job.company}</span>
              )}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {job.jobLevel && (
                <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                  {job.jobLevel}
                </span>
              )}
              {job.status === "READY" && (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  {job.resumes.length} resume{job.resumes.length !== 1 ? "s" : ""} ready
                </span>
              )}
              {isGenerating && (
                <span className="text-xs font-medium text-amber-600 flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Generating…
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Generating state ── */}
      {isGenerating && (
        <Card>
          <CardContent className="p-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="font-semibold text-lg mb-2">AI is crafting your resumes</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Analysing the job description, matching your profile, and running evaluation loops to maximise your scores.
            </p>
            <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
              {["Parsing job description", "Matching profile to requirements", "Generating resume variants", "Running ATS evaluation + refinement"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  </div>
                  {step}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-5">This page auto-refreshes every 4 seconds</p>
          </CardContent>
        </Card>
      )}

      {/* ── Main layout: sidebar + content ── */}
      {job.resumes.length > 0 && (
        <div className="flex gap-6 items-start">

          {/* ── Left sidebar: variant cards ── */}
          <div className="w-64 flex-shrink-0 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Resume Variants
            </p>

            {job.resumes.map((resume) => {
              const selected = selectedResume?.id === resume.id;
              const { text, hex } = scoreColor(resume.overallScore);
              return (
                <button
                  key={resume.id}
                  onClick={() => {
                    setSelectedResume(resume);
                    selectedResumeRef.current = resume;
                    setActiveTab("preview");
                  }}
                  className={`w-full text-left rounded-2xl border p-4 space-y-3 transition-all duration-200 ${
                    selected
                      ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  {/* Variant header */}
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      selected ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                    }`}>
                      {resume.variantNumber}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight truncate">{resume.title}</p>
                    </div>
                  </div>

                  {/* Overall score */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Overall</span>
                    <span className={`text-sm font-bold ${text}`}>{resume.overallScore}</span>
                  </div>

                  {/* Score bars */}
                  <div className="space-y-1.5">
                    <MiniBar label="ATS" score={resume.atsScore} />
                    <MiniBar label="Relevance" score={resume.relevanceScore} />
                    <MiniBar label="Clarity" score={resume.clarityScore} />
                    <MiniBar label="Impact" score={resume.impactScore} />
                  </div>

                  {/* Best badge */}
                  {resume.variantNumber === 1 && (
                    <div className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      Highest score
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Right panel ── */}
          {selectedResume && (
            <div className="flex-1 min-w-0 space-y-4">

              {/* Tab bar + download buttons */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex bg-secondary rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "preview"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "analysis"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Score Analysis
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedResume.id, "docx")}
                    disabled={!!downloading}
                    className="gap-1.5"
                  >
                    {downloading === `${selectedResume.id}-docx` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    DOCX
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(selectedResume.id, "pdf")}
                    disabled={!!downloading}
                    className="gap-1.5 shadow-sm shadow-primary/20"
                  >
                    {downloading === `${selectedResume.id}-pdf` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* ── Preview tab ── */}
              {activeTab === "preview" && (
                <div className="flex flex-col" style={{ minHeight: 700 }}>
                  <PdfPreview resumeId={selectedResume.id} />
                </div>
              )}

              {/* ── Analysis tab ── */}
              {activeTab === "analysis" && (
                <div className="space-y-4">

                  {/* Overall score card */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <ScoreRing score={selectedResume.overallScore} size={80} />
                        <div>
                          <p className={`text-2xl font-bold mb-0.5 ${scoreColor(selectedResume.overallScore).text}`}>
                            {scoreLabel(selectedResume.overallScore)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Overall score — {selectedResume.title}
                          </p>
                          <div className="flex gap-3 mt-3">
                            {(["ats", "relevance", "clarity", "impact"] as const).map((k) => {
                              const score = selectedResume[`${k}Score` as keyof Resume] as number;
                              return (
                                <div key={k} className="text-center">
                                  <p className={`text-sm font-bold ${scoreColor(score).text}`}>{score}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase">{k}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dimension tabs */}
                  {selectedResume.scoreBreakdown && (
                    <Card className="overflow-hidden">
                      <div className="flex border-b border-border">
                        {(["ats", "relevance", "clarity", "impact"] as const).map((tab) => {
                          const score = selectedResume[`${tab}Score` as keyof Resume] as number;
                          const active = activeScoreTab === tab;
                          return (
                            <button
                              key={tab}
                              onClick={() => setActiveScoreTab(tab)}
                              className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${
                                active
                                  ? "border-primary text-foreground bg-primary/5"
                                  : "border-transparent text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <div className="uppercase tracking-wide">{tab}</div>
                              <div className={`text-base font-bold mt-0.5 ${scoreColor(score).text}`}>{score}</div>
                            </button>
                          );
                        })}
                      </div>
                      <CardContent className="p-5 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedResume.scoreBreakdown[activeScoreTab].feedback}
                        </p>
                        {selectedResume.scoreBreakdown[activeScoreTab].improvements.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-2.5">Improvement suggestions</p>
                            <ul className="space-y-2">
                              {selectedResume.scoreBreakdown[activeScoreTab].improvements.map((imp, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <ChevronRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                  {imp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Keywords */}
                  {selectedResume.scoreBreakdown && (
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 space-y-2.5">
                          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Keywords Matched ({selectedResume.scoreBreakdown.keywordsMatched.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedResume.scoreBreakdown.keywordsMatched.slice(0, 12).map((kw) => (
                              <span key={kw} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 space-y-2.5">
                          <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Keywords Missing ({selectedResume.scoreBreakdown.keywordsMissing.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedResume.scoreBreakdown.keywordsMissing.slice(0, 12).map((kw) => (
                              <span key={kw} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Strengths / Weaknesses */}
                  {selectedResume.scoreBreakdown?.topStrengths?.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <p className="text-xs font-semibold text-emerald-700">Top Strengths</p>
                          <ul className="space-y-1.5">
                            {selectedResume.scoreBreakdown.topStrengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />{s}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <p className="text-xs font-semibold text-amber-700">Areas to Improve</p>
                          <ul className="space-y-1.5">
                            {selectedResume.scoreBreakdown.topWeaknesses.map((w, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />{w}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}