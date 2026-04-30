"use client";

import {
  motion,
  useMotionValue,
  animate,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Brandivibe studio loader. Shown only on the landing page — demos have their
 * own loaders. Distinct identity from the demo loaders (monolith = blinds,
 * pulse = breathing, neuron = grid) by using:
 *   - Letter-by-letter BRANDIVIBE reveal with a single sweeping gradient bar
 *   - 000 → 100 counter in the corner
 *   - Exit: the whole plate slides up with a rubbery curve, revealing the site
 *
 * Runs once per session via sessionStorage so SPA-style navigation doesn't
 * re-trigger it. Respects prefers-reduced-motion.
 */

const COUNT_DURATION = 1.6;
const POST_COUNT_HOLD = 0.25;
const EXIT_DURATION = 0.9;
const SESSION_KEY = "bv_loader_seen";

const BRAND = "BRANDIVIBE".split("");

function markSeen() {
  if (typeof window !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
}

export function Loader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"counting" | "exiting" | "done">("counting");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toString().padStart(3, "0"));

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setPhase("done");
      return;
    }
    if (reduced) {
      setPhase("done");
      markSeen();
      return;
    }

    const c = animate(count, 100, {
      duration: COUNT_DURATION,
      ease: [0.6, 0.05, 0.2, 1],
    });

    const exitTimer = setTimeout(
      () => setPhase("exiting"),
      (COUNT_DURATION + POST_COUNT_HOLD) * 1000
    );
    const doneTimer = setTimeout(
      () => {
        setPhase("done");
        markSeen();
      },
      (COUNT_DURATION + POST_COUNT_HOLD + EXIT_DURATION) * 1000
    );

    return () => {
      c.stop();
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [count, reduced]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ y: 0 }}
          animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: EXIT_DURATION, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-[#08080a] overflow-hidden flex flex-col"
        >
          {/* Top row — counter + studio meta */}
          <div className="flex items-start justify-between px-6 md:px-12 pt-8 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            <div>
              <div>Brandivibe</div>
              <div className="mt-1 text-white/20">Studio · Loading</div>
            </div>
            <motion.div className="tabular-nums text-right">
              <motion.span>{rounded}</motion.span>
              <span>%</span>
            </motion.div>
          </div>

          {/* Middle — BRANDIVIBE with sweeping gradient bar */}
          <div className="flex-1 flex flex-col items-center justify-center relative px-6">
            <div className="relative flex items-baseline">
              {BRAND.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.1 + i * 0.045,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block font-semibold text-[14vw] md:text-[10vw] leading-none tracking-[-0.04em] text-white"
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <div className="mt-10 relative h-[2px] w-[60vw] md:w-[48vw] bg-white/5 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: COUNT_DURATION + POST_COUNT_HOLD,
                  ease: [0.6, 0.05, 0.2, 1],
                }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </div>
          </div>

          {/* Bottom — faint tagline that matches the hero's conversion story */}
          <div className="px-6 md:px-12 pb-10 flex justify-between items-end font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            <div>— Premium 3D web design · $5K – $25K</div>
            <div>Est. 2024</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
