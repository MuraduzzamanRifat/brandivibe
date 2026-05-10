import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Services — Brandivibe",
  description:
    "WebGL website development, SEO optimization, AI automation systems, digital marketing strategy, custom AI agent development. Five services that turn your business into a 24/7 client-generating machine.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Brandivibe",
    description:
      "WebGL websites, SEO, AI automation, digital marketing, AI agents — five services that compound into one 24/7 growth machine.",
    url: "/services",
    type: "website",
  },
};

export default function ServicesIndexPage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <header className="border-b border-white/5 px-6 md:px-10 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
          >
            ← Brandivibe
          </Link>
          <Link
            href="/portfolio"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white"
          >
            View portfolio →
          </Link>
        </div>
      </header>

      <section className="px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-[#84e1ff] mb-6">
            — Services
          </div>
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight leading-[0.9] mb-8 text-balance">
            Five ways we turn your<br />business into a 24/7 machine.
          </h1>
          <p className="text-lg md:text-xl text-white/55 max-w-2xl leading-relaxed text-balance">
            We build conversion-focused AI-powered digital systems that make your business
            look premium, rank higher, automate operations, and generate more customers.
            Pick one — or stack them — and we&apos;ll have a tailored plan in 48 hours.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl space-y-6">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group block rounded-3xl border border-white/8 bg-white/[0.015] hover:border-white/25 transition-colors overflow-hidden"
            >
              <article className="grid grid-cols-12 gap-6 md:gap-10 p-8 md:p-12 items-start">
                <div className="col-span-12 md:col-span-2">
                  <div
                    className="font-mono text-[10px] uppercase tracking-[0.4em] mb-3"
                    style={{ color: s.accent }}
                  >
                    Service · {s.num}
                  </div>
                  <div
                    className="text-7xl md:text-8xl font-semibold tabular-nums leading-none opacity-15 group-hover:opacity-30 transition-opacity"
                    style={{ color: s.accent }}
                  >
                    {s.num}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05] mb-4 group-hover:opacity-90">
                    {s.title}
                  </h2>
                  <p className="text-xl md:text-2xl tracking-tight italic text-white/60 mb-5 text-balance">
                    {s.tagline}
                  </p>
                  <p className="text-white/55 leading-relaxed mb-6">{s.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.bullets.map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-white/65 font-mono"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3 flex md:justify-end items-center">
                  <span
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] group-hover:gap-4 transition-all"
                    style={{ color: s.accent }}
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-8 text-balance">
            Not sure which to start with?
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
            The strongest results come from stacking 2-3 services into one system. Book a free
            strategy call — we&apos;ll diagnose your funnel, identify the highest-leverage
            starting point, and map the rollout in 30 minutes.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            Get free strategy call <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
