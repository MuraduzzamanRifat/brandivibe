import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MJ Studio — Manifesto Poster",
  description:
    "Silent Architecture: a design philosophy expressed as a limited-edition manifesto poster. Plate 001 of 003.",
};

export default function PosterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 gap-10">
      <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em]">
        — Plate 001 · Silent Architecture · 2026
      </div>

      <figure className="relative max-w-[min(90vw,640px)] w-full shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/posters/mjstudio-manifesto.png"
          alt="MJ Studio — Silent Architecture manifesto poster. Limited edition 001/003, Q2 2026."
          className="w-full h-auto block"
          width={1200}
          height={1600}
        />
      </figure>

      <figcaption className="text-center max-w-xl">
        <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] mb-2">
          Philosophy · Silent Architecture
        </div>
        <p className="text-white/60 text-sm leading-relaxed">
          Space is not absence — space is matter. A limited-edition manifesto
          poster series exploring taste, craft, and restraint. Meticulously
          typeset in EB Garamond and Space Mono.
        </p>
      </figcaption>

      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors"
        >
          ← Back to home
        </Link>
        <a
          href="/posters/mjstudio-manifesto.png"
          download
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
        >
          Download PNG
        </a>
      </div>
    </main>
  );
}
