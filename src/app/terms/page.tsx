export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: March 26, 2026</p>

      <section className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          By using ResuMAI, you agree to use the service lawfully and not submit content that violates applicable
          laws or third-party rights.
        </p>
        <p>
          AI-generated output is provided for assistance only. You are responsible for reviewing, validating, and
          editing generated resumes before submitting applications.
        </p>
        <p>
          Service availability may vary, and features can change over time. Paid features, when enabled, follow the
          billing terms presented at checkout.
        </p>
        <p>
          We may suspend accounts for abuse, fraud, or actions that harm platform integrity.
        </p>
      </section>
    </main>
  );
}
