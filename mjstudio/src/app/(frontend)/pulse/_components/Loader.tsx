"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COUNT_DURATION = 2.4;
const POST_COUNT_HOLD = 0.4;
const EXIT_DURATION = 1.2;

export const LOADER_EXIT_AT_SEC = COUNT_DURATION + POST_COUNT_HOLD + EXIT_DURATION;

const SCRAMBLE_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*!?";
const TARGET = "LAYER · 01";
const SCRAMBLE_THROTTLE_MS = 50;

function scrambled(target: string, progress: number) {
  const revealed = Math.floor(target.length * progress);
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    if (i < revealed || ch === " ") {
      out += ch;
    } else {
      out += SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
    }
  }
  return out;
}

export function Loader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"counting" | "exit" | "done">("counting");
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => Math.floor(v).toString().padStart(2, "0"));
  // Concept: typographic distortion — as the number climbs, it skews and stretches.
  const counterScale = useTransform(count, [0, 100], [0.7, 1.15]);
  const counterSkew = useTransform(count, [0, 100], [0, -6]);
  const counterStretchY = useTransform(count, [0, 100], [1, 1.12]);
  const counterLetterSpacing = useTransform(count, [0, 100], ["-0.03em", "-0.08em"]);
  const scrambleRef = useRef<HTMLDivElement>(null);
  const lastScrambleAt = useRef(0);

  useMotionValueEvent(count, "change", (v) => {
    const now = performance.now();
    if (now - lastScrambleAt.current < SCRAMBLE_THROTTLE_MS) return;
    lastScrambleAt.current = now;
    if (scrambleRef.current) {
      scrambleRef.current.textContent = scrambled(TARGET, v / 100);
    }
  });

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    const controls = animate(count, 100, {
      duration: COUNT_DURATION,
      ease: [0.76, 0, 0.24, 1],
      onComplete: () => {
        if (scrambleRef.current) scrambleRef.current.textContent = TARGET;
        setTimeout(() => setPhase("exit"), POST_COUNT_HOLD * 1000);
      },
    });
    return () => controls.stop();
  }, [count, reduced]);

  if (phase === "done") return null;

  return (
    <motion.div
      initial={{ y: 0, rotate: 0 }}
      animate={phase === "exit" ? { y: "-105%", rotate: -3 } : { y: 0, rotate: 0 }}
      transition={{ duration: EXIT_DURATION, ease: [0.83, 0, 0.17, 1] }}
      onAnimationComplete={() => {
        if (phase === "exit") setPhase("done");
      }}
      className="fixed inset-0 z-[100] bg-[#fde8d4] flex items-end origin-[50%_120%] overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none grid grid-cols-12 opacity-[0.04]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r border-[#1c1917] last:border-r-0 h-full" />
        ))}
      </div>

      <motion.div
        animate={{ x: [0, 30, -10, 0], y: [0, -20, 15, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[35vw] h-[35vw] rounded-full bg-[#fbcfc0] blur-2xl opacity-60"
      />
      <motion.div
        animate={{ x: [0, -25, 15, 0], y: [0, 20, -10, 0], scale: [1, 0.95, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-32 -right-32 w-[30vw] h-[30vw] rounded-full bg-[#d4f0e0] blur-2xl opacity-50"
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[#f0d8e8] blur-2xl opacity-40"
      />

      <div className="relative w-full px-6 md:px-12 pb-12 md:pb-16">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#8b5e3c] mb-4"
            >
              One concept · layering
            </motion.div>
            <motion.span
              style={{
                fontSize: "clamp(7rem, 22vw, 26rem)",
                scale: counterScale,
                skewX: counterSkew,
                scaleY: counterStretchY,
                letterSpacing: counterLetterSpacing,
              }}
              className="font-serif italic font-light leading-[0.82] text-[#1c1917] tabular-nums block origin-left"
            >
              {display}
            </motion.span>
          </div>
          <div className="col-span-5 text-right pb-6 md:pb-10">
            <div
              ref={scrambleRef}
              className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#1c1917]"
            >
              {TARGET}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-2 font-mono text-[9px] text-[#8b5e3c] uppercase tracking-[0.3em]"
            >
              Studio · the first sheet
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
