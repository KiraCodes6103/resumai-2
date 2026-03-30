// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2, User, Briefcase, Code2, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

type ProfileData = {
  rawExperience: string;
  rawProjects: string;
  rawSkills: string;
  rawEducation: string;
  rawSummary: string;
  completionScore: number;
  lastProcessedAt: string | null;
};

const TABS = [
  { id: "rawSummary", label: "Summary", icon: User, placeholder: "Write a brief professional summary about yourself, your background, and what you're looking for..." },
  { id: "rawExperience", label: "Experience", icon: Briefcase, placeholder: `Describe your work experience in natural language. Include company names, roles, dates, and what you accomplished.

Example:
Senior Software Engineer at Acme Corp (2021-2024)
- Led backend team of 5 engineers building payment processing systems
- Reduced API latency by 40% through Redis caching
- Migrated monolith to microservices, improving deployment frequency from monthly to daily

Software Engineer at StartupXYZ (2019-2021)
- Built React dashboard used by 50k+ customers
- Designed PostgreSQL schema for analytics pipeline handling 1M events/day` },
  { id: "rawProjects", label: "Projects", icon: Code2, placeholder: `List your projects with tech stack and impact.

Example:
OpenSource CLI Tool (github.com/you/tool)
- Built in Rust, 2k GitHub stars
- Automated deployment workflows, saving teams 2hrs/week
- Used by 500+ developers` },
  { id: "rawSkills", label: "Skills", icon: FileText, placeholder: `List your skills, technologies, and tools.

Example:
Languages: TypeScript, Python, Go, Rust
Frameworks: React, Next.js, Node.js, FastAPI
Databases: PostgreSQL, Redis, MongoDB
Cloud: AWS (EC2, Lambda, S3, RDS), GCP, Docker, Kubernetes
Other: System Design, Team Leadership, Agile/Scrum` },
  { id: "rawEducation", label: "Education", icon: GraduationCap, placeholder: `List your education and certifications.

Example:
B.S. Computer Science, MIT (2019)
- GPA: 3.8/4.0, Dean's List

AWS Solutions Architect - Associate (2022)
Google Cloud Professional Data Engineer (2023)` },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("rawSummary");
  const [data, setData] = useState<ProfileData>({
    rawExperience: "",
    rawProjects: "",
    rawSkills: "",
    rawEducation: "",
    rawSummary: "",
    completionScore: 0,
    lastProcessedAt: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const res = await fetch("/api/profile", { cache: "no-store" });
    const payload = await res.json();
    if (payload?.profile) {
      const profile = payload.profile;
      setData({
        rawExperience: profile.rawExperience || "",
        rawProjects: profile.rawProjects || "",
        rawSkills: profile.rawSkills || "",
        rawEducation: profile.rawEducation || "",
        rawSummary: profile.rawSummary || "",
        completionScore: profile.completionScore || 0,
        lastProcessedAt: profile.lastProcessedAt,
      });
    }
  };

  useEffect(() => {
    loadProfile().finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawExperience: data.rawExperience,
          rawProjects: data.rawProjects,
          rawSkills: data.rawSkills,
          rawEducation: data.rawEducation,
          rawSummary: data.rawSummary,
        }),
      });
      if (res.ok) {
        const beforeProcessedAt = data.lastProcessedAt;
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await loadProfile();

        // Poll briefly so completion score updates without manual refresh.
        for (let i = 0; i < 6; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const r = await fetch("/api/profile", { cache: "no-store" });
          const payload = await r.json();
          const profile = payload?.profile;
          if (!profile) continue;
          const changed = profile.lastProcessedAt !== beforeProcessedAt;
          if (changed || (profile.completionScore || 0) > 0) {
            setData({
              rawExperience: profile.rawExperience || "",
              rawProjects: profile.rawProjects || "",
              rawSkills: profile.rawSkills || "",
              rawEducation: profile.rawEducation || "",
              rawSummary: profile.rawSummary || "",
              completionScore: profile.completionScore || 0,
              lastProcessedAt: profile.lastProcessedAt,
            });
            break;
          }
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const activeTabConfig = TABS.find((t) => t.id === activeTab)!;
  const charCount = (data[activeTab as keyof ProfileData] as string)?.length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Write naturally — AI will structure and optimize your content
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved!" : saving ? "Saving..." : "Save & Process"}
        </Button>
      </div>

      {/* Completion Score */}
      <Card>
        <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Profile Completeness</span>
          <span className="text-sm font-bold text-primary">{data.completionScore}%</span>
        </div>
        <Progress value={data.completionScore} />
        {data.lastProcessedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Last processed: {new Date(data.lastProcessedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
        </CardContent>
      </Card>

      {/* Tab Editor */}
      <Card className="overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {activeTabConfig.label}
            </label>
            <span className="text-xs text-muted-foreground">{charCount} chars</span>
          </div>
          <Textarea
            value={(data[activeTab as keyof ProfileData] as string) || ""}
            onChange={(e) =>
              setData((prev) => ({ ...prev, [activeTab]: e.target.value }))
            }
            placeholder={activeTabConfig.placeholder}
            className="h-80 resize-none bg-secondary/50 font-mono leading-relaxed placeholder:font-sans placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground mt-2">
            💡 Write in plain English — no special formatting needed. AI will extract and structure your data.
          </p>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-blue-100 bg-blue-50">
        <CardContent className="p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">✨ Tips for best results</p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Include specific metrics and numbers (%, $, scale) in experience descriptions</li>
          <li>• List all technologies you've worked with, even briefly</li>
          <li>• Mention team size, scope, and business impact for each role</li>
          <li>• Add project URLs and GitHub links for verification</li>
        </ul>
        </CardContent>
      </Card>
    </div>
  );
}
