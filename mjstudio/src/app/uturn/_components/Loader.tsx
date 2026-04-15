"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_HOLD_MS = 1600;
const EXIT_DURATION = 1.1;

export const LOADER_EXIT_AT_SEC = INTRO_HOLD_MS / 1000 + EXIT_DURATION;

export function Loader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"intro" | "exit" | "done">("intro");

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setPhase("exit"), INTRO_HOLD_MS);
    return () => clearTimeout(t);
  }, [reduced]);

  if (phase === "done") return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: EXIT_DURATION, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (phase === "exit") setPhase("done");
      }}
      className="fixed inset-0 z-[100] bg-[var(--uturn-bg)] flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-[var(--uturn-ink)] origin-center mb-6 mx-auto"
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="font-serif italic text-[var(--uturn-ink)]"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)", lineHeight: 0.9 }}
        >
          UTurn
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-5 font-mono text-[9px] uppercase tracking-[0.45em] text-[var(--uturn-ink-soft)]"
        >
          Capsule Atelier · MMXXVI
        </motion.div>
      </div>
    </motion.div>
  );
}
