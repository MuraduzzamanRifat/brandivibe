import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OG_IMAGE } from "@/lib/seo";
import { pillars, getServicesByPillar } from "@/data/services";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand } from "@/components/warm/Cta";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Services — Web, Software, Marketing, Design & AI · Brandivibe",
  description:
    "Everything your business needs to grow online, under one roof: web development, custom software, digital marketing, creative content, design, and AI automation.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "What we do · Brandivibe",
    description:
      "Web, software, marketing, content, design, and AI — a friendly studio for growing businesses.",
    url: "/services",
    type: "website",
    images: OG_IMAGE,
  },
};

export default function ServicesIndexPage() {
  return (
    <>
      <WarmNav />
      <main>
        <section className="pt-36 pb-14 px-5 sm:px-8">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">— What we do</p>
            <h1 className="mt-4 font-display text-5xl md:text-7xl font-semibold tracking-tight text-balance max-w-[16ch]">
              Everything, under one warm roof.
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-[56ch] leading-relaxed text-pretty">
              From a quick website to a custom platform, a full marketing engine to an AI teammate —
              here&apos;s everything we can help with, grouped into six simple areas.
            </p>
          </div>
        </section>

        {pillars.map((p) => {
          const list = getServicesByPillar(p.title);
          return (
            <section key={p.slug} id={p.slug} className="px-5 sm:px-8 py-14 scroll-mt-24 border-t border-border">
              <div className="mx-auto max-w-[1200px]">
                <div className="flex items-center gap-3">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: p.accent }} />
                  <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{p.title}</h2>
                </div>
                <p className="mt-2 text-foreground/65 max-w-[52ch]">{p.blurb}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`} className="card-soft lift group p-6 flex flex-col">
                      <h3 className="font-display text-xl font-semibold tracking-tight flex items-center gap-1.5">
                        {s.title}
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: p.accent }} />
                      </h3>
                      <p className="mt-2 text-foreground/70 text-[0.95rem] leading-relaxed flex-1">{s.summary}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <CtaBand
          title="Not sure where to start?"
          subtitle="Tell us the problem, not the service — we'll point you to the right thing, even if it isn't us."
        />
      </main>
      <WarmFooter />
    </>
  );
}
