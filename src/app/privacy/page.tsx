export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: March 26, 2026</p>

      <section className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          ResuMAI collects account information, profile content, and job descriptions to provide AI-powered resume
          generation. We process this data to improve resume quality, generate downloadable documents, and show
          job-specific scoring.
        </p>
        <p>
          We do not sell your personal data. Service providers such as authentication, database, and AI vendors may
          process data strictly to operate the product.
        </p>
        <p>
          You can request account deletion at any time. Deleted accounts remove related profile and resume records
          according to our retention policy and provider constraints.
        </p>
        <p>
          For privacy requests, contact support from your registered account email and include your user ID if
          available.
        </p>
      </section>
    </main>
  );
}
