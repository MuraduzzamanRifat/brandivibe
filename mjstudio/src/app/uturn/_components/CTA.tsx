"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * Section 7 — the one hard ask. Everything above was warm-up; this is the
 * first time the page genuinely requests action. One headline, one sentence,
 * one primary action, one secondary text link. No form, no modal, no upsell.
 */
export function CTA() {
  return (
    <section
      id="join"
      className="relative py-40 md:py-56 border-t border-[var(--uturn-hairline)] overflow-hidden bg-[var(--uturn-ink)] text-[var(--uturn-bg)]"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[70rem] rounded-full bg-[var(--uturn-accent)]/[0.07] blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none grid grid-cols-12 opacity-[0.04]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="border-r border-[var(--uturn-bg)] last:border-r-0 h-full"
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-10 font-mono text-[9px] uppercase tracking-[0.5em] text-[rgba(243,239,230,0.5)]">
            <span className="w-10 h-px bg-[var(--uturn-accent-warm)]" />
            The invitation · 007
          </div>
          <h2
            className="font-serif font-light tracking-[-0.02em] leading-[0.9] text-balance"
            style={{ fontSize: "clamp(3rem, 8.5vw, 10rem)" }}
          >
            Release 04 opens
            <br />
            <span className="italic text-[var(--uturn-accent-warm)]">
              Friday at noon.
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-14 max-w-xl text-[rgba(243,239,230,0.6)] font-light text-base md:text-lg leading-relaxed"
          >
            Fifty pieces per category. First access goes to members, then to
            the waitlist in the order you joined, then — if there&apos;s
            anything left — to everyone else.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1, delay: 0.35 }}
            className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-8"
          >
            <a
              href="#join"
              className="group inline-flex items-center gap-4 px-10 py-5 rounded-full bg-[var(--uturn-bg)] text-[var(--uturn-ink)] font-mono text-[10px] uppercase tracking-[0.35em] hover:bg-[var(--uturn-accent-warm)] hover:text-[var(--uturn-ink)] transition-colors"
            >
              Join the waitlist
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#members"
              className="font-mono text-[10px] uppercase tracking-[0.35em] text-[rgba(243,239,230,0.55)] border-b border-[rgba(243,239,230,0.3)] pb-2 hover:text-[var(--uturn-bg)] hover:border-[var(--uturn-bg)] transition-colors"
            >
              Become a member →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="mt-20 flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.35em] text-[rgba(243,239,230,0.4)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--uturn-accent-warm)] animate-pulse" />
            No payment taken until the release. You&apos;ll hear from us
            twice — once Thursday, once Friday.
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
