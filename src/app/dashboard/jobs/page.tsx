// src/app/dashboard/jobs/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  Plus,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function JobsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/auth/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/auth/sign-in");

  const jobs = await prisma.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      resumes: {
        select: { overallScore: true, status: true, title: true },
        orderBy: { overallScore: "desc" },
      },
    },
  });

  const statusConfig = {
    DRAFT: { label: "Draft", color: "text-muted-foreground", bg: "bg-secondary", icon: FileText },
    GENERATING: { label: "Generating", color: "text-amber-600", bg: "bg-amber-50", icon: Loader2 },
    READY: { label: "Ready", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
    APPLIED: { label: "Applied", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle2 },
    INTERVIEWING: { label: "Interviewing", color: "text-purple-600", bg: "bg-purple-50", icon: Clock },
    REJECTED: { label: "Rejected", color: "text-red-600", bg: "bg-red-50", icon: AlertCircle },
    OFFER: { label: "Offer! 🎉", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle2 },
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {jobs.length} application{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild className="shadow-sm shadow-primary/20">
          <Link href="/dashboard/jobs/new">
          <Plus className="w-4 h-4" />
          New Application
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {jobs.length === 0 && (
        <Card className="border-dashed text-center">
          <CardContent className="p-12">
          <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-semibold mb-2">No applications yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Paste a job description and let AI generate tailored, scored resumes in minutes.
          </p>
          <Button asChild>
            <Link href="/dashboard/jobs/new">
            <Plus className="w-4 h-4" />
            Create your first application
            </Link>
          </Button>
          </CardContent>
        </Card>
      )}

      {/* Jobs List */}
      {jobs.length > 0 && (
        <div className="space-y-3">
          {jobs.map((job) => {
            const bestResume = job.resumes[0];
            const config = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.DRAFT;
            const StatusIcon = config.icon;

            return (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                {/* Left */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {job.jobTitle || "Untitled Role"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {job.company || "Unknown Company"}
                      {job.jobLevel && ` · ${job.jobLevel}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Variant scores */}
                  {job.resumes.length > 0 && (
                    <div className="hidden sm:flex gap-1">
                      {job.resumes.slice(0, 3).map((r, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border"
                          style={{
                            background: r.overallScore ? getScoreColor(r.overallScore).bg : "#f9fafb",
                            borderColor: r.overallScore ? getScoreColor(r.overallScore).border : "#e5e7eb",
                            color: r.overallScore ? getScoreColor(r.overallScore).text : "#9ca3af",
                          }}
                        >
                          {r.overallScore || "—"}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status badge */}
                  <Badge className={`hidden md:flex items-center gap-1 ${config.bg} ${config.color}`} variant="secondary">
                    <StatusIcon
                      className={`w-3 h-3 ${job.status === "GENERATING" ? "animate-spin" : ""}`}
                    />
                    {config.label}
                  </Badge>

                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 85) return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" };
  if (score >= 70) return { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" };
  if (score >= 55) return { bg: "#fffbeb", text: "#d97706", border: "#fde68a" };
  return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" };
}
