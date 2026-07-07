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
        <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-6">
          ERROR · 500
        </div>
        <h1 className="text-6xl md:text-8xl font-semibold tracking-tight leading-[0.95] mb-8">
          Something <span className="italic text-white/50">broke</span>.
        </h1>
        <p className="text-lg text-white/60 mb-10">
          An unexpected error occurred. Your browser may not support WebGL.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
