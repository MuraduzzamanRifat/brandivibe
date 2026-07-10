"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_HOLD_MS = 2100;
const EXIT_DURATION = 0.9;

export const LOADER_EXIT_AT_SEC = INTRO_HOLD_MS / 1000 + EXIT_DURATION;

type Corner = {
  pos: string;
  from: { y: string; rotate: number };
  exit: { x: string; y: string; rotate: number };
  color: string;
  introDelay: number;
  exitDelay: number;
};

const CORNERS: Corner[] = [
  {
    pos: "top-0 left-0",
    from: { y: "-100%", rotate: -180 },
    exit: { x: "-120%", y: "-120%", rotate: -45 },
    color: "#ffd166",
    introDelay: 0,
    exitDelay: 0,
  },
  {
    pos: "top-0 right-0",
    from: { y: "-100%", rotate: 180 },
    exit: { x: "120%", y: "-120%", rotate: 45 },
    color: "#06d6a0",
    introDelay: 0.08,
    exitDelay: 0.06,
  },
  {
    pos: "bottom-0 left-0",
    from: { y: "100%", rotate: 180 },
    exit: { x: "-120%", y: "120%", rotate: 45 },
    color: "#ef476f",
    introDelay: 0.16,
    exitDelay: 0.12,
  },
  {
    pos: "bottom-0 right-0",
    from: { y: "100%", rotate: -180 },
    exit: { x: "120%", y: "120%", rotate: -45 },
    color: "#118ab2",
    introDelay: 0.24,
    exitDelay: 0.18,
  },
];

export function Loader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"drop" | "wobble" | "exit" | "done">("drop");

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    const t1 = setTimeout(() => setPhase("wobble"), 1000);
    const t2 = setTimeout(() => setPhase("exit"), INTRO_HOLD_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduced]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {CORNERS.map((c, i) => {
        const isExit = phase === "exit";
        const isWobble = phase === "wobble";
        const target = isExit
          ? c.exit
          : isWobble
            ? { x: 0, y: 0, rotate: [0, 2, -2, 1, 0] }
            : { x: 0, y: 0, rotate: 0 };

        return (
          <motion.div
            key={i}
            initial={c.from}
            animate={target}
            transition={
              isExit
                ? { duration: EXIT_DURATION, delay: c.exitDelay, ease: [0.76, 0, 0.24, 1] }
                : isWobble
                  ? { duration: 1.1, ease: "easeInOut" }
                  : { duration: 0.75, delay: c.introDelay, ease: [0.34, 1.56, 0.64, 1] }
            }
            onAnimationComplete={
              i === CORNERS.length - 1
                ? () => {
                    if (phase === "exit") setPhase("done");
                  }
                : undefined
            }
            className={`absolute ${c.pos} w-1/2 h-1/2`}
            style={{ background: c.color }}
          />
        );
      })}

      <motion.div
        initial={{ scale: 0, rotate: -12, y: 20 }}
        animate={
          phase === "exit"
            ? { scale: 1.8, opacity: 0, rotate: 8 }
            : phase === "wobble"
              ? { scale: [1, 1.04, 1], rotate: [0, 1.5, -1, 0], y: 0, opacity: 1 }
              : { scale: 1, rotate: 0, y: 0, opacity: 1 }
        }
        transition={
          phase === "exit"
            ? { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
            : phase === "wobble"
              ? { duration: 1.1, ease: "easeInOut" }
              : { duration: 0.75, delay: 0.55, ease: [0.34, 1.7, 0.64, 1] }
        }
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: [0.34, 1.7, 0.64, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] font-bold">
              Neuron / loading
            </span>
          </motion.div>
          <motion.div
            initial={{ scaleY: 0.2, scaleX: 1.4, y: 20 }}
            animate={{ scaleY: 1, scaleX: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: [0.34, 1.7, 0.64, 1] }}
            className="mt-6 font-black text-black text-6xl md:text-8xl tracking-tight origin-bottom"
          >
            Woof.
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
