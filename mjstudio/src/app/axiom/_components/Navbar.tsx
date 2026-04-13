"use client";

import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-6 flex items-center justify-between">
        <a href="/axiom" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#14b8a6]/50 grid place-items-center">
            <span className="font-serif italic text-[#14b8a6] text-lg leading-none">A</span>
          </div>
          <span className="font-serif text-xl italic text-white">Axiom</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 font-mono text-[11px] uppercase tracking-widest text-white/70">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#rails" className="hover:text-white transition-colors">Rails</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        </nav>
        <a
          href="#book"
          className="group inline-flex items-center gap-3 px-5 py-2.5 min-h-[44px] rounded-full bg-[#14b8a6] text-[#0a0e1a] font-medium text-sm hover:bg-[#2dd4bf] transition-colors"
        >
          Request access
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0a0e1a] group-hover:scale-150 transition-transform" />
        </a>
      </div>
    </motion.header>
  );
}
