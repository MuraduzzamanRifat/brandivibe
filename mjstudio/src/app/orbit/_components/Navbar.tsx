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
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-6 flex items-center justify-between">
        <a href="/orbit" className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#84ff6b] grid place-items-center">
            <div className="w-3 h-3 bg-[#84ff6b]" />
          </div>
          <span className="font-bold text-xl tracking-tight">ORBIT</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 font-mono text-[11px] uppercase tracking-widest text-white/70">
          <a href="#vehicle" className="hover:text-[#84ff6b] transition-colors">Vehicle</a>
          <a href="#performance" className="hover:text-[#84ff6b] transition-colors">Performance</a>
          <a href="#reservations" className="hover:text-[#84ff6b] transition-colors">Reservations</a>
          <a href="#press" className="hover:text-[#84ff6b] transition-colors">Press</a>
        </nav>
        <a
          href="#reserve"
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#84ff6b] text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-[#a3ff8a] transition-colors"
        >
          Reserve
        </a>
      </div>
    </motion.header>
  );
}
