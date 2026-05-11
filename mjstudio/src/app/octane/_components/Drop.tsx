"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PLATFORMS = [
  { name: "Spotify", note: "Pre-save · added to your library on drop" },
  { name: "Apple Music", note: "Pre-add · plays the second it's live" },
  { name: "Amazon Music", note: "Pre-save · presale code included" },
  { name: "YouTube Music", note: "Set reminder · the channel premiere" },
];

export function Drop() {
  return (
    <section id="drop" className="relative border-t divider-line py-28 md:py-44 px-6 md:px-10 overflow-hidden grain">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="pulse-ring" style={{ animationDelay: "0s" }} />
        <span className="pulse-ring" style={{ animationDelay: "1.7s" }} />
        <span className="pulse-ring" style={{ animationDelay: "3.4s" }} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_60%,rgba(196,180,154,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1800px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[10px] uppercase tracking-[0.45em] text-[#c4b49a]/70 mb-8 flex items-center justify-center gap-3"
        >
          <span className="w-1.5 h-1.5 bg-[#c4b49a] blink rounded-full" />
          SCENE 04 — THE DROP · 06 . 21 . 26 · 00:00 PT
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-[0.78] tracking-[-0.02em]"
          style={{ fontSize: "clamp(3.8rem, 15vw, 17rem)" }}
        >
          <span className="tan-text">ENTER</span>
          <br />
          THE CHANNEL
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#ece6da]/60 leading-relaxed max-w-xl mx-auto mt-8 text-balance"
        >
          The channel unlocks every altitude as the campaign reaches it, the
          presale ticket code, the opening-broadcast reminder, and a vinyl
          pre-order window before the public one. One click. Whole mountain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#c4b49a]/15 border divider-line max-w-5xl mx-auto"
        >
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href="#"
              className="bg-[#0e0c0a] p-7 text-left group hover:bg-[#14110d] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-xl md:text-2xl">{p.name}</span>
                <ArrowRight className="w-4 h-4 text-[#c4b49a]/30 group-hover:text-[#c4b49a] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[#ece6da]/45 text-xs leading-relaxed">{p.note}</p>
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
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 tan-bg font-mono text-[11px] font-bold tracking-[0.3em] uppercase hover:brightness-105 transition"
          >
            Enter the channel
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#ascent"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-[#c4b49a]/25 text-[#ece6da] font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#c4b49a]/5 transition-colors"
          >
            Back to the ascent
          </a>
        </motion.div>

        <div className="mt-10 font-mono text-[9px] uppercase tracking-[0.35em] text-[#c4b49a]/30">
          06.21.26 · 00:00 PT · the whole mountain opens at once
        </div>
      </div>
    </section>
  );
}
