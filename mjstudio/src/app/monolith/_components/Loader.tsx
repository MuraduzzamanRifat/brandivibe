"use client";

import {
  motion,
  useMotionValue,
  animate,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState } from "react";

const COUNT_DURATION = 2.2;
const POST_COUNT_HOLD = 0.35;
const EXIT_DURATION = 1.1;
const EXIT_STAGGER = 0.12;

/** Time at which the hero becomes fully visible. Hero imports this. */
export const LOADER_EXIT_AT_SEC =
  COUNT_DURATION + POST_COUNT_HOLD + EXIT_DURATION + EXIT_STAGGER * 2;

const LABEL_WORDS = ["Loading", "the", "index"];
const STRIPS = [0, 1, 2];

export function Loader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"counting" | "exiting" | "done">("counting");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toString().padStart(3, "0"));

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    const controls = animate(count, 100, {
      duration: COUNT_DURATION,
      ease: [0.6, 0.05, 0.2, 1],
      onComplete: () => {
        setTimeout(() => setPhase("exiting"), POST_COUNT_HOLD * 1000);
      },
    });
    return () => controls.stop();
  }, [count, reduced]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] flex pointer-events-none">
      {STRIPS.map((i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
          transition={{
            duration: EXIT_DURATION,
            delay: phase === "exiting" ? i * EXIT_STAGGER : 0,
            ease: [0.76, 0, 0.24, 1],
          }}
          onAnimationComplete={
            i === STRIPS.length - 1
              ? () => {
                  if (phase === "exiting") setPhase("done");
                }
              : undefined
          }
          className="flex-1 bg-[var(--mono-bg)] border-r border-[var(--mono-faint)] last:border-r-0 relative overflow-hidden"
        >
          {/* Faint vertical hairlines that scale down on exit for a "blinds closing" feel */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={phase === "exiting" ? { scaleY: 0 } : { scaleY: 1 }}
            transition={{
              duration: phase === "exiting" ? 0.5 : COUNT_DURATION,
              delay: phase === "exiting" ? i * 0.04 : i * 0.15,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-y-0 left-1/2 w-px bg-[var(--mono-faint)] origin-top"
          />
        </motion.div>
      ))}

      <div className="absolute inset-0 flex items-end">
        <div className="relative w-full px-6 md:px-12 pb-10 md:pb-14">
          <div className="flex items-end justify-between gap-10">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--mono-muted)] mb-4 flex gap-[0.4em]">
                {LABEL_WORDS.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden">
                    <motion.span
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: 0.9,
                        delay: 0.25 + i * 0.08,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                      className="inline-block"
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </div>
              <motion.span
                className="font-serif font-light leading-[0.85] text-[var(--mono-fg)] tabular-nums block"
                style={{ fontSize: "clamp(6rem, 18vw, 22rem)" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {rounded}
              </motion.span>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2 pb-6">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--mono-muted)]">
                Monolith · Porto / Tokyo
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--mono-fg)]">
                <span className="w-2 h-2 rounded-full bg-[var(--mono-red)] animate-pulse" />
                MMXXVI vintage
              </div>
            </div>
          </div>
          <motion.div
            className="absolute left-6 right-6 md:left-12 md:right-12 bottom-6 h-px bg-[var(--mono-fg)] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: COUNT_DURATION, ease: [0.6, 0.05, 0.2, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
