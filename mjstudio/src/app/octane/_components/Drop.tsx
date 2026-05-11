"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EmberField } from "./EmberField";

const PLATFORMS = [
  { name: "Spotify", note: "Pre-save · added to your library on drop" },
  { name: "Apple Music", note: "Pre-add · plays the second it's live" },
  { name: "Amazon Music", note: "Pre-save · presale code included" },
  { name: "YouTube Music", note: "Set reminder · visualizer premiere" },
];

export function Drop() {
  return (
    <section id="drop" className="relative border-t divider-line py-28 md:py-44 px-6 md:px-10 overflow-hidden grain">
      <EmberField count={32} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_60%,rgba(255,90,31,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-25 pointer-events-none mix-blend-overlay" />

      <div className="relative mx-auto max-w-[1700px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[10px] uppercase tracking-[0.45em] text-[#ff5a1f] mb-8 flicker"
        >
          ● FULL RELEASE — 06 . 21 . 26
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-[0.78] tracking-[-0.02em]"
          style={{ fontSize: "clamp(4rem, 16vw, 18rem)" }}
        >
          <span className="flame-text">PRE-SAVE</span>
          <br />
          THE CLIMB
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/60 leading-relaxed max-w-xl mx-auto mt-8 text-balance"
        >
          Pre-save unlocks every altitude as it&apos;s reached, the presale
          ticket code, the visualizer drop, and a vinyl pre-order window before
          the public one. One click. Whole mountain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,90,31,0.18)] border divider-line max-w-5xl mx-auto"
        >
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href="#"
              className="bg-[#0d0a0e] p-7 text-left group hover:bg-[#14100f] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-xl md:text-2xl">{p.name}</span>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#ff5a1f] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-white/45 text-xs leading-relaxed">{p.note}</p>
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 flame-bg font-mono text-[11px] font-bold tracking-[0.3em] uppercase hover:brightness-110 transition"
          >
            Pre-save on every platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#ascent"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-white/25 text-white font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-white/5 transition-colors"
          >
            Back to the tracklist
          </a>
        </motion.div>

        <div className="mt-10 font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
          06.21.26 · 00:00 PT · the whole mountain opens at once
        </div>
      </div>
    </section>
  );
}
