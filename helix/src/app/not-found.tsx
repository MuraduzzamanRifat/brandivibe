import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="text-center max-w-2xl">
        <div className="font-mono text-xs text-[#fbbf24] uppercase tracking-[0.3em] mb-6">
          ERROR · 404
        </div>
        <h1 className="font-heading text-7xl md:text-9xl font-bold tracking-tight leading-[0.9] mb-8">
          Not <span className="gold-text italic">found</span>.
        </h1>
        <p className="text-lg text-white/60 mb-10">
          This transaction hash doesn&apos;t exist on-chain.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black font-semibold hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all"
        >
          ← Back to protocol
        </Link>
      </div>
    </main>
  );
}
