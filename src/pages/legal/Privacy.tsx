export default function Privacy() {
  return (
    <div className="bg-neutral-950 font-sans text-neutral-400 min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 leading-relaxed text-xs">
        <h1 className="text-3xl font-extrabold text-neutral-100 font-sans tracking-tight">
          Privacy Policy
        </h1>
        
        <p className="text-sm text-neutral-300">
          Updated: May 2026.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-200">1. Information We Collect</h2>
          <p>
            When processing simulated checkout transactions or submitting supporting client inquiries, we collect basic identifiers, specifically your name, email address, message subjects, and timestamp parameters. No payment card data is processed or collected since Framsirona Store operates purely on free simulation and instant delivery trials.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-200">2. Cookies & LocalStorage</h2>
          <p>
            We use persistent client-side caching (LocalStorage) to maintain the state of the system catalog, contact records, and active search queries, ensuring speedy, zero-latency loads. No analytical tracker cookies are embedded or transferred to third-party marketing entities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-200">3. Support Integrity Support</h2>
          <p>
            We promise never to rent, trade, or distribute your email coordinates. All digital interactions are securely encrypted in transit and locked under database security policies.
          </p>
        </section>
      </div>
    </div>
  );
}
