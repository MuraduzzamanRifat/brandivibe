"use client";

import { useMemo } from "react";

/**
 * CSS-only ember particles drifting upward — a cheap atmospheric layer
 * that runs even when the WebGL scene is suppressed (reduced motion).
 * Positions/timings are seeded once so SSR and client render the same.
 */
export function EmberField({ count = 28 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // deterministic pseudo-random from index
        const r = (n: number) => {
          const x = Math.sin(i * 9973 + n * 131) * 10000;
          return x - Math.floor(x);
        };
        return {
          left: `${r(1) * 100}%`,
          bottom: `${r(2) * 40}%`,
          delay: `${r(3) * 8}s`,
          duration: `${5 + r(4) * 7}s`,
          scale: 0.6 + r(5) * 1.2,
        };
      }),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="ember-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  );
}
