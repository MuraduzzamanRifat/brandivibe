"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="app" className="relative py-40 px-6 md:px-8 border-t border-[#fbbf24]/10 overflow-hidden">
      {/* stock video bg — gold particles (Dan Cristian Pădureț / Pexels) */}
      <video
        src="/helix/stock/cta-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
      />
      {/* dark overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c]/60 to-[#0a0f1c] pointer-events-none" />
      {/* ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-[#fbbf24]/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="font-mono text-xs text-[#fbbf24] uppercase tracking-[0.3em] mb-6">
            — Launch
          </div>
          <h2 className="font-heading text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] text-balance">
            Start earning
            <br />
            <span className="gold-text glow-gold">real yield</span> today.
          </h2>
          <p className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            Join 184,000+ stakers earning 4.82% APY. Deposit in seconds, unstake anytime.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black font-semibold text-lg hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all hover:scale-[1.02]"
            >
              Launch app
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full border-gold text-white font-medium hover:bg-[#fbbf24]/5 transition-colors"
            >
              Read the docs
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
