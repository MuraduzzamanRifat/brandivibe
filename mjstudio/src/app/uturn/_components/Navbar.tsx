"use client";

import { motion } from "framer-motion";
import { Search, User, ShoppingBag } from "lucide-react";

const NAV = [
  { label: "Shop", href: "#shop" },
  { label: "Collections", href: "#collections" },
  { label: "Atelier", href: "#story" },
  { label: "Journal", href: "#journal" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 2.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[var(--uturn-bg)]/75 hairline-b"
    >
      <div className="mx-auto max-w-[1800px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-10">
        <div className="flex items-center gap-3">
          <a
            href="/uturn"
            className="font-serif italic text-2xl md:text-3xl text-[var(--uturn-ink)] leading-none"
          >
            UTurn
          </a>
          <span className="hidden md:inline font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] pl-3 border-l border-[var(--uturn-hairline)]">
            Store · Release 04
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--uturn-ink-muted)] hover:text-[var(--uturn-ink)] transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-[var(--uturn-ink-muted)]">
          <button
            type="button"
            aria-label="Search"
            className="hidden md:inline-flex hover:text-[var(--uturn-ink)] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="hidden md:inline-flex hover:text-[var(--uturn-ink)] transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Bag"
            className="relative inline-flex items-center gap-2 hover:text-[var(--uturn-ink)] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Bag · 0
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
