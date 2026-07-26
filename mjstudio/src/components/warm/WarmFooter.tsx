import Link from "next/link";
import { pillars } from "@/data/services";
import { CONTACT_EMAIL } from "@/lib/contact";
import { CookieChoices } from "@/components/CookieChoices";

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/industries", label: "Industries" },
  { href: "/portfolio", label: "Interactive Demos" },
  { href: "/journal", label: "Journal" },
  { href: "/glossary", label: "Glossary" },
  { href: "/contact", label: "Contact" },
];

export function WarmFooter() {
  return (
    <footer className="mt-10 bg-surface-2 border-t border-border">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-strong text-white font-display font-semibold text-lg leading-none">b</span>
              <span className="font-display text-[1.35rem] font-semibold tracking-tight">Brandivibe</span>
            </Link>
            <p className="mt-4 max-w-sm text-foreground/70 leading-relaxed">
              A friendly studio for websites, software, marketing, and AI — built with care, in a voice that sounds like you.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-flex items-center gap-2 text-primary-strong font-medium hover:text-primary-deep"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-4">What we do</h3>
            <ul className="space-y-2.5">
              {pillars.map((p) => (
                <li key={p.slug}>
                  <Link href={`/services#${p.slug}`} className="text-foreground/75 hover:text-foreground transition-colors">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-4">Studio</h3>
            <ul className="space-y-2.5">
              {COMPANY.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-foreground/75 hover:text-foreground transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-muted">
          <span>© {new Date().getFullYear()} Brandivibe. Made with care.</span>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-foreground">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-foreground">Refunds</Link>
            <CookieChoices />
          </div>
        </div>
      </div>
    </footer>
  );
}
