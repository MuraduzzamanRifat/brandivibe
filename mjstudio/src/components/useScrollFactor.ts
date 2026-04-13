"use client";

import { useRef, useEffect } from "react";

/**
 * Returns a ref whose .current is a [0, 1] clamp of
 * min(1, window.scrollY / rangePx).
 *
 * Designed to be read from inside R3F useFrame without subscribing the
 * component to scroll events (avoids re-renders at 60fps). Pass the ref
 * down to scene components and read `ref.current` inside useFrame.
 *
 * Set `rangePx` to the amount of scroll distance that should animate the
 * scene from 0 to 1 (e.g. 900 ≈ one viewport).
 */
export function useScrollFactor(rangePx = 900) {
  const factor = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      factor.current = Math.max(0, Math.min(1, window.scrollY / rangePx));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [rangePx]);

  return factor;
}
