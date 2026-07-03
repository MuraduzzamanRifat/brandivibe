import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRIMARY_CTA, SECONDARY_CTA, CTA_REASSURANCE } from "@/lib/cta";

/**
 * Standardized CTA surfaces used across every page so the primary/secondary
 * actions, labels, and destinations are identical everywhere.
 *   <CtaBand>   — the closing conversion band (colored).
 *   <CtaInline> — a lighter mid-page nudge for long pages.
 */

export function CtaBand({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <section className="px-5 sm:px-8 py-20">
      <div
        className="mx-auto max-w-[1080px] rounded-[36px] p-10 md:p-16 text-center text-white"
        style={{ background: accent ?? "var(--primary)" }}
      >
        <h2 className="font-display text-3xl md:text-[3rem] font-semibold tracking-tight text-balance max-w-[20ch] mx-auto">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-white/85 max-w-[46ch] mx-auto leading-relaxed">{subtitle}</p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={PRIMARY_CTA.href}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-medium hover:bg-white/90 transition-colors"
            style={{ color: "#2a231f" }}
          >
            {PRIMARY_CTA.label} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={SECONDARY_CTA.href}
            className="font-medium text-white/90 hover:text-white underline underline-offset-4"
          >
            {SECONDARY_CTA.label} →
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/70">{CTA_REASSURANCE}</p>
      </div>
    </section>
  );
}

export function CtaInline({ text }: { text?: string }) {
  return (
    <section className="px-5 sm:px-8 py-8">
      <div className="mx-auto max-w-[900px] card-soft p-6 md:p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
        <p className="font-display text-xl font-semibold text-center sm:text-left text-balance">
          {text ?? "Ready to talk it through?"}
        </p>
        <div className="flex flex-wrap justify-center gap-3 shrink-0">
          <Link
            href={PRIMARY_CTA.href}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3 font-medium hover:bg-primary-deep transition-colors"
          >
            {PRIMARY_CTA.label} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={SECONDARY_CTA.href}
            className="inline-flex items-center rounded-full border border-border-strong bg-surface px-6 py-3 font-medium hover:border-primary hover:text-primary transition-colors"
          >
            {SECONDARY_CTA.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
