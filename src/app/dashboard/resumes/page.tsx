import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { FileText, Download, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ResumesPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/auth/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/auth/sign-in");

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      jobApplication: {
        select: {
          id: true,
          jobTitle: true,
          company: true,
        },
      },
    },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Resumes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {resumes.length} resume{resumes.length !== 1 ? "s" : ""} generated across your jobs
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/jobs/new">Generate New Resume</Link>
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No resumes yet</CardTitle>
            <CardDescription>Create a job application to generate your first tailored resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/jobs/new">Create first application</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="transition-all hover:border-primary/40">
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="truncate font-semibold">{resume.title || `Variant ${resume.variantNumber}`}</p>
                    {typeof resume.overallScore === "number" && (
                      <Badge variant={resume.overallScore >= 80 ? "success" : "secondary"}>
                        Score {resume.overallScore}
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {resume.jobApplication.jobTitle || "Untitled Role"} at{" "}
                    {resume.jobApplication.company || "Unknown Company"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(resume.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/jobs/${resume.jobApplication.id}`}>
                      <Briefcase className="h-3.5 w-3.5" />
                      View Job
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/api/resumes/${resume.id}/download?format=pdf`}>
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/api/resumes/${resume.id}/download?format=docx`}>
                      <Download className="h-3.5 w-3.5" />
                      DOCX
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
