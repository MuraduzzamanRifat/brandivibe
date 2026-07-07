import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="text-center max-w-2xl">
        <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-6">
          ERROR · 404
        </div>
        <h1 className="text-7xl md:text-9xl font-semibold tracking-tight leading-[0.95] mb-8">
          Not <span className="italic text-white/50">found</span>.
        </h1>
        <p className="text-lg text-white/60 mb-10 max-w-lg mx-auto">
          The page you&apos;re looking for doesn&apos;t exist — or we haven&apos;t built it yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
