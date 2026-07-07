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
      <div className="mx-auto max-w-[1600px] px-8 md:px-12 py-7 flex items-center justify-between">
        <a href="/aurora" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#d4a017]/50 grid place-items-center">
            <div className="w-6 h-6 rounded-full border border-[#d4a017]/30">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#fef3c7] to-[#d4a017]" />
            </div>
          </div>
          <span className="font-serif text-2xl tracking-wider">Aurora</span>
        </a>
        <nav className="hidden md:flex items-center gap-12 text-xs tracking-[0.28em] uppercase text-white/70">
          <a href="#collections" className="hover:text-[#fde68a] transition-colors">Collections</a>
          <a href="#story" className="hover:text-[#fde68a] transition-colors">Our story</a>
          <a href="#atelier" className="hover:text-[#fde68a] transition-colors">Atelier</a>
          <a href="#book" className="hover:text-[#fde68a] transition-colors">Book an appointment</a>
        </nav>
        <a
          href="#book"
          className="hidden md:inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#d4a017]/60 text-[#fde68a] text-xs tracking-[0.3em] uppercase hover:bg-[#d4a017]/10 transition-colors"
        >
          Request a viewing
        </a>
      </div>
    </motion.header>
  );
}
