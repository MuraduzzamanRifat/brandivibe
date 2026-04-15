"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_HOLD_MS = 2000;
const SPLIT_DURATION = 1.4;

export const LOADER_EXIT_AT_SEC = INTRO_HOLD_MS / 1000 + SPLIT_DURATION;

export function Loader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"intro" | "split" | "done">("intro");

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setPhase("split"), INTRO_HOLD_MS);
    return () => clearTimeout(t);
  }, [reduced]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <motion.div
        initial={{ y: 0 }}
        animate={phase === "split" ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: SPLIT_DURATION, ease: [0.83, 0, 0.17, 1] }}
        onAnimationComplete={() => {
          if (phase === "split") setPhase("done");
        }}
        className="absolute inset-x-0 top-0 h-1/2 bg-[var(--aurora-bg)] overflow-hidden"
      >
        <div className="absolute inset-x-0 bottom-0 translate-y-1/2 text-center px-6">
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.4, delay: 0.5 }}
            className="font-mono text-[9px] uppercase text-[var(--aurora-muted)]"
          >
            Studio — by conversation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30, letterSpacing: "0.02em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
            transition={{ duration: 1.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-serif italic text-[var(--aurora-champagne)]"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)", lineHeight: 1 }}
          >
            Aurora
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 mx-auto w-64 h-px bg-gradient-to-r from-transparent via-[var(--aurora-gold)] to-transparent origin-center"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={phase === "split" ? { y: "100%" } : { y: 0 }}
        transition={{ duration: SPLIT_DURATION, ease: [0.83, 0, 0.17, 1] }}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--aurora-bg)]"
      />
    </div>
  );
}
