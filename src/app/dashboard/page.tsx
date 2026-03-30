// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Zap,
  ArrowRight,
  Plus,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/auth/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      profile: true,
      jobApplications: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          resumes: {
            select: { overallScore: true, status: true },
          },
        },
      },
      resumes: {
        select: { overallScore: true },
        take: 100,
      },
    },
  });

  if (!user) redirect("/auth/sign-in");

  const totalApps = await prisma.jobApplication.count({ where: { userId: user.id } });
  const totalResumes = await prisma.resume.count({ where: { userId: user.id } });
  const avgScore =
    user.resumes.length > 0
      ? Math.round(user.resumes.reduce((s, r) => s + (r.overallScore || 0), 0) / user.resumes.length)
      : 0;

  const profileComplete = user.profile?.completionScore || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Good {getGreeting()}, {user.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {totalApps === 0
            ? "Let's create your first tailored resume"
            : `You have ${totalApps} job application${totalApps !== 1 ? "s" : ""} and ${totalResumes} resume${totalResumes !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Profile completeness banner */}
      {profileComplete < 60 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900">Complete your profile first</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Add your experience and skills before generating resumes ({profileComplete}% complete)
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-amber-500 text-white hover:bg-amber-600">
            <Link href="/dashboard/profile">Complete profile</Link>
          </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Job Applications",
            value: totalApps,
            icon: Briefcase,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Resumes Generated",
            value: totalResumes,
            icon: FileText,
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Avg. Resume Score",
            value: avgScore > 0 ? `${avgScore}` : "—",
            icon: TrendingUp,
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Credits Left",
            value: user.credits,
            icon: Zap,
            color: "bg-orange-50 text-orange-600",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
          <div className="space-y-2">
            <Link
              href="/dashboard/jobs/new"
              className="flex items-center justify-between p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4" />
                <div>
                  <div className="text-sm font-medium">Generate new resume</div>
                  <div className="text-xs text-white/70">Paste a job description</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12">
                  <Progress value={profileComplete} className="h-2" />
                </div>
                <div>
                  <div className="text-sm font-medium">Update profile</div>
                  <div className="text-xs text-muted-foreground">{profileComplete}% complete</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-muted-foreground" />
            </Link>
          </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm">Recent Applications</CardTitle>
            <Button asChild size="sm" variant="ghost" className="text-xs text-primary">
              <Link href="/dashboard/jobs">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
          {user.jobApplications.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No applications yet</p>
              <Link
                href="/dashboard/jobs/new"
                className="text-xs text-primary mt-1 hover:underline inline-block"
              >
                Create your first →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {user.jobApplications.map((job) => {
                const bestScore = Math.max(...job.resumes.map((r) => r.overallScore || 0));
                const isReady = job.status === "READY";
                const isGenerating = job.status === "GENERATING";
                return (
                  <Link
                    key={job.id}
                    href={`/dashboard/jobs/${job.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isReady
                            ? "bg-green-500"
                            : isGenerating
                            ? "bg-amber-500 animate-pulse"
                            : "bg-muted-foreground/30"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {job.jobTitle || "Untitled Role"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {job.company || "Unknown Company"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isReady && bestScore > 0 && <Badge className={getScoreColor(bestScore)}>{bestScore}</Badge>}
                      {isGenerating && (
                        <span className="text-xs text-amber-600">Generating...</span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 55) return "text-amber-600";
  return "text-red-500";
}
