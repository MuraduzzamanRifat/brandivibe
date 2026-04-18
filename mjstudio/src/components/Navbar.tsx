"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 mix-blend-difference"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span className="font-mono text-sm uppercase tracking-widest text-white">Brandivibe</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 font-mono text-xs uppercase tracking-widest text-white/70">
          <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#intelligence" className="hover:text-white transition-colors">AI Brain</a>
          <a href="#process" className="hover:text-white transition-colors">Process</a>
          <Link href="/journal" className="hover:text-white transition-colors">Journal</Link>
        </nav>
        <MagneticButton
          href="#contact"
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/60 text-white font-mono text-xs uppercase tracking-widest"
        >
          Book a call
        </MagneticButton>
      </div>
    </motion.header>
  );
}
