"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LOADER_EXIT_AT_SEC } from "./Loader";

const HANDOFF_OVERLAP = 0.25;
const LINE_ONE = ["Small", "runs."];
const LINE_TWO = ["Slow", "fashion."];

export function Hero() {
  const reduced = useReducedMotion();
  const HERO_START = reduced ? 0 : Math.max(0, LOADER_EXIT_AT_SEC - HANDOFF_OVERLAP);

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden grain">
      {/* Full-bleed ambient swatch. Two layered gradients for depth without imagery. */}
      <div className="absolute inset-0 swatch-deep-plum" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_40%,rgba(166,75,42,0.25)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,14,12,0.45)] via-transparent to-[rgba(15,14,12,0.85)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1800px] w-full px-6 md:px-10 pb-16 md:pb-20 pt-36">
        {/* Top row — collection tag / shipping line (balance + rhythm, not content) */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: HERO_START }}
          className="absolute top-28 left-6 md:left-10 right-6 md:right-10 flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.45em] text-[rgba(243,239,230,0.55)]"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--uturn-accent-warm)]" />
            Release 04 · Midnight
          </div>
          <div className="text-right">
            Worldwide express · 48h
          </div>
        </motion.div>

        {/* Headline — 2 lines, word-mask reveal, all serif italic */}
        <h1
          className="font-serif font-light leading-[0.88] tracking-[-0.025em] text-[var(--uturn-bg)]"
          style={{ fontSize: "clamp(4rem, 14vw, 18rem)" }}
        >
          <div className="flex flex-wrap gap-x-[0.18em]">
            {LINE_ONE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.3,
                    delay: HERO_START + 0.2 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block italic"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-[0.18em] mt-1">
            {LINE_TWO.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.3,
                    delay: HERO_START + 0.45 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block italic text-[var(--uturn-accent-warm)]"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </div>
        </h1>

        {/* Bottom row — single-line positioning + one soft CTA (no hard ask yet) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: HERO_START + 1.2 }}
          className="mt-16 flex items-end justify-between flex-wrap gap-8"
        >
          <p className="text-[var(--uturn-bg)] font-light text-lg md:text-xl max-w-md leading-snug">
            Four releases a year. Fifty pieces each. For the people who&apos;d
            rather wait.
          </p>
          <a
            href="#shop"
            className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-bg)] border-b border-[rgba(243,239,230,0.4)] pb-2 hover:border-[var(--uturn-accent-warm)] hover:text-[var(--uturn-accent-warm)] transition-colors"
          >
            Explore the season
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
