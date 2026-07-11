"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";

/**
 * A live WebGL object on the page that sells WebGL.
 *
 * The page advertising our signature 3D craft previously contained no 3D at
 * all. This is the product demo, not decoration — which is the only thing that
 * justifies shipping ~500KB of three.js to a marketing page.
 *
 * It therefore pays for itself only when it can:
 *   - stay out of the initial bundle      -> dynamic import, ssr: false
 *   - stay off the page until it is seen  -> IntersectionObserver, mount on view
 *   - never fight a phone for the scroll  -> drag only on fine pointers
 *   - never move for someone who asked it not to -> prefers-reduced-motion
 *   - never take the route down with it   -> SceneErrorBoundary
 *
 * Every one of those failing gives the static fallback, which is a real
 * rendering of the brand gradient rather than an apology.
 */

const Scene = dynamic(() => import("./WebglShowcaseScene"), {
  ssr: false,
  loading: () => <SceneSkeleton label="Loading the 3D scene…" />,
});

function SceneSkeleton({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
    </div>
  );
}

/** What a visitor sees with reduced motion, no WebGL, or a crashed scene. */
function StaticFallback({ accent }: { accent: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at 50% 45%, ${accent}55, transparent 62%)`,
      }}
    />
  );
}

export function WebglShowcase({ accent }: { accent: string }) {
  const reduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [canDrag, setCanDrag] = useState(false);

  useEffect(() => {
    // Drag-to-rotate only where a pointer exists. On touch, OrbitControls would
    // swallow the swipe and the visitor could not scroll past this section.
    setCanDrag(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Unmounting when it scrolls away stops the render loop entirely, rather
  // than leaving a hidden canvas burning frames and battery.
  const show = inView && !reduceMotion;

  return (
    <figure className="mx-auto max-w-[1200px] px-5 sm:px-8">
      <div
        ref={hostRef}
        role="img"
        aria-label="An interactive 3D object rendering live in your browser, showing the kind of WebGL work we build."
        className="relative h-[380px] overflow-hidden rounded-[28px] border border-border bg-surface-2 md:h-[480px]"
      >
        <StaticFallback accent={accent} />
        {show && (
          <SceneErrorBoundary fallback={<StaticFallback accent={accent} />}>
            <Scene accent={accent} interactive={canDrag} />
          </SceneErrorBoundary>
        )}
      </div>
      <figcaption className="mt-3 text-center font-mono text-xs uppercase tracking-[0.14em] text-muted">
        {reduceMotion
          ? "Animation paused — your system asks for reduced motion"
          : canDrag
            ? "Running live in your browser · drag to rotate · no plugin, no app"
            : "Running live in your browser · no plugin, no app"}
      </figcaption>
    </figure>
  );
}
