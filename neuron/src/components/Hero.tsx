"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { NeuralField } from "./NeuralField";

export function Hero() {
  return (
    <section className="relative pt-40 pb-32 px-6 lg:px-8 overflow-hidden">
      {/* subtle grid + 3D accent */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <NeuralField />
      </div>
      <div className="absolute inset-x-0 top-0 h-[90vh] bg-gradient-to-b from-white via-white/60 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[rgba(10,10,15,0.08)] shadow-[0_1px_2px_0_rgba(10,10,15,0.04)] mb-10"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0369a1]" />
          <span className="text-xs font-medium text-foreground-muted">
            Launched — Agent Framework v2.0
          </span>
          <div className="w-px h-3 bg-[rgba(10,10,15,0.1)]" />
          <a href="#" className="text-xs text-[#0369a1] hover:underline">
            Read more →
          </a>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-[-0.04em] leading-[0.95] text-balance"
        >
          Ship AI agents in <br className="hidden md:block" />
          <span className="italic font-light text-foreground-muted">minutes</span>, not months.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-8 text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed"
        >
          The developer-first AI agents platform for building, evaluating, and deploying
          production-grade agents. Observability, guardrails, and evals — built in.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0a0a0f] text-white font-medium hover:bg-[#1a1a1f] transition-all"
          >
            Start building free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#code"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[rgba(10,10,15,0.1)] text-foreground font-medium hover:bg-white transition-colors"
          >
            View playground
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 text-xs text-foreground-soft"
        >
          Free tier · No credit card · 10,000 agent runs/month
        </motion.div>
      </div>

      {/* floating metric chips */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative mx-auto max-w-5xl mt-24 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { k: "p95 latency", v: "47ms" },
          { k: "Eval pass rate", v: "99.2%" },
          { k: "Uptime", v: "99.99%" },
          { k: "Agents deployed", v: "12.4k" },
        ].map((s) => (
          <div key={s.k} className="card rounded-2xl p-5">
            <div className="text-xs text-foreground-soft font-mono uppercase tracking-wider">
              {s.k}
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
              {s.v}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
