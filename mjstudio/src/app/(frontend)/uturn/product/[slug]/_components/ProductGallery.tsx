"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Product } from "../products";

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = product.media[activeIndex];

  return (
    <div className="flex flex-col gap-5">
      {/* Main viewport */}
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-sm ${product.swatch}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {active.type === "video" ? (
              <video
                key={active.src}
                src={active.src}
                poster={active.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${active.src})` }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_50%,transparent_45%,rgba(15,14,12,0.35)_100%)] pointer-events-none" />

        {/* corner readouts */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-[rgba(243,239,230,0.7)] pointer-events-none">
          <span>Release 04 · {product.num}</span>
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {String(product.media.length).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[0.3em] text-[rgba(243,239,230,0.55)] pointer-events-none">
          {active.label}
        </div>
      </div>

      {/* Thumb strip */}
      <div className="grid grid-cols-4 gap-3">
        {product.media.map((m, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={m.src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Show ${m.label}`}
              className={`group relative aspect-[3/4] overflow-hidden rounded-sm ${
                product.swatch
              } transition-all ${
                isActive
                  ? "ring-1 ring-[var(--uturn-ink)] ring-offset-2 ring-offset-[var(--uturn-bg)]"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              {m.poster ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${m.poster})` }}
                />
              ) : null}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,transparent_40%,rgba(15,14,12,0.4)_100%)]" />
              <div className="absolute bottom-2 left-2 right-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[rgba(243,239,230,0.7)] text-left">
                {String(i + 1).padStart(2, "0")}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tiny hint */}
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] text-center">
        Four angles · drop Pexels videos into /uturn/stock/{product.slug}/
      </div>
    </div>
  );
}
