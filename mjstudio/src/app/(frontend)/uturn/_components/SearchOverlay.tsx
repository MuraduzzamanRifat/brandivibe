"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Ishi Overshirt", href: "/uturn/product/ishi-overshirt", tag: "Outerwear" },
  { label: "Atelier Bag No. 7", href: "/uturn/product/atelier-bag-no-7", tag: "Leather" },
  { label: "Midnight Object", href: "/uturn/product/midnight-object", tag: "Objects" },
  { label: "Faro Coat", href: "/uturn/product/faro-coat", tag: "Outerwear" },
];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useCart();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = query.trim()
    ? QUICK_LINKS.filter(
        (l) =>
          l.label.toLowerCase().includes(query.toLowerCase()) ||
          l.tag.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          key="search"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-[var(--uturn-bg)]/97 backdrop-blur-md flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 md:px-10 h-16 md:h-20 hairline-b">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-[var(--uturn-ink-soft)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)]">
                Search UTurn
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="w-9 h-9 rounded-full border border-[var(--uturn-hairline)] flex items-center justify-center text-[var(--uturn-ink-muted)] hover:border-[var(--uturn-ink)] hover:text-[var(--uturn-ink)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Input */}
          <div className="px-6 md:px-10 pt-12 pb-8 hairline-b">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, materials, or categories…"
              className="w-full bg-transparent outline-none font-serif font-light italic text-[var(--uturn-ink)] placeholder:text-[var(--uturn-ink-soft)]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}
            />
          </div>

          {/* Results / quick links */}
          <div className="flex-1 overflow-y-auto px-6 md:px-10 pt-10">
            {query.trim() === "" ? (
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-ink-soft)] mb-6">
                  All products
                </div>
                <ul className="space-y-0 divide-y divide-[var(--uturn-hairline)]">
                  {QUICK_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between py-5 group"
                      >
                        <span className="font-serif text-2xl md:text-3xl text-[var(--uturn-ink)] group-hover:text-[var(--uturn-accent)] transition-colors">
                          {l.label}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)]">
                          {l.tag}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-ink-soft)] mb-6">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </div>
                <ul className="space-y-0 divide-y divide-[var(--uturn-hairline)]">
                  {results.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between py-5 group"
                      >
                        <span className="font-serif text-2xl md:text-3xl text-[var(--uturn-ink)] group-hover:text-[var(--uturn-accent)] transition-colors">
                          {l.label}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)]">
                          {l.tag}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-serif italic text-2xl text-[var(--uturn-ink-muted)]">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)]">
                  Try a product name or material
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
