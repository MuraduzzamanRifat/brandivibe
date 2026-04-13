"use client";

import { motion } from "framer-motion";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center concrete-grain overflow-hidden pt-24">
      <HeroScene />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 w-full grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-5 mb-14"
          >
            <div className="w-16 h-px bg-[#1a1a1a]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#5a5a5a]">
              Established MCMXCII · Porto + Tokyo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-normal tracking-[-0.02em] leading-[0.92] text-balance"
            style={{ fontSize: "clamp(4.5rem, 13vw, 18rem)" }}
          >
            Architecture
            <br />
            <span className="serif-italic">that stands.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-14 text-base md:text-lg text-[#5a5a5a] leading-relaxed max-w-md text-balance"
          >
            Monolith is an architecture studio working in concrete, glass,
            light, and time. We design fewer buildings, more slowly, and stay
            with them for decades.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25 }}
            className="mt-14 flex flex-wrap gap-8"
          >
            <a
              href="#works"
              className="inline-flex items-center gap-3 pb-2 border-b border-[#1a1a1a] text-xs tracking-[0.3em] uppercase text-[#1a1a1a] hover:gap-5 transition-all"
            >
              Selected works
            </a>
            <a
              href="#studio"
              className="inline-flex items-center gap-3 pb-2 border-b border-[#5a5a5a]/30 text-xs tracking-[0.3em] uppercase text-[#5a5a5a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
            >
              Visit the studio
            </a>
          </motion.div>
        </div>
      </div>

      {/* bottom frame */}
      <div className="absolute bottom-8 left-6 md:left-12 text-[9px] tracking-[0.3em] uppercase text-[#8a8a88]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-[#8a8a88]" />
          Scroll for work
        </div>
      </div>
      <div className="absolute bottom-8 right-6 md:right-12 text-[9px] tracking-[0.3em] uppercase text-[#8a8a88] text-right">
        <div>Plate · I / IV</div>
        <div className="mt-1">Monolith — 2026</div>
      </div>
    </section>
  );
}
