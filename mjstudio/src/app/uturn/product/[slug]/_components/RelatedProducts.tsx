"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "../products";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="relative py-20 md:py-28 border-t border-[var(--uturn-hairline)] bg-[var(--uturn-bg-deep)]">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between flex-wrap gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4 font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)]">
              <span className="w-8 h-px bg-[var(--uturn-accent)]" />
              Also in Release 04
            </div>
            <h2
              className="font-serif font-light italic leading-[0.95] tracking-[-0.015em] text-[var(--uturn-ink)]"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
            >
              The rest of the drop.
            </h2>
          </div>
          <Link
            href="/uturn#shop"
            className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-ink)] link-underline"
          >
            Back to the shop →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {products.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/uturn/product/${p.slug}`} className="group block">
                <div
                  className={`relative aspect-[4/5] overflow-hidden ${p.swatch}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,transparent_35%,rgba(15,14,12,0.5)_100%)] pointer-events-none" />
                  <div className="absolute top-5 left-5 font-mono text-[9px] uppercase tracking-[0.3em] text-[rgba(243,239,230,0.7)]">
                    {p.num}
                  </div>
                  <div className="absolute top-5 right-5 font-mono text-[9px] uppercase tracking-[0.3em] text-[rgba(243,239,230,0.55)]">
                    {p.category} · 04
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
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
                  <div className="shrink-0 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)] pt-2 group-hover:text-[var(--uturn-accent)] transition-colors">
                    View
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
