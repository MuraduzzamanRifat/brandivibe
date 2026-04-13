"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section className="relative pt-40 pb-32 px-6 overflow-hidden">
      {/* soft background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-[70vh] bg-gradient-to-b from-white/60 via-white/30 to-transparent" />
      </div>

      <div className="absolute inset-0 opacity-70">
        <HeroScene />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-b from-transparent via-[#fafaf7]/70 to-[#fafaf7] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pulse-faint shadow-[0_1px_2px_0_rgba(28,25,23,0.04)] mb-10"
        >
          <Sparkles className="w-3.5 h-3.5 text-pulse-sage" />
          <span className="text-xs font-medium text-pulse-muted">
            FDA cleared · HIPAA compliant · 4,800 providers
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-[6.4rem] font-normal tracking-[-0.015em] leading-[1.02] text-balance text-pulse-fg"
        >
          Better care,
          <br />
          <span className="serif-italic text-pulse-sage">delivered calmly.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-10 text-lg md:text-xl text-pulse-muted max-w-2xl mx-auto leading-relaxed"
        >
          Pulse is the telehealth platform clinicians actually enjoy using.
          One calm interface for patients, providers, and care teams — backed
          by evidence-based workflows and FDA-cleared AI triage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <a
            href="#book"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#0d9488] text-white font-medium hover:bg-[#0f766e] transition-all soft-elevate"
          >
            Book a demo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#science"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-pulse-faint bg-white/60 text-pulse-fg font-medium hover:bg-white transition-colors"
          >
            Read the research
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-6 text-xs text-pulse-soft"
        >
          30-day free pilot · No EHR migration · SOC 2 Type II
        </motion.div>
      </div>

      {/* floating stat chips */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative mx-auto max-w-5xl mt-24 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { k: "NPS score", v: "78" },
          { k: "Triage accuracy", v: "96.4%" },
          { k: "Provider time saved", v: "2.4h/day" },
          { k: "Patient visits / mo", v: "240k" },
        ].map((s) => (
          <div key={s.k} className="card-soft p-6 bg-white">
            <div className="text-xs text-pulse-soft font-medium uppercase tracking-[0.12em]">{s.k}</div>
            <div className="mt-3 font-serif text-4xl text-pulse-fg tabular-nums">{s.v}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
