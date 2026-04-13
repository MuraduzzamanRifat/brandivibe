import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Helix — Certificate of Reserve",
  description:
    "Institutional-grade liquid staking protocol. Certificate of Reserve poster · Plate I · 2026.",
};

export default function PosterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 gap-10">
      <div className="font-mono text-[10px] text-[#fbbf24] uppercase tracking-[0.3em]">
        — Plate I · Certificate of Reserve · MMXXVI
      </div>

      <figure className="relative max-w-[min(90vw,640px)] w-full shadow-[0_40px_120px_-20px_rgba(251,191,36,0.15)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/posters/helix-certificate.png"
          alt="Helix — Certificate of Reserve. Stake ETH. Earn yield. Stay liquid."
          className="w-full h-auto block border border-[#fbbf24]/20"
          width={1200}
          height={1600}
        />
      </figure>

      <figcaption className="text-center max-w-xl">
        <div className="font-mono text-[10px] text-[#fbbf24] uppercase tracking-[0.3em] mb-2">
          Series · MMXXVI · Protocol
        </div>
        <p className="text-white/60 text-sm leading-relaxed">
          A ceremonial certificate for an institutional-grade protocol.
          Typeset in Orbitron with gold-foil gradient accents and archival corner marks.
        </p>
      </figcaption>

      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-gold text-white font-medium text-sm hover:bg-[#fbbf24]/5 transition-colors"
        >
          ← Back to protocol
        </Link>
        <a
          href="/posters/helix-certificate.png"
          download
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black font-semibold text-sm hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all"
        >
          Download PNG
        </a>
      </div>
    </main>
  );
}
