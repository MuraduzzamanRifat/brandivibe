"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HeroScene } from "./HeroScene";
import { LOADER_EXIT_AT_SEC } from "./Loader";

const HANDOFF_OVERLAP = 0.3;

export function Hero() {
  const reduced = useReducedMotion();
  const HERO_START = reduced ? 0 : Math.max(0, LOADER_EXIT_AT_SEC - HANDOFF_OVERLAP);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden grain">
      <div className="absolute inset-0 opacity-35 pointer-events-none">
        <HeroScene />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_0%,rgba(7,6,10,0.75)_70%,var(--aurora-bg)_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] w-full px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: HERO_START }}
          className="flex items-center gap-4 mb-16 font-mono text-[9px] uppercase tracking-[0.5em] text-[var(--aurora-muted)]"
        >
          <span className="w-10 h-px bg-[var(--aurora-gold)]/60" />
          Studio · MMXXVI
        </motion.div>

        <h1
          className="font-serif font-light leading-[0.92] tracking-[-0.02em] text-[var(--aurora-fg-white)] max-w-6xl"
          style={{ fontSize: "clamp(3.5rem, 9.5vw, 11rem)" }}
        >
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1.4,
                delay: HERO_START + 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              Interfaces for
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1.4,
                delay: HERO_START + 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block italic gold-ink"
            >
              work that hasn&apos;t happened yet.
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: HERO_START + 1.1 }}
          className="mt-20 flex items-center justify-between flex-wrap gap-8"
        >
          <a
            href="#approach"
            className="group inline-flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--aurora-champagne)] pb-2 border-b border-[var(--aurora-gold)]/40 hover:border-[var(--aurora-gold)] transition-colors"
          >
            Begin a conversation
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--aurora-muted)] text-right">
            Ten clients a year
          </div>
        </motion.div>
      </div>
    </section>
  );
}
