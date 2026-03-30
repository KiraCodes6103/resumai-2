import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle2, Sparkles, User, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function OnboardingPage() {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  return (
    <main className="mesh-gradient min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to ResuMAI</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is ready. Complete these two quick steps to generate your first tailored resume.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get started in 2 steps</CardTitle>
            <CardDescription>Most users finish setup in under 5 minutes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <div className="mt-0.5 rounded-lg bg-secondary p-2">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">1. Complete your profile</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your summary, experience, projects, skills, and education.
                </p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <div className="mt-0.5 rounded-lg bg-secondary p-2">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">2. Paste a job description</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate multiple scored resume variants and download PDF/DOCX instantly.
                </p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild>
                <Link href="/dashboard/profile">Complete Profile</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/jobs/new">Create First Application</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/dashboard">Skip to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
