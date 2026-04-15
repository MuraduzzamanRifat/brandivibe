"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartContext";

export function BagDrawer() {
  const { items, bagOpen, setBagOpen, removeItem, updateQty, total, count } =
    useCart();

  return (
    <AnimatePresence>
      {bagOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setBagOpen(false)}
            className="fixed inset-0 z-[60] bg-[var(--uturn-ink)]/40 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-full max-w-[480px] bg-[var(--uturn-bg)] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-7 hairline-b">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[var(--uturn-ink)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-ink)]">
                  Your Bag
                </span>
                {count > 0 && (
                  <span className="font-mono text-[9px] text-[var(--uturn-accent)] tracking-[0.2em]">
                    · {count} {count === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setBagOpen(false)}
                aria-label="Close bag"
                className="w-9 h-9 rounded-full border border-[var(--uturn-hairline)] flex items-center justify-center text-[var(--uturn-ink-muted)] hover:border-[var(--uturn-ink)] hover:text-[var(--uturn-ink)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
                  <div className="w-14 h-14 rounded-full border border-[var(--uturn-hairline)] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[var(--uturn-ink-soft)]" />
                  </div>
                  <div>
                    <p className="font-serif italic text-2xl text-[var(--uturn-ink)] mb-2">
                      Your bag is empty.
                    </p>
                    <p className="font-light text-sm text-[var(--uturn-ink-muted)]">
                      Add something slow and considered.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBagOpen(false)}
                    className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-accent)] hover:text-[var(--uturn-ink)] transition-colors"
                  >
                    Continue browsing →
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--uturn-hairline)]">
                  {items.map((item) => (
                    <li
                      key={`${item.slug}-${item.variant}-${item.size}`}
                      className="flex gap-5 px-8 py-6"
                    >
                      {/* Swatch preview */}
                      <div
                        className={`shrink-0 w-20 h-24 rounded-sm ${item.swatch}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3 className="font-serif text-lg leading-tight text-[var(--uturn-ink)]">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.slug, item.variant, item.size)
                            }
                            aria-label="Remove"
                            className="shrink-0 text-[var(--uturn-ink-soft)] hover:text-[var(--uturn-ink)] transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)] mb-1">
                          {item.variantLabel} · {item.size}
                        </div>
                        <div className="font-serif italic text-xl text-[var(--uturn-ink)] mb-4">
                          {item.price}
                        </div>
                        {/* Qty */}
                        <div className="inline-flex items-center gap-3 border border-[var(--uturn-hairline)] px-3 py-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(
                                item.slug,
                                item.variant,
                                item.size,
                                item.qty - 1
                              )
                            }
                            aria-label="Decrease"
                            className="text-[var(--uturn-ink-muted)] hover:text-[var(--uturn-ink)] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--uturn-ink)] w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(
                                item.slug,
                                item.variant,
                                item.size,
                                item.qty + 1
                              )
                            }
                            aria-label="Increase"
                            className="text-[var(--uturn-ink-muted)] hover:text-[var(--uturn-ink)] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-7 hairline-t space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)]">
                    Subtotal
                  </span>
                  <span className="font-serif italic text-2xl text-[var(--uturn-ink)]">
                    €{total.toLocaleString()}
                  </span>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)]">
                  Free worldwide shipping · taxes at checkout
                </p>
                <Link
                  href="/uturn/checkout"
                  onClick={() => setBagOpen(false)}
                  className="group relative block w-full py-4 bg-[var(--uturn-ink)] text-[var(--uturn-bg)] font-mono text-[11px] uppercase tracking-[0.35em] text-center overflow-hidden"
                >
                  <span className="relative z-10">Proceed to checkout</span>
                  <div className="absolute inset-0 bg-[var(--uturn-accent)] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                </Link>
                <button
                  type="button"
                  onClick={() => setBagOpen(false)}
                  className="w-full py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--uturn-ink-muted)] hover:text-[var(--uturn-ink)] transition-colors"
                >
                  Continue browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
