"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=1060&dpr=2`;

type Category = {
  num: string;
  name: string;
  count: string;
  hint: string;
  swatch: string;
  image: string;
  href: string;
};

const CATEGORIES: Category[] = [
  {
    num: "01",
    name: "Outerwear",
    count: "12 pieces",
    hint: "coats, overshirts, workwear",
    swatch: "swatch-slate",
    image: PX(2220316),
    href: "/uturn/product/ishi-overshirt",
  },
  {
    num: "02",
    name: "Leather",
    count: "8 pieces",
    hint: "bags, belts, small goods",
    swatch: "swatch-warm-clay",
    image: PX(1152077),
    href: "/uturn/product/atelier-bag-no-7",
  },
  {
    num: "03",
    name: "Objects",
    count: "14 pieces",
    hint: "for the desk and the hand",
    swatch: "swatch-sand",
    image: PX(1037995),
    href: "/uturn/product/midnight-object",
  },
  {
    num: "04",
    name: "Archive",
    count: "member access",
    hint: "past releases, rewrought",
    swatch: "swatch-forest",
    image: PX(996329),
    href: "/uturn#featured",
  },
];

export function Categories() {
  return (
    <section
      id="shop"
      className="relative py-24 md:py-32 px-6 md:px-10 border-t border-[var(--uturn-hairline)]"
    >
      <div className="mx-auto max-w-[1800px]">
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
              The shop · 002
            </div>
            <h2
              className="font-serif font-light tracking-[-0.015em] leading-[0.92] text-[var(--uturn-ink)] max-w-2xl"
              style={{ fontSize: "clamp(2.25rem, 5vw, 5rem)" }}
            >
              Choose a lane.
              <br />
              <span className="italic text-[var(--uturn-ink-muted)]">We&apos;ll take it from there.</span>
            </h2>
          </div>
          <div className="text-right font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)] max-w-[18rem]">
            Four categories.
            <br />
            One release at a time.
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={c.href} className="group relative flex flex-col">
                <div className={`relative aspect-[3/4] overflow-hidden ${c.swatch}`}>
                  {/* Pexels photo */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${c.image})` }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,transparent_30%,rgba(15,14,12,0.6)_100%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,14,12,0.7)] via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-5 left-5 font-mono text-[9px] uppercase tracking-[0.3em] text-[rgba(243,239,230,0.7)]">
                    {c.num} / 04
                  </div>
                  <div className="absolute top-5 right-5 text-[rgba(243,239,230,0.7)] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[rgba(243,239,230,0.55)]">
                      {c.count}
                    </div>
                    <div
                      className="mt-1 font-serif text-[var(--uturn-bg)] leading-[0.95]"
                      style={{ fontSize: "clamp(2rem, 3.2vw, 3rem)" }}
                    >
                      {c.name}
                    </div>
                  </div>
                </div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--uturn-ink-muted)] group-hover:text-[var(--uturn-accent)] transition-colors">
                  {c.hint}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
