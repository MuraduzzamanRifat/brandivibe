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
      <div className="mx-auto max-w-[1400px] px-8 md:px-12 py-8 flex items-center justify-between">
        <a href="/atrium" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#e8d49a]/50 grid place-items-center">
            <span className="font-serif champagne-text text-lg leading-none">A</span>
          </div>
          <span className="font-serif text-xl tracking-tight">Atrium</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.22em] text-white/60">
          <a href="#portfolio" className="hover:champagne-text transition-colors">Portfolio</a>
          <a href="#thesis" className="hover:champagne-text transition-colors">Thesis</a>
          <a href="#team" className="hover:champagne-text transition-colors">Team</a>
          <a href="#letters" className="hover:champagne-text transition-colors">Letters</a>
        </nav>
        <a
          href="#submit"
          className="hidden md:inline-flex items-center gap-3 px-5 py-2.5 border border-[#e8d49a]/60 text-[#e8d49a] text-[11px] tracking-[0.2em] uppercase hover:bg-[#e8d49a]/10 transition-colors"
        >
          Submit a deck
        </a>
      </div>
    </motion.header>
  );
}
