"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-4">
        <div className="glass rounded-full flex items-center justify-between pl-5 pr-2 py-2">
          <a href="/" className="flex items-center gap-2.5">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0369a1] to-[#0ea5e9]" />
              <div className="absolute inset-[3px] rounded-full bg-white grid place-items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0369a1]" />
              </div>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Neuron</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm text-foreground-muted">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#code" className="hover:text-foreground transition-colors">Playground</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href="#" className="hidden sm:block text-sm text-foreground-muted hover:text-foreground transition-colors px-3 py-1.5">
              Sign in
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0a0a0f] text-white text-sm font-medium hover:bg-[#1a1a1f] transition-colors"
            >
              Start free
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
