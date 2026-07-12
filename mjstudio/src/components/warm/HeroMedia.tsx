"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The hero visual: a looping video, with a still image doing the actual work.
 *
 * The image is ALWAYS rendered and is what paints first — the video fades in on
 * top once it can play. That ordering matters: a 2.4MB video must never be the
 * thing a visitor waits for, and if it becomes the LCP element on a slow
 * connection the hero is effectively broken.
 *
 * The video is skipped entirely (poster only) when:
 *   - the visitor asks for reduced motion
 *   - the connection reports itself as slow / save-data is on
 * A silent autoplaying loop is a bandwidth tax nobody agreed to.
 */
export function HeroMedia({
  poster,
  posterAlt,
  video = "/hero.mp4",
}: {
  poster: string;
  posterAlt: string;
  video?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Respect Save-Data and slow connections — the still image is the whole
    // point of having a poster.
    const c = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const slow = c?.saveData === true || /2g/.test(c?.effectiveType ?? "");
    setAllowed(!slow);
  }, []);

  const showVideo = allowed && !reduceMotion;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-border shadow-[0_30px_60px_-30px_rgba(42,35,31,0.35)]">
      {/* Paints immediately. Stays underneath the video, so a failed or slow
          video never leaves a black rectangle. */}
      <Image
        src={poster}
        alt={posterAlt}
        fill
        priority
        sizes="(min-width: 1024px) 46vw, 100vw"
        className="object-cover"
      />

      {showVideo && (
        <video
          ref={ref}
          // muted + playsInline are both REQUIRED for autoplay to work at all
          // on iOS and in Chrome's autoplay policy.
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
