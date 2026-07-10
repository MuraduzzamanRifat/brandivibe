"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";

/**
 * The site-wide calm-flowing background, mounted once in the root layout so it
 * persists across navigation (no restart between pages).
 *
 * A still gradient — the same coral+teal-over-ivory the shader targets — is
 * ALWAYS painted underneath. So there is never a flash of white, and anyone
 * who gets no WebGL still sees the intended look:
 *   - server HTML / pre-hydration
 *   - prefers-reduced-motion
 *   - no WebGL, or a GPU crash (SceneErrorBoundary)
 *   - small screens, where the animated layer is skipped to save battery
 *
 * three.js loads lazily (dynamic, ssr:false), so it never blocks first paint
 * or the LCP text — the animation simply eases in a moment after the page is
 * already usable.
 */

const FlowScene = dynamic(() => import("./FlowScene"), { ssr: false });

// The reduced-motion / no-JS still frame. Matches the shader's palette.
const STILL_GRADIENT =
  "radial-gradient(60% 50% at 18% 22%, rgba(255,106,61,0.10), transparent 60%)," +
  "radial-gradient(55% 45% at 82% 30%, rgba(15,165,152,0.08), transparent 60%)," +
  "radial-gradient(70% 60% at 50% 100%, rgba(255,106,61,0.05), transparent 60%)," +
  "var(--background)";

export function FlowBackdrop() {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [bigEnough, setBigEnough] = useState(false);

  useEffect(() => {
    // Skip the live layer on phones: a persistent WebGL loop is the wrong
    // battery trade there, and the still gradient already carries the look.
    setBigEnough(window.matchMedia("(min-width: 768px) and (pointer: fine)").matches);
    // Let first paint + hydration settle before we bring three.js in.
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  const showLive = ready && bigEnough && !reduceMotion;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: STILL_GRADIENT }}
    >
      {showLive && (
        <SceneErrorBoundary fallback={null}>
          <div className="absolute inset-0 animate-[fadein_1.2s_ease-out]">
            <FlowScene />
          </div>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
