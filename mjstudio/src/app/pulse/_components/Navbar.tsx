"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-6 pt-4">
        <div className="card-soft rounded-full flex items-center justify-between pl-6 pr-2 py-2 bg-white/85 backdrop-blur-sm">
          <a href="/pulse" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] grid place-items-center">
              <span className="font-serif italic text-white text-sm leading-none">p</span>
            </div>
            <span className="font-serif text-xl text-pulse-fg">Pulse</span>
          </a>
          <nav className="hidden md:flex items-center gap-9 text-sm text-pulse-muted">
            <a href="#providers" className="hover:text-pulse-fg transition-colors">For providers</a>
            <a href="#patients" className="hover:text-pulse-fg transition-colors">For patients</a>
            <a href="#science" className="hover:text-pulse-fg transition-colors">The science</a>
            <a href="#pricing" className="hover:text-pulse-fg transition-colors">Pricing</a>
          </nav>
          <a
            href="#book"
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
          >
            Book a demo
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}
