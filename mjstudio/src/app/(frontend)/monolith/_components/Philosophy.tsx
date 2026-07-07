"use client";

import { motion } from "framer-motion";

export function Philosophy() {
  return (
    <section id="philosophy" className="relative py-40 px-6 md:px-12 border-t border-[#1a1a1a]/10 bg-[#e7e3dc]">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="w-16 h-px bg-[#1a1a1a]" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#5a5a5a]">
              — Philosophy · III
            </span>
            <div className="w-16 h-px bg-[#1a1a1a]" />
          </div>
          <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.15] text-[#1a1a1a] tracking-[-0.01em] text-balance">
            &ldquo;Buildings outlive us. They should be designed slowly and
            <span className="serif-italic"> repaired patiently</span>.
            We make four buildings a decade, not forty a year.&rdquo;
          </blockquote>
          <div className="mt-16">
            <div className="text-xs uppercase tracking-[0.3em] text-[#5a5a5a]">Luísa Almeida</div>
            <div className="mt-1 text-xs text-[#8a8a88]">Founder · Monolith Studio</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
