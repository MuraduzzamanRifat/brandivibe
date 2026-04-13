"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  rootMargin?: string;
  /** Pause when scrolled out of viewport. Default true. */
  pauseOffscreen?: boolean;
};

/**
 * Lazy-loaded background video.
 *
 * - Defers src assignment until the element is within `rootMargin` of the viewport.
 * - Pauses playback when scrolled out of viewport to conserve decoder resources
 *   (modern browsers do this for muted autoplay videos, but we enforce it explicitly).
 * - Respects `prefers-reduced-motion`: the video never loads.
 */
export function LazyVideo({
  src,
  poster,
  className,
  rootMargin = "400px 0px",
  pauseOffscreen = true,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            setLoaded(true);
          }
          // try to play when becoming visible
          el.play().catch(() => {});
        } else if (pauseOffscreen) {
          el.pause();
        }
      },
      { rootMargin, threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loaded, reduced, rootMargin, pauseOffscreen]);

  // With reduced motion, show the poster as a static image fallback
  if (reduced) {
    if (!poster) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt=""
        aria-hidden
        className={className}
      />
    );
  }

  return (
    <video
      ref={ref}
      src={loaded ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={loaded}
      preload="none"
      aria-hidden
      className={className}
    />
  );
}
