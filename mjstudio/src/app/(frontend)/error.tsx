"use client";

import Link from "next/link";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <div className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
          ERROR · 500
        </div>
        <h1 className="text-6xl md:text-8xl font-semibold tracking-tight leading-[0.95] mb-8">
          Something <span className="italic text-primary-strong">broke</span>.
        </h1>
        <p className="text-lg text-foreground/70 mb-10">
          An unexpected error occurred on our end. Try again, and if it keeps happening, let us know.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-strong text-white font-medium hover:bg-primary-deep transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border-strong text-foreground font-medium hover:border-foreground/30 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
