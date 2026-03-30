// src/app/page.tsx
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-gradient">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">ResuMAI</span>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  Get started free
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90" asChild>
                <Link href="/dashboard">Dashboard <ArrowRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <Badge className="mb-8 inline-flex gap-2 px-3 py-1 text-xs" variant="default">
          <Sparkles className="w-3 h-3" />
          AI-powered resume tailoring
        </Badge>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Resumes that get you
          <span className="gradient-text"> interviews</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Paste a job description. Get 3 tailored, ATS-optimized resume variations with scores,
          feedback, and instant PDF/DOCX downloads — in under 3 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <SignUpButton mode="modal">
            <Button size="lg" className="shadow-lg shadow-primary/20">
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </SignUpButton>
          <Button variant="outline" size="lg" asChild>
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-5">
          Free tier includes 5 resume generations · No credit card required
        </p>
      </section>

      {/* Feature Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Target,
              title: "Job-Matched",
              desc: "Extracts keywords and requirements from any JD. Your resume speaks the exact language ATS systems expect.",
            },
            {
              icon: Zap,
              title: "3 Variations",
              desc: "Technical depth, business impact, leadership focus — get multiple angles and pick what fits best.",
            },
            {
              icon: BarChart3,
              title: "Scored & Refined",
              desc: "Every resume gets an ATS score, relevance rating, and specific improvement suggestions.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
        <div className="space-y-6">
          {[
            {
              step: "01",
              title: "Build your profile once",
              desc: "Add your work experience, projects, and skills in plain text. Our AI structures and extracts the best from your background.",
            },
            {
              step: "02",
              title: "Paste any job description",
              desc: "Drop in the JD text or a URL. We extract requirements, keywords, and what actually matters for that role.",
            },
            {
              step: "03",
              title: "Get tailored resumes",
              desc: "Receive 3 scored resume variations, each optimized for a different angle. Download as PDF or DOCX instantly.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-xl border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{step}</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-12">Simple pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
            <div className="mb-4">
              <span className="text-sm font-medium text-muted-foreground">Free</span>
              <div className="text-3xl font-bold mt-1">$0</div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              {["5 resume generations", "PDF & DOCX download", "AI scoring & feedback", "3 variants per job"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                )
              )}
            </ul>
            <SignUpButton mode="modal">
              <Button className="w-full" variant="outline">Start free</Button>
            </SignUpButton>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-primary bg-primary text-white">
            <div className="absolute top-3 right-3 bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              POPULAR
            </div>
            <CardContent className="p-6">
            <div className="mb-4">
              <span className="text-sm font-medium text-white/70">Pro</span>
              <div className="text-3xl font-bold mt-1">
                $12
                <span className="text-base font-normal text-white/70">/mo</span>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-white/80 mb-6">
              {[
                "Unlimited generations",
                "5 variants per job",
                "Priority AI processing",
                "Resume history & tracking",
                "Job application tracking",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <SignUpButton mode="modal">
              <Button className="w-full bg-white text-primary hover:bg-white/90">Get Pro</Button>
            </SignUpButton>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span>ResuMAI © 2024</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
