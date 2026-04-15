"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function CTA() {
  return (
    <section
      id="write"
      className="relative py-48 px-8 md:px-12 border-t border-[#d4a017]/10 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[70rem] rounded-full bg-[#d4a017]/[0.04] blur-[160px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-4 mb-10 font-mono text-[9px] uppercase tracking-[0.5em] text-[var(--aurora-muted)]">
            <span className="w-10 h-px bg-[var(--aurora-gold)]/60" />
            By invitation
          </div>
          <h2
            className="font-serif font-light tracking-[-0.02em] leading-[0.92] text-balance"
            style={{ fontSize: "clamp(3rem, 7vw, 8rem)" }}
          >
            We work with ten brands
            <br />
            <span className="italic text-white/55">a year.</span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1, delay: 0.25 }}
            className="mt-12 text-white/50 font-light text-base md:text-lg max-w-xl leading-relaxed"
          >
            If that sounds like how you want to work, write to us in your own
            words. No form, no calendar link, no funnel — one message from you,
            one reply from us.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-14"
          >
            <a
              href="mailto:hello@aurora.studio"
              className="group inline-flex items-center gap-4 font-serif italic text-2xl md:text-3xl text-[var(--aurora-champagne)] border-b border-[var(--aurora-gold)]/30 pb-2 hover:border-[var(--aurora-champagne)] transition-colors"
            >
              hello@aurora.studio
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
