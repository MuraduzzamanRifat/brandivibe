"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, ArrowUpRight } from "lucide-react";
import type { Product } from "../products";

export function ProductInfo({ product }: { product: Product }) {
  const firstInStockVariant = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const firstInStockSize = product.sizes.find((s) => s.inStock) ?? product.sizes[0];
  const [variant, setVariant] = useState(firstInStockVariant.id);
  const [size, setSize] = useState(firstInStockSize.id);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function addToBag() {
    setAdding(true);
    await new Promise((r) => setTimeout(r, 600));
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="lg:sticky lg:top-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-5 font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)]">
          <span className="w-8 h-px bg-[var(--uturn-accent)]" />
          {product.category} · {product.num}
        </div>

        <h1
          className="font-serif font-light italic leading-[0.92] tracking-[-0.015em] text-[var(--uturn-ink)]"
          style={{ fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)" }}
        >
          {product.name}
        </h1>

        <div className="mt-6 flex items-baseline gap-4">
          <div className="font-serif italic text-3xl text-[var(--uturn-ink)]">
            {product.price}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--uturn-accent)]">
            · {product.status}
          </div>
        </div>

        <p className="mt-8 text-[var(--uturn-ink-muted)] font-light text-base md:text-lg leading-relaxed max-w-md">
          {product.shortDescription}
        </p>

        {/* Variants */}
        <div className="mt-10">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-4">
            Colour · {product.variants.find((v) => v.id === variant)?.label}
          </div>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v) => {
              const isActive = v.id === variant;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => v.inStock && setVariant(v.id)}
                  disabled={!v.inStock}
                  aria-label={v.label}
                  className={`relative w-14 h-14 rounded-sm overflow-hidden transition-all ${v.swatchClass} ${
                    isActive
                      ? "ring-1 ring-[var(--uturn-ink)] ring-offset-2 ring-offset-[var(--uturn-bg)]"
                      : "opacity-70 hover:opacity-100"
                  } ${!v.inStock ? "opacity-35 cursor-not-allowed" : ""}`}
                >
                  {!v.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(15,14,12,0.25)]">
                      <div className="w-10 h-px bg-[var(--uturn-bg)] rotate-45" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)]">
              Size
            </div>
            <button
              type="button"
              className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)] hover:text-[var(--uturn-accent)] transition-colors"
            >
              Size guide →
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.sizes.map((s) => {
              const isActive = s.id === size;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => s.inStock && setSize(s.id)}
                  disabled={!s.inStock}
                  className={`py-3 px-2 font-mono text-[10px] uppercase tracking-[0.2em] border transition-all ${
                    isActive
                      ? "border-[var(--uturn-ink)] text-[var(--uturn-ink)] bg-[var(--uturn-ink)]/5"
                      : "border-[var(--uturn-hairline)] text-[var(--uturn-ink-muted)] hover:border-[var(--uturn-ink)]/40"
                  } ${!s.inStock ? "opacity-35 cursor-not-allowed line-through" : ""}`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3">
          <button
            type="button"
            onClick={addToBag}
            disabled={adding}
            className="group relative w-full py-5 bg-[var(--uturn-ink)] text-[var(--uturn-bg)] font-mono text-[11px] uppercase tracking-[0.35em] overflow-hidden"
          >
            <span className="relative z-10">
              {adding ? "Adding…" : added ? "Added to bag ✓" : `Add to bag · ${product.price}`}
            </span>
            <div className="absolute inset-0 bg-[var(--uturn-accent)] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-400 ease-out" />
          </button>

          <button
            type="button"
            onClick={() => setWishlisted((w) => !w)}
            className="w-full py-5 border border-[var(--uturn-hairline)] font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--uturn-ink-muted)] hover:border-[var(--uturn-ink)] hover:text-[var(--uturn-ink)] transition-colors flex items-center justify-center gap-3"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                wishlisted ? "fill-[var(--uturn-accent)] text-[var(--uturn-accent)]" : ""
              }`}
            />
            {wishlisted ? "Saved" : "Save for later"}
          </button>
        </div>

        {/* Meta rows */}
        <div className="mt-12 grid grid-cols-2 gap-4 pt-8 border-t border-[var(--uturn-hairline)] font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)]">
          <div>
            <div className="mb-2">Made in</div>
            <div className="text-[var(--uturn-ink-muted)] normal-case tracking-normal text-xs">
              {product.madeIn}
            </div>
          </div>
          <div>
            <div className="mb-2">Delivery</div>
            <div className="text-[var(--uturn-ink-muted)] normal-case tracking-normal text-xs">
              Free worldwide · 48h
            </div>
          </div>
        </div>

        <a
          href="#story"
          className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--uturn-accent)] hover:text-[var(--uturn-ink)] transition-colors"
        >
          Read the story
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </motion.div>
    </div>
  );
}
