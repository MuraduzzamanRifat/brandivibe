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
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 grid place-items-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] opacity-30 blur-lg" />
            <div className="relative w-7 h-7 rounded-full border border-[#fbbf24]/60 grid place-items-center">
              <span className="font-heading font-bold text-[#fbbf24] text-sm">H</span>
            </div>
          </div>
          <span className="font-heading font-semibold text-lg tracking-widest">HELIX</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-sm text-white/70">
          <a href="#stake" className="hover:text-[#fbbf24] transition-colors">Stake</a>
          <a href="#how" className="hover:text-[#fbbf24] transition-colors">How it works</a>
          <a href="#security" className="hover:text-[#fbbf24] transition-colors">Security</a>
          <a href="#docs" className="hover:text-[#fbbf24] transition-colors">Docs</a>
        </nav>
        <a
          href="#app"
          className="relative inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black font-medium text-sm hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-shadow"
        >
          Launch app
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
        </a>
      </div>
    </motion.header>
  );
}
