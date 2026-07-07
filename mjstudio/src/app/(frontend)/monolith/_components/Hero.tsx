"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { LOADER_EXIT_AT_SEC } from "./Loader";

const HEADLINE_WORDS = ["Architecture", "that", "refuses", "to", "date."];

// Buffer so the first hero reveal starts just before the loader fully clears,
// producing a seamless handoff rather than a visible pause.
const HANDOFF_OVERLAP = 0.25;

export function Hero() {
  const reduced = useReducedMotion();
  const HERO_START = reduced ? 0 : Math.max(0, LOADER_EXIT_AT_SEC - HANDOFF_OVERLAP);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Subtle parallax: top rail drifts slow, headline slightly faster, bottom
  // rail fastest — layers separate as the viewport scrolls past.
  const topRailY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const bottomRailY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden">
      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 pt-[18vh] pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: HERO_START }}
          style={{ y: topRailY }}
          className="grid grid-cols-12 gap-6 mb-[12vh] font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mono-muted)]"
        >
          <div className="col-span-6 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--mono-red)]" />
            Index · 001 / 012
          </div>
          <div className="col-span-6 text-right">
            Porto + Tokyo · MMXXVI
          </div>
        </motion.div>

        <motion.h1
          style={{ fontSize: "clamp(4rem, 13vw, 18rem)", y: headlineY }}
          className="font-serif font-light leading-[0.88] tracking-[-0.015em] text-[var(--mono-fg)]"
        >
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden align-bottom mr-[0.18em] last:mr-0"
            >
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.15,
                  delay: HERO_START + 0.15 + i * 0.1,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className={`inline-block ${i === 2 ? "italic text-[var(--mono-muted)]" : ""}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          style={{ y: bottomRailY }}
          className="mt-[14vh] grid grid-cols-12 gap-6 items-end"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: HERO_START + 1.1 }}
            className="col-span-12 md:col-span-5"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--mono-muted)] mb-3">
              Current work · 006
            </div>
            <div className="font-serif text-2xl md:text-3xl text-[var(--mono-fg)] leading-[1.1] mb-4">
              Casa Ribeira —<br />
              <span className="italic text-[var(--mono-muted)]">a house against weather.</span>
            </div>
            <a
              href="#works"
              className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mono-fg)] border-b border-[var(--mono-fg)] pb-1 hover:gap-5 transition-all"
            >
              Read the archive
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: HERO_START + 1.4 }}
            className="col-span-12 md:col-span-7 flex justify-end items-end"
          >
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--mono-muted)]">
                Scroll for the index
              </div>
              <div className="mt-2 w-24 h-px bg-[var(--mono-fg)] ml-auto relative overflow-hidden">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className="absolute inset-y-0 w-full bg-[var(--mono-bg)]"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: HERO_START + 1.6 }}
        style={{ y: marqueeY }}
        className="absolute bottom-0 left-0 right-0 border-t border-[var(--mono-faint)] py-4 overflow-hidden"
      >
        <div className="flex gap-12 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mono-muted)] whitespace-nowrap mono-marquee">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 shrink-0">
              <span>MONOLITH · ATELIER</span>
              <span>EST. MCMXCII</span>
              <span>PORTO / TOKYO</span>
              <span>12 PROJECTS · 2026 INDEX</span>
              <span>RIBA GOLD MEDAL · 2024</span>
              <span>AR+D AWARD · 2023</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
