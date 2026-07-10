import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative px-6 md:px-10 pt-16 md:pt-24 pb-10 bg-[var(--forest)] text-[var(--cream)]">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-8 mb-14">
          <div className="col-span-12 md:col-span-6">
            <div className="terroir-serif italic text-4xl md:text-6xl leading-[0.95] mb-6 text-balance">
              The next rotation ships June 1.
            </div>
            <p className="text-[var(--cream)]/70 max-w-md mb-6">
              Join the newsletter for origin previews, farmer updates, and priority access to rare micro-lots.
            </p>
            <div className="flex items-center gap-0 border border-[var(--cream)]/30 max-w-md rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="you@domain.com"
                className="flex-1 px-5 py-4 bg-transparent text-sm outline-none placeholder:text-[var(--cream)]/40"
              />
              <button className="px-6 py-4 bg-[var(--clay)] text-[var(--cream)] font-medium text-sm hover:bg-[var(--clay)]/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--cream)]/50 mb-4">
              Shop
            </div>
            <ul className="space-y-2 text-sm text-[var(--cream)]/85">
              <li>This season</li>
              <li>Subscriptions</li>
              <li>Brewing kit</li>
              <li>Archive</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--cream)]/50 mb-4">
              Terroir
            </div>
            <ul className="space-y-2 text-sm text-[var(--cream)]/85">
              <li>Our farms</li>
              <li>Journal</li>
              <li>Brewing guides</li>
              <li>Wholesale</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--cream)]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--cream)]/50">
          <div>© Terroir · Built by Brandivibe</div>
          <Link href="/" className="hover:text-[var(--cream)]">← Back to Brandivibe</Link>
        </div>
      </div>
    </footer>
  );
}
