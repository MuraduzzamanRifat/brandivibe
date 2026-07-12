"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The hero's full-bleed background video.
 *
 * The video is DARK and the hero copy is dark ink, so it cannot simply sit
 * behind the text — that is an unreadable contrast failure. A warm scrim solves
 * it: opaque ivory under the words, fading out to the right so the footage
 * still breathes. Text keeps its WCAG contrast against a known solid colour
 * rather than against whatever frame happens to be playing.
 *
 * Nothing here is load-bearing for first paint. The scrim + page background are
 * plain CSS, so the hero looks correct before a single byte of video arrives —
 * and stays correct if it never does:
 *   - reduced motion  -> no video
 *   - save-data / 2g  -> no video
 *   - decode failure  -> no video, and nobody notices
 */
export function HeroMedia({
  video = "/hero.mp4",
  poster,
}: {
  video?: string;
  /** Shown while the video buffers. Swap it from Admin → Media (`homepage-hero`). */
  poster?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {showVideo && (
        <video
          // muted + playsInline are both REQUIRED or iOS and Chrome's autoplay
          // policy refuse to start it at all.
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      {/*
        The scrim. Two layers:
        1. a horizontal wash — solid canvas under the copy, clearing to the right
        2. a vertical fade — hands off cleanly to the section below
        Values are deliberately generous: the text must never depend on which
        frame of the video is on screen.
      */}
      <div
        className="absolute inset-0"
        style={{
          /*
            Stays FULLY opaque to 56%, which is past the right edge of the copy
            (capped at 640px of a 1200px container ≈ 53%). Verified against a
            pure-black video: ink lands at 14.4:1 and coral at 4.7:1 there.
            An earlier fade put coral at 3.6:1 — a real WCAG failure, since the
            text would otherwise be sitting on whatever frame happened to play.
          */
          background:
            "linear-gradient(100deg, var(--background) 0%, var(--background) 56%, color-mix(in srgb, var(--background) 72%, transparent) 68%, color-mix(in srgb, var(--background) 34%, transparent) 84%, color-mix(in srgb, var(--background) 12%, transparent) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />
    </div>
  );
}
