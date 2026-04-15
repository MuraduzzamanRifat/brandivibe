"use client";

import { motion } from "framer-motion";

const TENETS = [
  {
    num: "I",
    title: "Made in cities",
    line: "Not in factories. Every piece is stitched in one of three small ateliers we work with directly. Six people we know by name.",
  },
  {
    num: "II",
    title: "Runs of fifty",
    line: "Fifty pieces per release. When they're gone, the pattern goes into the archive. No restocks, no second chances at the same thing.",
  },
  {
    num: "III",
    title: "Worn, not replaced",
    line: "We'll rework anything we made for as long as you'll wear it. Free for members, at cost for everyone else. Forever is the plan.",
  },
];

/**
 * Section 4 — Story / authority. Not a manifesto, not a wall of copy. Three
 * tenets, one sentence each, editorial layout. Justifies premium positioning
 * without begging for it.
 */
export function Story() {
  return (
    <section
      id="story"
      className="relative py-32 md:py-48 border-t border-[var(--uturn-hairline)] bg-[var(--uturn-bg)] overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none grid grid-cols-12 opacity-[0.04]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="border-r border-[var(--uturn-ink)] last:border-r-0 h-full"
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1800px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-12 gap-6 mb-24"
        >
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-3 mb-4 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-ink-soft)]">
              <span className="w-8 h-px bg-[var(--uturn-accent)]" />
              The atelier · 004
            </div>
            <h2
              className="font-serif font-light tracking-[-0.02em] leading-[0.92] text-[var(--uturn-ink)]"
              style={{ fontSize: "clamp(2.75rem, 6vw, 6.5rem)" }}
            >
              Not a brand.
              <br />
              <span className="italic text-[var(--uturn-ink-muted)]">A practice.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 md:pt-10">
            <p className="text-[var(--uturn-ink-muted)] font-light text-lg md:text-xl leading-relaxed max-w-xl">
              UTurn started in 2019 as a correction. A bet that fewer, better,
              slower — made by people we could walk to — would outlast the rest.
              Six years in, we&apos;re still betting.
            </p>
          </div>
        </motion.div>

        <div className="border-t border-[var(--uturn-hairline)]">
          {TENETS.map((t, i) => (
            <motion.div
              key={t.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid grid-cols-12 gap-6 items-start py-16 md:py-20 border-b border-[var(--uturn-hairline)] group"
            >
              <div className="col-span-12 md:col-span-2">
                <div className="font-serif italic text-[var(--uturn-accent)]/70 leading-none text-5xl md:text-6xl group-hover:text-[var(--uturn-accent)] transition-colors duration-700">
                  {t.num}
                </div>
              </div>
              <div className="col-span-12 md:col-span-5">
                <h3
                  className="font-serif font-light leading-[0.95] tracking-[-0.015em] text-[var(--uturn-ink)]"
                  style={{ fontSize: "clamp(1.75rem, 3.8vw, 3.5rem)" }}
                >
                  {t.title}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-5">
                <p className="text-[var(--uturn-ink-muted)] font-light text-base md:text-lg leading-relaxed max-w-md">
                  {t.line}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
