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
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-8 flex items-center justify-between">
        <a href="/monolith" className="flex items-center gap-4">
          <div className="w-1 h-8 bg-[#1a1a1a]" />
          <span className="font-serif text-2xl tracking-tight">Monolith</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-[0.2em] text-[#5a5a5a]">
          <a href="#works" className="hover:text-[#1a1a1a] transition-colors">Selected works</a>
          <a href="#studio" className="hover:text-[#1a1a1a] transition-colors">Studio</a>
          <a href="#philosophy" className="hover:text-[#1a1a1a] transition-colors">Philosophy</a>
          <a href="#contact" className="hover:text-[#1a1a1a] transition-colors">Contact</a>
        </nav>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1a1a1a] text-[#1a1a1a] text-xs uppercase tracking-[0.2em] hover:bg-[#1a1a1a] hover:text-[#f1efea] transition-colors"
        >
          Begin a project
        </a>
      </div>
    </motion.header>
  );
}
