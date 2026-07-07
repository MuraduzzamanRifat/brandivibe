"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <HeroScene />

      {/* subtle grid + fades */}
      <div className="absolute inset-0 grid-subtle opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,14,26,0.95)_0%,rgba(10,14,26,0.6)_45%,rgba(10,14,26,0.1)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#0a0e1a] pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 w-full">
        {/* status pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#14b8a6]/25 bg-white/[0.02] mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14b8a6] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14b8a6]" />
          </span>
          <span className="font-mono text-[10px] text-white/80 uppercase tracking-[0.25em]">
            Live · 147 countries · $24.8B moved
          </span>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-6xl md:text-8xl lg:text-[10rem] font-normal tracking-tight leading-[0.9] text-balance max-w-5xl"
        >
          Move money.
          <br />
          <span className="serif-italic cream-text">Instantly.</span>
          <br />
          <span className="text-white/50">Globally.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mt-10 text-lg md:text-xl text-white/60 max-w-xl leading-relaxed"
        >
          Axiom is fintech infrastructure for the next billion users. One API
          for payments, treasury, and compliance — in 147 countries, with
          sub-300ms settlement.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#book"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#14b8a6] text-[#0a0e1a] font-semibold hover:bg-[#2dd4bf] transition-colors"
          >
            Request access
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#security"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            <Shield className="w-4 h-4 text-[#14b8a6]" />
            View security posture
          </a>
        </motion.div>

        {/* bottom meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-10 left-6 md:left-10 font-mono text-[9px] text-white/40 uppercase tracking-[0.3em]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-white/30" />
            Scroll · Product overview
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="absolute bottom-10 right-6 md:right-10 font-mono text-[9px] text-white/40 uppercase tracking-[0.3em] text-right"
        >
          <div>SOC 2 Type II</div>
          <div className="mt-1">PCI DSS Level 1</div>
        </motion.div>
      </div>
    </section>
  );
}
