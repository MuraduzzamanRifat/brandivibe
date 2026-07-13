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
  const [wide, setWide] = useState(false);
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

  // Desktop only. The scrim's opaque region is sized for a ≤560px text column
  // in a wide container (~47%); on a phone the copy fills the width and would
  // spill onto the fading footage — dark ink on dark video. Below 768px the
  // hero falls back to the poster + ivory canvas + glows, all at full contrast.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const showVideo = allowed && wide && !reduceMotion;

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
          style={{
            /*
              The generator burns a watermark into the bottom-right pixels. CSS
              cannot erase it — only push it outside the frame. Scaling from the
              centre moves a corner mark from ~95% of the width out past 100%
              (0.5 + 0.45 × 1.22 = 1.05), so the container clips it.
              Re-exporting the video without the watermark is the real fix; this
              just costs a little of the edges.
            */
            transform: "scale(1.22)",
            transformOrigin: "center",
          }}
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
            Opaque only as far as the copy actually reaches, then it gets out of
            the way fast. The text column is capped at 560px of a 1200px
            container (≈47%), so the wash holds solid to 48% and is fully clear
            by 78% — the right third is untouched footage.

            The opaque region is non-negotiable, not a style choice: the copy is
            dark ink on a dark, MOVING image. Thin the wash under the text and
            contrast starts depending on which frame happens to be playing.
            Verified against a pure-black frame — ink 14.4:1, coral 4.7:1.
          */
          background:
            "linear-gradient(100deg, var(--background) 0%, var(--background) 48%, color-mix(in srgb, var(--background) 55%, transparent) 60%, color-mix(in srgb, var(--background) 18%, transparent) 70%, transparent 78%)",
        }}
      />
      {/* Short fades on the edges so the footage doesn't end on a hard line. */}
      <div
        className="absolute inset-x-0 bottom-0 h-28"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{
          background: "linear-gradient(to bottom, var(--background), transparent)",
        }}
      />
    </div>
  );
}
