"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { PRIMARY_CTA } from "@/lib/cta";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
];

export function WarmNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[rgba(251,246,239,0.82)] backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 h-[68px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Brandivibe home">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white font-display font-semibold text-lg leading-none group-hover:rotate-6 transition-transform">b</span>
          <span className="font-display text-[1.35rem] font-semibold tracking-tight text-foreground">Brandivibe</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 rounded-full text-[0.95rem] text-foreground/75 hover:text-foreground hover:bg-[rgba(42,35,31,0.05)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={PRIMARY_CTA.href}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[0.92rem] font-medium hover:bg-primary transition-colors"
          >
            {PRIMARY_CTA.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="warm-mobile-menu"
            className="md:hidden grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-[rgba(42,35,31,0.06)]"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="warm-mobile-menu" className="md:hidden fixed inset-0 top-[68px] z-40 bg-background overflow-y-auto">
          <nav className="flex flex-col px-6 py-8 gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-4 text-2xl font-display font-medium text-foreground border-b border-border"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={PRIMARY_CTA.href}
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex justify-center items-center rounded-full bg-primary text-white px-6 py-4 text-lg font-medium"
            >
              {PRIMARY_CTA.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
