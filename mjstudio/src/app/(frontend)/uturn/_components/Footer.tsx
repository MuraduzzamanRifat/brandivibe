"use client";

import Link from "next/link";

const COLUMNS = [
  {
    label: "Shop",
    items: [
      { label: "Outerwear", href: "/uturn/product/ishi-overshirt" },
      { label: "Leather", href: "/uturn/product/atelier-bag-no-7" },
      { label: "Objects", href: "/uturn/product/midnight-object" },
      { label: "Archive", href: "/uturn#shop" },
      { label: "Gift cards", href: "/uturn#shop" },
    ],
  },
  {
    label: "Atelier",
    items: [
      { label: "The practice", href: "/uturn#story" },
      { label: "Repairs forever", href: "/uturn#story" },
      { label: "Members", href: "/uturn" },
      { label: "Press", href: "mailto:press@uturn.co" },
      { label: "Journal", href: "/uturn#story" },
    ],
  },
  {
    label: "Help",
    items: [
      { label: "Shipping", href: "/uturn/product/ishi-overshirt#story" },
      { label: "Returns", href: "/uturn/product/ishi-overshirt#story" },
      { label: "Size guide", href: "/uturn/product/ishi-overshirt#story" },
      { label: "Care", href: "/uturn/product/ishi-overshirt#story" },
      { label: "Contact", href: "mailto:hello@uturn.co" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--uturn-hairline)] bg-[var(--uturn-bg)]">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10 py-20 md:py-24">
        <div className="grid grid-cols-12 gap-10 md:gap-6 pb-16 border-b border-[var(--uturn-hairline)]">
          <div className="col-span-12 md:col-span-5">
            <Link
              href="/uturn"
              className="font-serif italic text-[var(--uturn-ink)] leading-[0.9]"
              style={{ fontSize: "clamp(3.5rem, 7vw, 8rem)" }}
            >
              UTurn
            </Link>
            <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--uturn-ink-soft)]">
              Capsule atelier · est. 2019 · Lisbon / Kyoto
            </div>
            <p className="mt-8 text-[var(--uturn-ink-muted)] font-light text-sm md:text-base leading-relaxed max-w-sm">
              Four small releases a year, made by six people we know by name.
              When a piece sells out, it goes into the archive. You can still
              get it fixed, forever.
            </p>
          </div>

          <div className="col-span-12 md:col-span-7 grid grid-cols-3 gap-6 md:gap-10">
            {COLUMNS.map((col) => (
              <div key={col.label}>
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-5">
                  {col.label}
                </div>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-serif text-[var(--uturn-ink)] text-base md:text-lg hover:text-[var(--uturn-accent)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-10 flex items-start justify-between flex-wrap gap-6">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)]">
            © MMXXVI UTurn Store · A capsule atelier
            <br />
            <span className="text-[var(--uturn-ink-muted)]">
              A Brandivibe demo · all content is illustrative
            </span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] flex gap-6">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--uturn-ink)] transition-colors"
            >
              Instagram
            </a>
            <Link href="/uturn" className="hover:text-[var(--uturn-ink)] transition-colors">
              Newsletter
            </Link>
            <Link href="/uturn" className="hover:text-[var(--uturn-ink)] transition-colors">
              Privacy
            </Link>
            <Link href="/uturn" className="hover:text-[var(--uturn-ink)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
