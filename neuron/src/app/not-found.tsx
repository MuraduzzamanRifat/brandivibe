import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <div className="font-mono text-[11px] text-foreground-soft uppercase tracking-widest mb-4">
          ERROR · 404
        </div>
        <h1 className="text-6xl md:text-8xl font-semibold tracking-[-0.03em] leading-[0.95] mb-8">
          Page not <span className="italic text-foreground-muted">found</span>.
        </h1>
        <p className="text-lg text-foreground-muted mb-10">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0a0a0f] text-white font-medium hover:bg-[#1a1a1f] transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
