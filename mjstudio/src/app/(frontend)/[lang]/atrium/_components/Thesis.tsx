"use client";

import { motion } from "framer-motion";

export function Thesis() {
  return (
    <section id="thesis" className="relative py-40 px-8 md:px-12 border-t hairline-champagne bg-[#0e162b]">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="w-12 h-px bg-[#e8d49a]/60" />
            <span className="text-[10px] tracking-[0.35em] uppercase champagne-text">
              — Thesis · III
            </span>
            <div className="w-12 h-px bg-[#e8d49a]/60" />
          </div>
          <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.2] tracking-[-0.005em] text-balance">
            &ldquo;The great companies are built by founders who
            <span className="serif-italic champagne-ink"> think in decades</span>,
            not quarters. We wait for those people, and then we wait for them to let us in.&rdquo;
          </blockquote>
          <div className="mt-14">
            <div className="text-xs uppercase tracking-[0.3em] champagne-text">Elena Park &amp; David Morgan</div>
            <div className="mt-2 text-xs text-white/40 uppercase tracking-[0.2em]">Founding partners · 2014</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
