"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "../../../_components/CartContext";

const STEPS = [
  {
    num: "01",
    title: "Confirmation email",
    body: "A receipt and order details are on their way to your inbox.",
    when: "Now",
  },
  {
    num: "02",
    title: "It enters the atelier",
    body: "Your piece is pulled from the current run and assigned to a maker by name.",
    when: "Within 24 hours",
  },
  {
    num: "03",
    title: "Dispatch",
    body: "Packed in FSC-certified kraft with a signed card from the person who made it.",
    when: "3–5 working days",
  },
  {
    num: "04",
    title: "Delivery",
    body: "Worldwide express. 48h in Europe, 72h everywhere else.",
    when: "48–72h after dispatch",
  },
];

export function OrderSuccess() {
  const { items, total, setBagOpen } = useCart();
  const cleared = useRef(false);
  const [orderNum, setOrderNum] = useState("UT-04-……");

  useEffect(() => {
    setOrderNum(`UT-04-${Math.floor(10000 + Math.random() * 90000)}`);
  }, []);

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      setBagOpen(false);
    }
  }, [setBagOpen]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-16 md:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[var(--uturn-accent)] mb-8">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="var(--uturn-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path d="M4 10l4 4 8-8" />
          </motion.svg>
        </div>

        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-accent)] mb-4">
          Order confirmed · {orderNum}
        </div>

        <h1
          className="font-serif font-light italic leading-[0.92] tracking-[-0.015em] text-[var(--uturn-ink)] mb-6"
          style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
        >
          It&apos;s on its way
          <br />
          to the atelier.
        </h1>

        <p className="text-[var(--uturn-ink-muted)] font-light text-base md:text-lg leading-relaxed max-w-md mx-auto">
          Your order has been received. Someone will pack it by hand, write a
          short note, and send it to you as soon as it&apos;s ready.
        </p>
      </motion.div>

      {/* What happens next */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mb-20"
      >
        <div className="flex items-center gap-3 mb-10">
          <span className="w-8 h-px bg-[var(--uturn-accent)]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-ink-soft)]">
            What happens next
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--uturn-hairline)]">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[var(--uturn-bg)] p-8"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-accent)] mb-4">
                {step.num}
              </div>
              <h3 className="font-serif text-lg text-[var(--uturn-ink)] mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="font-light text-sm text-[var(--uturn-ink-muted)] leading-relaxed mb-6">
                {step.body}
              </p>
              <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)]">
                {step.when}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Order summary */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-20 pt-10 border-t border-[var(--uturn-hairline)]"
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)] mb-8">
            Your order
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.slug}-${item.variant}-${item.size}`}
                className="flex items-center gap-6 py-4 border-b border-[var(--uturn-hairline)]"
              >
                <div className={`shrink-0 w-14 h-18 rounded-sm ${item.swatch}`} style={{ height: "4.5rem" }} />
                <div className="flex-1">
                  <div className="font-serif text-lg text-[var(--uturn-ink)]">{item.name}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)] mt-1">
                    {item.variantLabel} · {item.size}
                    {item.qty > 1 && ` · ×${item.qty}`}
                  </div>
                </div>
                <div className="font-serif italic text-xl text-[var(--uturn-ink)]">{item.price}</div>
              </div>
            ))}
          </div>
          <div className="flex items-baseline justify-end gap-6 mt-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)]">
              Total paid
            </span>
            <span className="font-serif italic text-3xl text-[var(--uturn-ink)]">
              €{Math.round(total * 1.2).toLocaleString()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Footer CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="flex flex-wrap items-center justify-center gap-6"
      >
        <Link
          href="/uturn"
          className="group relative py-4 px-10 bg-[var(--uturn-ink)] text-[var(--uturn-bg)] font-mono text-[11px] uppercase tracking-[0.35em] overflow-hidden"
        >
          <span className="relative z-10">Continue shopping</span>
          <div className="absolute inset-0 bg-[var(--uturn-accent)] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
        </Link>
        <Link
          href="/uturn#story"
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-ink-muted)] hover:text-[var(--uturn-ink)] transition-colors"
        >
          Read the atelier story →
        </Link>
      </motion.div>
    </div>
  );
}
