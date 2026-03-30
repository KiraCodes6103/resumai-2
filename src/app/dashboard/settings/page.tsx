import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/auth/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { profile: true },
  });

  if (!user) redirect("/auth/sign-in");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account, plan, and usage overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Profile and workspace details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{user.name || "Not set"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Profile completeness</span>
              <span className="font-medium">{user.profile?.completionScore ?? 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan & Credits</CardTitle>
            <CardDescription>Current subscription status and generation credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan</span>
              <Badge variant={user.plan === "PRO" ? "success" : "secondary"}>{user.plan}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Credits left</span>
              <span className="font-semibold">{user.credits}</span>
            </div>
            <p className="rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
              Billing is not wired yet in this build. When Stripe integration is enabled, upgrades and renewals
              will be managed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
