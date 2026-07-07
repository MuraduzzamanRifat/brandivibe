"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&dpr=2`;

type Product = {
  slug: string;
  num: string;
  name: string;
  category: string;
  price: string;
  status: string;
  swatch: string;
  heroImage: string;
};

const PRODUCTS: Product[] = [
  {
    slug: "ishi-overshirt",
    num: "001",
    name: "Ishi Overshirt",
    category: "Outerwear · 04",
    price: "€720",
    status: "12 of 50 left",
    swatch: "swatch-slate",
    heroImage: PX(2220316),
  },
  {
    slug: "atelier-bag-no-7",
    num: "002",
    name: "Atelier Bag No. 7",
    category: "Leather · 04",
    price: "€880",
    status: "Made to order",
    swatch: "swatch-warm-clay",
    heroImage: PX(1152077),
  },
  {
    slug: "midnight-object",
    num: "003",
    name: "Midnight Object",
    category: "Objects · 04",
    price: "€140",
    status: "In stock",
    swatch: "swatch-deep-plum",
    heroImage: PX(1037995),
  },
  {
    slug: "faro-coat",
    num: "004",
    name: "Faro Coat",
    category: "Outerwear · 04",
    price: "€1,480",
    status: "8 of 30 left",
    swatch: "swatch-forest",
    heroImage: PX(996329),
  },
];

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
              Four from the release.
            </h2>
          </div>
          <a
            href="#shop"
            className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-ink)] link-underline"
          >
            See all of 04 →
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 1,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/uturn/product/${p.slug}`} className="group flex flex-col">
                <div className={`relative aspect-[4/5] overflow-hidden ${p.swatch}`}>
                  {/* Pexels photo */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${p.heroImage})` }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,transparent_35%,rgba(15,14,12,0.55)_100%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,14,12,0.6)] via-transparent to-transparent pointer-events-none" />

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
                    style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)" }}
                  >
                    {p.name}
                  </h3>
                  <div className="shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)] pt-2 group-hover:text-[var(--uturn-accent)] transition-colors">
                    View →
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
