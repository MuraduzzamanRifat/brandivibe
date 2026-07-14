import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="text-center max-w-2xl">
        <div className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
          ERROR · 404
        </div>
        <h1 className="text-7xl md:text-9xl font-semibold tracking-tight leading-[0.95] mb-8">
          Not <span className="italic text-primary-strong">found</span>.
        </h1>
        <p className="text-lg text-foreground/70 mb-10 max-w-lg mx-auto">
          The page you&apos;re looking for doesn&apos;t exist — or we haven&apos;t built it yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-strong text-white font-medium hover:bg-primary-deep transition-colors"
        >
          ← Back to home
        </Link>
        <p className="mt-8 text-sm text-muted">
          Or head to{" "}
          <Link href="/services" className="underline hover:text-foreground">
            our services
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="underline hover:text-foreground">
            get in touch
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
