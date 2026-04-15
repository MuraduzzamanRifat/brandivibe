"use client";

import { motion } from "framer-motion";

type Product = {
  num: string;
  name: string;
  category: string;
  price: string;
  status: string;
  swatch: string;
};

const PRODUCTS: Product[] = [
  {
    num: "001",
    name: "Ishi Overshirt",
    category: "Outerwear · 04",
    price: "€720",
    status: "12 of 50 left",
    swatch: "swatch-slate",
  },
  {
    num: "002",
    name: "Atelier Bag No. 7",
    category: "Leather · 04",
    price: "€880",
    status: "Made to order",
    swatch: "swatch-warm-clay",
  },
  {
    num: "003",
    name: "Midnight Object",
    category: "Objects · 04",
    price: "€140",
    status: "In stock",
    swatch: "swatch-deep-plum",
  },
];

/**
 * Section 6 — Featured / curated portfolio. Three products, editorial grid,
 * no reviews row or "you may also like". Prices are visible because this is
 * ecommerce, but each card reads like a magazine plate, not a product tile.
 */
export function Featured() {
  return (
    <section
      id="featured"
      className="relative py-24 md:py-32 border-t border-[var(--uturn-hairline)] bg-[var(--uturn-bg-deep)]"
    >
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between flex-wrap gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-ink-soft)]">
              <span className="w-8 h-px bg-[var(--uturn-accent)]" />
              Featured · 006
            </div>
            <h2
              className="font-serif font-light tracking-[-0.015em] leading-[0.92] text-[var(--uturn-ink)]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 5rem)" }}
            >
              Three from the release.
            </h2>
          </div>
          <a
            href="#shop"
            className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-ink)] link-underline"
          >
            See all of 04 →
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {PRODUCTS.map((p, i) => (
            <motion.a
              key={p.num}
              href="#"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 1,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex flex-col"
            >
              <div
                className={`relative aspect-[4/5] overflow-hidden ${p.swatch}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,transparent_35%,rgba(15,14,12,0.5)_100%)] pointer-events-none" />
                <div className="absolute top-5 left-5 font-mono text-[9px] uppercase tracking-[0.3em] text-[rgba(243,239,230,0.7)]">
                  {p.num}
                </div>
                <div className="absolute top-5 right-5 font-mono text-[9px] uppercase tracking-[0.3em] text-[rgba(243,239,230,0.55)]">
                  {p.category}
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[rgba(243,239,230,0.55)]">
                    {p.status}
                  </div>
                  <div className="font-serif italic text-[var(--uturn-bg)] text-3xl group-hover:text-[var(--uturn-accent-warm)] transition-colors duration-500">
                    {p.price}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <h3
                  className="font-serif leading-[1.05] text-[var(--uturn-ink)]"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
                >
                  {p.name}
                </h3>
                <div className="shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)] pt-2">
                  View →
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
