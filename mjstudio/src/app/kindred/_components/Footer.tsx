import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative px-6 md:px-10 pt-16 md:pt-24 pb-10 bg-[var(--ink)] text-[var(--cream)]">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 md:col-span-6">
            <div className="text-5xl md:text-7xl kindred-serif leading-[0.95] mb-8 text-balance">
              Begin your<br />ritual tonight.
            </div>
            <Link
              href="#products"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--cream)] text-[var(--ink)] font-medium text-sm hover:bg-[var(--cream)]/90 transition-colors"
            >
              Shop the full ritual — $228 →
            </Link>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--cream)]/40 mb-4">
              Shop
            </div>
            <ul className="space-y-2 text-sm text-[var(--cream)]/80">
              <li>Full ritual</li>
              <li>À la carte</li>
              <li>Subscription</li>
              <li>Gift box</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--cream)]/40 mb-4">
              Kindred
            </div>
            <ul className="space-y-2 text-sm text-[var(--cream)]/80">
              <li>Our formulation</li>
              <li>Farm sourcing</li>
              <li>Journal</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--cream)]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--cream)]/40">
          <div>© Kindred · Built by Brandivibe</div>
          <Link href="/" className="hover:text-[var(--cream)]">← Back to Brandivibe</Link>
        </div>
      </div>
    </footer>
  );
}
