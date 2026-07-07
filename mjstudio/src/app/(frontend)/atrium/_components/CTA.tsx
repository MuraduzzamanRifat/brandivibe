"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="submit" className="relative py-40 px-8 md:px-12 border-t hairline-champagne overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[70rem] rounded-full bg-[#e8d49a]/6 blur-[160px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
        >
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="w-12 h-px bg-[#e8d49a]/60" />
            <span className="text-[10px] tracking-[0.35em] uppercase champagne-text">
              — Submit a deck · IV
            </span>
            <div className="w-12 h-px bg-[#e8d49a]/60" />
          </div>
          <h2 className="font-serif text-5xl md:text-8xl font-normal tracking-[-0.015em] leading-[0.95] text-balance">
            We read
            <br />
            <span className="serif-italic champagne-ink">every submission.</span>
          </h2>
          <p className="mt-10 text-base md:text-lg text-white/55 max-w-xl mx-auto leading-relaxed">
            We reply within seven days. No warm intros required. No signalling games.
            Send a deck or a one-page memo — whichever feels truer to how you think.
          </p>
          <div className="mt-14 flex flex-col sm:flex-row gap-5 justify-center">
            <a
              href="mailto:partners@atrium.vc"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-[#f5e4ad] via-[#e8d49a] to-[#c9a14a] text-[#0a1020] font-medium tracking-[0.2em] text-xs uppercase hover:shadow-[0_0_60px_rgba(232,212,154,0.35)] transition-all"
            >
              partners@atrium.vc
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-5 border border-[#e8d49a]/40 champagne-text font-medium tracking-[0.2em] text-xs uppercase hover:bg-[#e8d49a]/5 transition-colors"
            >
              Read the latest letter
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
