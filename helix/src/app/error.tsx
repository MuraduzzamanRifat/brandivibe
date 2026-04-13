"use client";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <div className="font-mono text-xs text-[#fbbf24] uppercase tracking-[0.3em] mb-6">
          ERROR · 500
        </div>
        <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-8">
          Protocol <span className="gold-text italic">error</span>.
        </h1>
        <p className="text-lg text-white/60 mb-10">
          An unexpected error occurred while loading the protocol. Your browser may not support WebGL.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black font-semibold hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
