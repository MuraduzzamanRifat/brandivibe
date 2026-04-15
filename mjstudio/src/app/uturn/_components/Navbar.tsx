"use client";

import { motion } from "framer-motion";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import Link from "next/link";

const NAV = [
  { label: "Shop", href: "/uturn#shop" },
  { label: "Atelier", href: "/uturn#story" },
  { label: "Journal", href: "/uturn#journal" },
];

export function Navbar() {
  const { count, setBagOpen, setSearchOpen } = useCart();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 2.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[var(--uturn-bg)]/75 hairline-b"
    >
      <div className="mx-auto max-w-[1800px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-10">
        <div className="flex items-center gap-3">
          <Link
            href="/uturn"
            className="font-serif italic text-2xl md:text-3xl text-[var(--uturn-ink)] leading-none"
          >
            UTurn
          </Link>
          <span className="hidden md:inline font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] pl-3 border-l border-[var(--uturn-hairline)]">
            Store · Release 04
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--uturn-ink-muted)] hover:text-[var(--uturn-ink)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-[var(--uturn-ink-muted)]">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
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
            aria-label="Open bag"
            onClick={() => setBagOpen(true)}
            className="relative inline-flex items-center gap-2 hover:text-[var(--uturn-ink)] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Bag · {count}
            </span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[var(--uturn-accent)] text-[var(--uturn-bg)] font-mono text-[7px] flex items-center justify-center leading-none">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
