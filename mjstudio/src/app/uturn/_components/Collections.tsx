"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Block = {
  tag: string;
  headline: string;
  headlineItalic: string;
  cta: string;
  swatch: string;
  align: "left" | "right";
  meta: string;
};

const BLOCKS: Block[] = [
  {
    tag: "Release 04 · Midnight",
    headline: "Coats that know",
    headlineItalic: "where they're going.",
    cta: "Enter Outerwear",
    swatch: "swatch-slate",
    align: "left",
    meta: "12 pieces · from €720",
  },
  {
    tag: "Limited · 50 pairs",
    headline: "Leather, slow-stitched",
    headlineItalic: "by one pair of hands.",
    cta: "Enter Leather",
    swatch: "swatch-warm-clay",
    align: "right",
    meta: "8 pieces · from €340",
  },
  {
    tag: "For the desk",
    headline: "Objects quiet enough",
    headlineItalic: "to keep.",
    cta: "Enter Objects",
    swatch: "swatch-sand",
    align: "left",
    meta: "14 pieces · from €85",
  },
];

/**
 * Section 3 — Hero Collection Blocks. Large visuals, single headline per
 * block, single CTA. Alternating alignment so the eye doesn't settle into a
 * rhythm. Per the brief: visual first, text second, no paragraphs.
 */
export function Collections() {
  return (
    <section
      id="collections"
      className="relative py-24 md:py-32 border-t border-[var(--uturn-hairline)] bg-[var(--uturn-bg-deep)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 md:px-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between flex-wrap gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-ink-soft)]">
              <span className="w-8 h-px bg-[var(--uturn-accent)]" />
              The season · 003
            </div>
            <h2
              className="font-serif font-light tracking-[-0.015em] leading-[0.92] text-[var(--uturn-ink)] max-w-3xl"
              style={{ fontSize: "clamp(2.25rem, 5vw, 5rem)" }}
            >
              Three stories.
              <br />
              <span className="italic text-[var(--uturn-ink-muted)]">One drop.</span>
            </h2>
          </div>
          <div className="text-right font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)]">
            Ships 15 September
          </div>
        </motion.div>
      </div>

      <div className="space-y-20 md:space-y-28">
        {BLOCKS.map((b, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{
              duration: 1.1,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <div className="mx-auto max-w-[1800px] px-6 md:px-10">
              <div
                className={`grid grid-cols-12 gap-6 md:gap-10 items-end ${
                  b.align === "right" ? "" : ""
                }`}
              >
                <div
                  className={`col-span-12 ${
                    b.align === "left"
                      ? "md:col-span-8 md:order-1"
                      : "md:col-span-8 md:col-start-5 md:order-1"
                  }`}
                >
                  <div
                    className={`relative aspect-[16/10] md:aspect-[16/9] overflow-hidden ${b.swatch}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_55%,transparent_0%,rgba(15,14,12,0.45)_80%,rgba(15,14,12,0.75)_100%)] pointer-events-none" />

                    <div className="absolute top-6 md:top-8 left-6 md:left-10 font-mono text-[9px] uppercase tracking-[0.35em] text-[rgba(243,239,230,0.65)]">
                      {b.tag}
                    </div>

                    <div className="absolute top-6 md:top-8 right-6 md:right-10 font-mono text-[9px] uppercase tracking-[0.3em] text-[rgba(243,239,230,0.5)]">
                      {String(i + 1).padStart(2, "0")} / 03
                    </div>
                  </div>
                </div>

                <div
                  className={`col-span-12 ${
                    b.align === "left"
                      ? "md:col-span-11 md:col-start-1"
                      : "md:col-span-11 md:col-start-2 md:text-right"
                  } -mt-16 md:-mt-28 relative z-10`}
                >
                  <h3
                    className={`font-serif font-light leading-[0.92] tracking-[-0.02em] text-[var(--uturn-bg)] [text-shadow:0_1px_24px_rgba(15,14,12,0.35)] ${
                      b.align === "right" ? "md:text-right" : ""
                    }`}
                    style={{ fontSize: "clamp(2.5rem, 7vw, 7.5rem)" }}
                  >
                    {b.headline}{" "}
                    <span className="italic text-[var(--uturn-accent-warm)]">
                      {b.headlineItalic}
                    </span>
                  </h3>

                  <div
                    className={`mt-8 flex items-end gap-10 flex-wrap ${
                      b.align === "right" ? "md:justify-end" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-ink)] bg-[var(--uturn-bg)] px-6 py-3.5 rounded-full hover:bg-[var(--uturn-ink)] hover:text-[var(--uturn-bg)] transition-colors"
                    >
                      {b.cta}
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--uturn-ink-muted)]">
                      {b.meta}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
