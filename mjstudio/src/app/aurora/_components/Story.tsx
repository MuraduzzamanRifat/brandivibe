"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    numeral: "I",
    title: "Strategy",
    line: "The question that precedes the feature.",
  },
  {
    numeral: "II",
    title: "Product",
    line: "Interfaces that teach themselves in use.",
  },
  {
    numeral: "III",
    title: "Systems",
    line: "Brand language that survives the relaunch.",
  },
];

export function Story() {
  return (
    <section
      id="approach"
      className="relative py-40 px-8 md:px-12 border-t border-[#d4a017]/10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#07060a] via-[#07060a]/70 to-[#07060a] pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-32"
        >
          <div className="flex items-center gap-4 mb-10 font-mono text-[9px] uppercase tracking-[0.5em] text-[var(--aurora-muted)]">
            <span className="w-10 h-px bg-[var(--aurora-gold)]/60" />
            Approach · three pillars
          </div>
          <h2
            className="font-serif font-light tracking-[-0.02em] leading-[0.95] text-balance max-w-5xl"
            style={{ fontSize: "clamp(2.75rem, 6vw, 6rem)" }}
          >
            We take on three kinds of work.
            <br />
            <span className="italic text-white/55">One idea at a time.</span>
          </h2>
        </motion.div>

        <div className="space-y-0 border-t border-[var(--aurora-gold)]/10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.numeral}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-12 gap-6 items-end py-16 md:py-20 border-b border-[var(--aurora-gold)]/10 group"
            >
              <div className="col-span-12 md:col-span-3">
                <div className="font-serif italic text-[var(--aurora-gold)]/70 leading-none text-5xl md:text-6xl group-hover:text-[var(--aurora-champagne)] transition-colors duration-700">
                  {p.numeral}
                </div>
              </div>
              <div className="col-span-12 md:col-span-9">
                <h3
                  className="font-serif font-light leading-[0.95] tracking-[-0.015em] text-[var(--aurora-fg-white)]"
                  style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
                >
                  {p.title}
                </h3>
                <p className="mt-5 text-white/55 font-light text-base md:text-lg max-w-2xl leading-relaxed">
                  {p.line}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
