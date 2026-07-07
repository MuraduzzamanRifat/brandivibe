"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="book" className="relative py-40 px-6 md:px-10 border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-[#14b8a6]/8 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="font-mono text-[10px] text-[#14b8a6] uppercase tracking-[0.3em] mb-6">
            — Request access · 05
          </div>
          <h2 className="font-serif text-5xl md:text-8xl font-normal tracking-tight leading-[0.95] text-balance">
            Build on the rails
            <br />
            <span className="serif-italic cream-text">of the future.</span>
          </h2>
          <p className="mt-8 text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            Axiom is currently in private beta. Join 1,200+ teams on the waitlist,
            including three Series-A fintechs and a central bank.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#14b8a6] text-[#0a0e1a] font-semibold text-lg hover:bg-[#2dd4bf] transition-all"
            >
              Join the waitlist
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Read the whitepaper
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
