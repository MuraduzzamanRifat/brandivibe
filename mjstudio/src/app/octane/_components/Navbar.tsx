"use client";

import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 mix-blend-difference"
    >
      <div className="mx-auto max-w-[1700px] px-6 md:px-10 py-6 flex items-center justify-between">
        <a href="/octane" className="flex items-center gap-3">
          <span className="font-display text-2xl tracking-tight leading-none">VYCE</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/70 hidden sm:inline">
            / OCTANE
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-9 font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
          <a href="#ascent" className="hover:text-white transition-colors">The Ascent</a>
          <a href="#world" className="hover:text-white transition-colors">The World</a>
          <a href="#tour" className="hover:text-white transition-colors">Tour</a>
          <a href="#drop" className="hover:text-white transition-colors">06.21.26</a>
        </nav>
        <a
          href="#drop"
          className="inline-flex items-center gap-3 px-5 py-2.5 min-h-[44px] border border-white/30 font-mono text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-colors"
        >
          Pre-save
        </a>
      </div>
    </motion.header>
  );
}
