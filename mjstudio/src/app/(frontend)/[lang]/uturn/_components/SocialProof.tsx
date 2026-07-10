"use client";

import { motion } from "framer-motion";

const STATS = [
  { k: "Members", v: "1,240", note: "across 38 cities" },
  { k: "Releases", v: "56", note: "since 2019" },
  { k: "Returned", v: "1.4%", note: "over six years" },
];

const QUIET_PRESS = [
  "Monocle",
  "Hole & Corner",
  "Kinfolk",
  "It's Nice That",
  "The Gentlewoman",
  "Apartamento",
];

/**
 * Section 5 — Social Proof. No testimonials, no stars, no reviews. Three
 * numbers, a row of press marks as plain text, and one hairline quote. The
 * signal is calm competence, not volume.
 */
export function SocialProof() {
  return (
    <section className="relative py-24 md:py-32 border-t border-[var(--uturn-hairline)] bg-[var(--uturn-bg)]">
      <div className="relative mx-auto max-w-[1800px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-16 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-ink-soft)]"
        >
          <span className="w-8 h-px bg-[var(--uturn-accent)]" />
          Quietly · 005
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 border-b border-[var(--uturn-hairline)] pb-16 md:pb-20">
          {STATS.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-3">
                {s.k}
              </div>
              <div
                className="font-serif font-light italic text-[var(--uturn-ink)] leading-[0.85] tracking-[-0.02em]"
                style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
              >
                {s.v}
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--uturn-ink-muted)]">
                {s.note}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mt-16 md:mt-20 grid grid-cols-12 gap-6 items-end"
        >
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-3">
              Written about in
            </div>
            <div className="font-serif italic text-[var(--uturn-ink-muted)] text-lg md:text-xl leading-relaxed">
              {QUIET_PRESS.join(" · ")}
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <p className="font-serif italic text-[var(--uturn-ink)] text-2xl md:text-4xl leading-[1.2] tracking-[-0.01em]">
              &ldquo;The only brand I buy from that I&apos;d defend if
              someone came for it at dinner.&rdquo;
            </p>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)]">
              — Member 0417 · Release 01 through 04
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
