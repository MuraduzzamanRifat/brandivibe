"use client";

import { motion } from "framer-motion";
import { HeroScene } from "./HeroScene";
import { ArrowRight, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <HeroScene />

      {/* radial fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c]/20 via-transparent to-[#0a0f1c] pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8 w-full pt-20">
        {/* status pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-dark mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbbf24] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fbbf24]" />
          </span>
          <span className="font-mono text-xs text-white/80 uppercase tracking-widest">
            Audited · Live on Ethereum · $4.8B TVL
          </span>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-6xl md:text-8xl lg:text-[9rem] font-bold tracking-tight leading-[0.9] text-balance max-w-5xl"
        >
          <span className="block">Stake ETH.</span>
          <span className="block gold-text glow-gold">Earn real yield.</span>
          <span className="block text-white/50 italic font-medium">Stay liquid.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 text-lg md:text-xl text-white/60 max-w-xl leading-relaxed"
        >
          Helix is an institutional-grade liquid staking protocol for Ethereum.
          Non-custodial ETH staking, audited by Trail of Bits & OpenZeppelin,
          trusted by 12,000+ validators.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#stake"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black font-semibold hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all hover:scale-[1.02]"
          >
            Stake ETH
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#security"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-gold text-white font-medium hover:bg-[#fbbf24]/5 transition-colors"
          >
            <Shield className="w-4 h-4 text-[#fbbf24]" />
            View audits
          </a>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-6 md:left-8 font-mono text-[10px] text-white/40 uppercase tracking-[0.3em]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-white/40" />
            Scroll · Protocol overview
          </div>
        </motion.div>
      </div>
    </section>
  );
}
