import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Neuron — Datasheet",
  description:
    "Neuron Agent Framework v2.0 · Official datasheet poster · Specifications & performance.",
};

export default function PosterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 gap-10">
      <div className="font-mono text-[10px] text-[#0369a1] uppercase tracking-[0.25em]">
        — DATASHEET · SPEC · 04
      </div>

      <figure className="relative max-w-[min(90vw,640px)] w-full shadow-[0_40px_100px_-20px_rgba(10,10,15,0.25)] rounded-2xl overflow-hidden border border-[rgba(10,10,15,0.08)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/posters/neuron-datasheet.png"
          alt="Neuron Agent Framework v2.0 — Datasheet. Ship in minutes."
          className="w-full h-auto block"
          width={1200}
          height={1600}
        />
      </figure>

      <figcaption className="text-center max-w-xl">
        <div className="font-mono text-[10px] text-[#0369a1] uppercase tracking-[0.25em] mb-2">
          v2.0 · PRODUCTION READY
        </div>
        <p className="text-foreground-muted text-sm leading-relaxed">
          A technical datasheet for an engineering-first product. Typeset in
          Plus Jakarta Sans with tabular-numeric metrics and a restrained
          blueprint grid.
        </p>
      </figcaption>

      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(10,10,15,0.1)] text-foreground font-medium text-sm hover:bg-white transition-colors"
        >
          ← Back to home
        </Link>
        <a
          href="/posters/neuron-datasheet.png"
          download
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a0a0f] text-white font-medium text-sm hover:bg-[#1a1a1f] transition-colors"
        >
          Download PNG
        </a>
      </div>
    </main>
  );
}
