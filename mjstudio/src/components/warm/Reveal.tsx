"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The site's one motion vocabulary.
 *
 * Everything below the fold enters the same way — a short, restrained rise —
 * so the page reads as one orchestrated sequence rather than a scatter of
 * unrelated effects. Reduced-motion is handled globally by the
 * <MotionConfig reducedMotion="user"> in LenisProvider, which collapses these
 * to a plain opacity change.
 *
 * Never wrap above-the-fold hero content in these: framer-motion ships the
 * initial state into the SSR HTML, so an LCP element would sit invisible
 * until hydration. The hero uses the CSS `.hero-rise` animation instead.
 */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "-80px" } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to hold before entering — use sparingly; prefer RevealGroup. */
  delay?: number;
};

/** A single element that rises into view once. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={riseVariants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent for a grid or list: children enter one after another. Orchestrating
 * the stagger here (rather than hand-tuning a delay on each card) keeps the
 * rhythm identical everywhere and survives reordering.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** A child of RevealGroup. Inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={riseVariants}>
      {children}
    </motion.div>
  );
}
