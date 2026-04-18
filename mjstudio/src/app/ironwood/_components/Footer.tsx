import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative px-6 md:px-10 pt-16 md:pt-24 pb-10 border-t border-[var(--ink)]/10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-8 mb-14">
          <div className="col-span-12 md:col-span-6">
            <div className="ironwood-display text-4xl md:text-6xl leading-[0.9] mb-6 text-balance">
              JOIN THE<br />WAITLIST.
            </div>
            <p className="text-[var(--ink)]/60 max-w-sm mb-6">
              Waitlist gets first access — 48 hours before the public drop.
              Drop 07 ships May 3.
            </p>
            <div className="flex items-center gap-0 border border-[var(--ink)]/20 max-w-md">
              <input
                type="email"
                placeholder="you@domain.com"
                className="flex-1 px-5 py-4 bg-transparent text-sm outline-none placeholder:text-[var(--mute)]"
              />
              <button className="px-6 py-4 bg-[var(--acid)] text-[var(--bg)] font-semibold font-mono text-[10px] uppercase tracking-[0.3em]">
                Join →
              </button>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)] mb-4">
              Drops
            </div>
            <ul className="space-y-2 text-sm text-[var(--ink)]/80">
              <li>Drop 07 · Spring</li>
              <li>Drop 06 · Winter (sold out)</li>
              <li>Drop 05 · Autumn (archive)</li>
              <li>All archives</li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)] mb-4">
              Ironwood
            </div>
            <ul className="space-y-2 text-sm text-[var(--ink)]/80">
              <li>About</li>
              <li>Journal</li>
              <li>Sizing</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--ink)]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">
          <div>© Ironwood · Built by Brandivibe</div>
          <Link href="/" className="hover:text-[var(--ink)]">← Back to Brandivibe</Link>
        </div>
      </div>
    </footer>
  );
}
