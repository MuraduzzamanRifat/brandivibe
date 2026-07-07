"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <HeroScene />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent,rgba(10,16,32,0.9))] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-b from-transparent to-[#0a1020] pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-8 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-5 mb-14"
        >
          <div className="w-16 h-px bg-[#e8d49a]/60" />
          <span className="text-[10px] tracking-[0.35em] uppercase champagne-text">
            Est. 2014 · $1.4B AUM · Menlo Park
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-normal tracking-[-0.015em] leading-[0.92] text-balance"
          style={{ fontSize: "clamp(4rem, 11vw, 15rem)" }}
        >
          Capital for founders
          <br />
          <span className="serif-italic champagne-ink">who think in decades.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="mt-14 max-w-xl text-base md:text-lg text-white/55 leading-relaxed text-balance"
        >
          Atrium is a $1.4B early-stage venture firm backing rare founders who
          are building institutions — not startups. We lead seed and Series A
          rounds in companies with twenty-year horizons and a bias for quiet
          work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.35 }}
          className="mt-14 flex flex-col sm:flex-row gap-5"
        >
          <a
            href="#submit"
            className="group inline-flex items-center gap-3 pb-2 border-b border-[#e8d49a]/60 text-[11px] tracking-[0.3em] uppercase champagne-text hover:gap-5 transition-all"
          >
            Submit a deck
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#thesis"
            className="inline-flex items-center gap-3 pb-2 border-b border-white/20 text-[11px] tracking-[0.3em] uppercase text-white/60 hover:text-[#e8d49a] hover:border-[#e8d49a] transition-colors"
          >
            Read our thesis
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-10 left-8 md:left-12 text-[9px] tracking-[0.3em] uppercase text-white/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-px bg-white/30" />
            Scroll — Portfolio
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="absolute bottom-10 right-8 md:right-12 text-[9px] tracking-[0.3em] uppercase text-white/40 text-right"
        >
          <div>Fund IV</div>
          <div className="mt-1">MMXXVI Vintage</div>
        </motion.div>
      </div>
    </section>
  );
}
