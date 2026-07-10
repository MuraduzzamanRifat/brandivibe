"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { PRIMARY_CTA } from "@/lib/cta";
import { accentInk } from "@/lib/accent";
import { pillars, getServicesByPillar } from "@/data/services";

const LINKS = [
  { href: "/case-studies", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
];

export function WarmNav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
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
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-xl bg-primary-strong text-white font-display font-semibold text-lg leading-none group-hover:rotate-6 transition-transform">b</span>
          <span className="font-display text-[1.35rem] font-semibold tracking-tight text-foreground">Brandivibe</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {/* Services — dropdown by pillar */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            // Keyboard access: open on focus-in, close when focus leaves the
            // group or on Escape — the menu was mouse-only before.
            onFocus={() => setServicesOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setServicesOpen(false);
            }}
          >
            <Link
              href="/services"
              className="flex items-center gap-1 px-3.5 py-2 rounded-full text-[0.95rem] text-foreground/75 hover:text-foreground hover:bg-[rgba(42,35,31,0.05)] transition-colors"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              Services
              <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </Link>
            {servicesOpen && (
              <div className="absolute left-0 top-full pt-3 w-[560px]">
                <div className="card-soft p-3 grid grid-cols-2 gap-1">
                  {pillars.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/services#${p.slug}`}
                      className="group flex items-start gap-3 rounded-2xl p-3 hover:bg-[rgba(42,35,31,0.04)] transition-colors"
                    >
                      <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl text-white font-display text-sm font-semibold shrink-0" style={{ background: accentInk(p.accent) }}>
                        {p.title.charAt(0)}
                      </span>
                      <span>
                        <span className="block font-medium text-foreground text-[0.95rem]">{p.title}</span>
                        <span className="block text-[0.8rem] text-muted leading-snug mt-0.5">
                          {getServicesByPillar(p.title).length} services
                        </span>
                      </span>
                    </Link>
                  ))}
                  <Link href="/services" className="col-span-2 mt-1 flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-sm font-medium text-primary-strong hover:bg-primary-soft transition-colors">
                    View all services →
                  </Link>
                </div>
              </div>
            )}
          </div>

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
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background min-h-[44px] px-4 py-2 text-[0.82rem] sm:px-5 sm:py-2.5 sm:text-[0.92rem] font-medium hover:bg-primary transition-colors"
          >
            {PRIMARY_CTA.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="warm-mobile-menu"
            className="md:hidden grid h-11 w-11 place-items-center rounded-full text-foreground hover:bg-[rgba(42,35,31,0.06)]"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="warm-mobile-menu" className="md:hidden fixed inset-0 top-[68px] z-40 bg-background overflow-y-auto">
          <nav className="flex flex-col px-6 py-8">
            <Link href="/services" onClick={() => setOpen(false)} className="py-4 text-2xl font-display font-medium text-foreground border-b border-border">
              Services
            </Link>
            <div className="grid grid-cols-2 gap-x-4 py-4 border-b border-border">
              {pillars.map((p) => (
                <Link key={p.slug} href={`/services#${p.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-2 py-3 text-foreground/75">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: p.accent }} />
                  <span className="text-sm">{p.title}</span>
                </Link>
              ))}
            </div>
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
              className="mt-6 inline-flex justify-center items-center rounded-full bg-primary-strong text-white px-6 py-4 text-lg font-medium"
            >
              {PRIMARY_CTA.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
