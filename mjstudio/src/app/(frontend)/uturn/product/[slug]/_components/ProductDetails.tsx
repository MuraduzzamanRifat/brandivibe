"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { Product } from "../products";

type PanelKey = "story" | "materials" | "shipping" | "care";

export function ProductDetails({ product }: { product: Product }) {
  const [open, setOpen] = useState<PanelKey | null>("story");

  return (
    <section
      id="story"
      className="relative py-20 md:py-28 border-t border-[var(--uturn-hairline)]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <div className="flex items-center gap-3 mb-5 font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)]">
                <span className="w-8 h-px bg-[var(--uturn-accent)]" />
                Details
              </div>
              <h2
                className="font-serif font-light italic leading-[0.95] tracking-[-0.015em] text-[var(--uturn-ink)]"
                style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
              >
                Everything
                <br />
                worth knowing.
              </h2>
              <p className="mt-8 text-[var(--uturn-ink-muted)] font-light text-sm md:text-base leading-relaxed max-w-xs">
                Every piece we make tells a small story about where it came from and who made it. Open any panel.
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <Panel
              k="story"
              label="The story"
              open={open === "story"}
              onToggle={() => setOpen(open === "story" ? null : "story")}
            >
              <div className="space-y-5 text-[var(--uturn-ink-muted)] font-light text-base md:text-lg leading-relaxed">
                {product.longDescription.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Panel>

            <Panel
              k="materials"
              label="Materials & construction"
              open={open === "materials"}
              onToggle={() => setOpen(open === "materials" ? null : "materials")}
            >
              <dl className="divide-y divide-[var(--uturn-hairline)]">
                {product.materials.map((m) => (
                  <div
                    key={m.label}
                    className="grid grid-cols-12 gap-4 py-4"
                  >
                    <dt className="col-span-12 sm:col-span-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)]">
                      {m.label}
                    </dt>
                    <dd className="col-span-12 sm:col-span-8 text-[var(--uturn-ink)] font-light">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel
              k="shipping"
              label="Shipping & packaging"
              open={open === "shipping"}
              onToggle={() => setOpen(open === "shipping" ? null : "shipping")}
            >
              <ul className="space-y-3">
                {product.shipping.map((line, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 text-[var(--uturn-ink-muted)] font-light"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--uturn-accent)] shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel
              k="care"
              label="Care & forever repair"
              open={open === "care"}
              onToggle={() => setOpen(open === "care" ? null : "care")}
            >
              <ul className="space-y-3">
                {product.care.map((line, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 text-[var(--uturn-ink-muted)] font-light"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--uturn-accent)] shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({
  label,
  open,
  onToggle,
  children,
}: {
  k: PanelKey;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[var(--uturn-hairline)] last:border-b last:border-b-[var(--uturn-hairline)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-6 md:py-8 text-left group"
      >
        <span
          className={`font-serif leading-[1.05] transition-colors ${
            open ? "text-[var(--uturn-ink)]" : "text-[var(--uturn-ink-muted)]"
          }`}
          style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)" }}
        >
          {label}
        </span>
        <span
          className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
            open
              ? "border-[var(--uturn-accent)] text-[var(--uturn-accent)] bg-[var(--uturn-accent)]/5"
              : "border-[var(--uturn-hairline)] text-[var(--uturn-ink-muted)] group-hover:border-[var(--uturn-ink)] group-hover:text-[var(--uturn-ink)]"
          }`}
        >
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 md:pb-10 md:pl-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
