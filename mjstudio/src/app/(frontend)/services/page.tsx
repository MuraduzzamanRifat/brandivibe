import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { OG_IMAGE } from "@/lib/seo";
import { pillars, getAllServices, type Service } from "@/lib/content";
import { accentInk } from "@/lib/accent";
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

/**
 * Every pillar gets a real screenshot from our own interactive builds — not a
 * stock photo of strangers pointing at a laptop, and not a mocked-up client
 * dashboard we never made. Each one is a live page a visitor can go and open.
 */
const PILLAR_VISUAL: Record<string, { src: string; caption: string; href: string }> = {
  "web-development": { src: "/work/aurora.jpg", caption: "Aurora — luxury watchmaker", href: "/aurora" },
  software: { src: "/work/neuron.jpg", caption: "Neuron — B2B SaaS platform", href: "/neuron" },
  "digital-marketing": { src: "/work/axiom.jpg", caption: "Axiom — global payments", href: "/axiom" },
  "creative-content": { src: "/work/orbit.jpg", caption: "Orbit — electric hypercar", href: "/orbit" },
  "creative-design": { src: "/work/monolith.jpg", caption: "Monolith — architecture studio", href: "/monolith" },
  "ai-automation": { src: "/work/pulse.jpg", caption: "Pulse — telehealth & clinical AI", href: "/pulse" },
};

// A short line per pillar, written to be the answer to "what do you do in X?".
const PILLAR_LEAD: Record<string, string> = {
  "web-development":
    "Fast, beautiful websites — from a simple business site to an immersive WebGL experience that people remember.",
  software:
    "Custom software built around the way your business already works, instead of forcing it into someone else's template.",
  "digital-marketing":
    "Getting found, and getting chosen — search, ads, and social that can be traced back to actual revenue.",
  "creative-content":
    "Words, video, and posts that sound like you, and give people a reason to care.",
  "creative-design":
    "Design that finally matches the quality of the work you do — and stays consistent everywhere people meet you.",
  "ai-automation":
    "Automations and AI agents that quietly handle the repetitive work your team shouldn't be doing at all.",
};

// Digital Marketing holds 13 services — too many to scan flat. Break it into
// three clear sub-areas so people find the right one fast.
const DM_SUBGROUPS: { label: string; slugs: string[] }[] = [
  {
    label: "Search (SEO)",
    slugs: ["seo-services", "local-seo", "ecommerce-seo", "app-store-optimization", "google-business-profile", "guest-posts", "seo-audit"],
  },
  { label: "Advertising", slugs: ["facebook-ads", "linkedin-ads", "youtube-ads", "content-distribution"] },
  { label: "Social & Reputation", slugs: ["social-media-management", "online-reputation-management"] },
];

/** Compact, scannable chip — 35 full cards is a wall; 35 chips is a menu. */
function ServiceChip({ s, ink }: { s: Service; ink: string }) {
  return (
    <Link
      href={`/services/${s.slug}`}
      title={s.summary}
      className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-[0.95rem] text-foreground/80 transition-colors hover:border-foreground/25 hover:text-foreground"
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ink }} />
      {s.title}
      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" style={{ color: ink }} />
    </Link>
  );
}

export default async function ServicesIndexPage() {
  const allServices = await getAllServices();

  // ItemList schema — declares the full service catalog to search/AI engines.
  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://brandivibe.com/services",
    name: "Brandivibe services",
    description: `All ${allServices.length} Brandivibe services across six areas: web development, software, digital marketing, creative content, creative design, and AI automation.`,
    isPartOf: { "@id": "https://brandivibe.com/#website" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allServices.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.title,
          description: s.summary,
          url: `https://brandivibe.com/services/${s.slug}`,
          provider: { "@id": "https://brandivibe.com/#organization" },
        },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }} />
      <WarmNav />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-36 pb-14 px-5 sm:px-8">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— What we do</p>
            <h1 className="mt-4 font-display text-5xl md:text-7xl font-semibold tracking-tight text-balance max-w-[16ch]">
              Everything, under one warm roof.
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-[56ch] leading-relaxed text-pretty">
              From a quick website to a custom platform, a full marketing engine to an AI teammate —
              here&apos;s everything we can help with, grouped into six simple areas.
            </p>
            {/* Quotable entity summary for answer engines. */}
            <p className="mt-4 text-foreground/60 max-w-[62ch] leading-relaxed">
              Brandivibe is a friendly digital studio offering {allServices.length} services across six areas:
              web development, custom software, digital marketing, creative content, creative design, and AI automation.
            </p>
            {/* Jump-link TOC — snippet-friendly list + faster navigation on a long page. */}
            <nav aria-label="Service areas" className="mt-7 flex flex-wrap gap-2">
              {pillars.map((p) => (
                <a
                  key={p.slug}
                  href={`#${p.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground/75 hover:border-foreground/30 transition-colors"
                >
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: p.accent }} />
                  {p.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {pillars.map((p, index) => {
          const list = allServices.filter((s) => s.pillar === p.title);
          const ink = accentInk(p.accent);
          const visual = PILLAR_VISUAL[p.slug];
          // Alternate the image side so the page reads as a rhythm, not a list.
          const imageFirst = index % 2 === 1;

          return (
            <section
              key={p.slug}
              id={p.slug}
              className={`scroll-mt-24 border-t border-border px-5 py-20 sm:px-8 md:py-24 ${
                index % 2 === 1 ? "bg-surface-2" : ""
              }`}
            >
              <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
                {/* ---- the visual: a real build, openable ---- */}
                {visual && (
                  <Link
                    href={visual.href}
                    className={`group relative block overflow-hidden rounded-[28px] border border-border shadow-[0_30px_60px_-32px_rgba(42,35,31,0.35)] ${
                      imageFirst ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={visual.src}
                        alt={visual.caption}
                        fill
                        sizes="(min-width: 1024px) 46vw, 100vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 bg-surface px-5 py-3.5">
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                        {visual.caption}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
                        style={{ color: ink }}
                      >
                        Open it <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                )}

                {/* ---- the words + the services ---- */}
                <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
                  <p
                    className="font-mono text-xs uppercase tracking-[0.18em]"
                    style={{ color: ink }}
                  >
                    — {p.title}
                  </p>
                  <h2 className="mt-4 font-display text-3xl md:text-[2.7rem] font-semibold tracking-tight text-balance">
                    {PILLAR_LEAD[p.slug] ?? p.blurb}
                  </h2>
                  <p className="mt-4 text-foreground/65 leading-relaxed">
                    {list.length} service{list.length === 1 ? "" : "s"} in this area.
                  </p>

                  {p.slug === "digital-marketing" ? (
                    <div className="mt-7 space-y-6">
                      {DM_SUBGROUPS.map((g) => {
                        const items = g.slugs
                          .map((slug) => list.find((s) => s.slug === slug))
                          .filter((s): s is Service => Boolean(s));
                        if (items.length === 0) return null;
                        return (
                          <div key={g.label}>
                            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                              {g.label}
                            </p>
                            <ul className="flex flex-wrap gap-2.5">
                              {items.map((s) => (
                                <li key={s.slug}>
                                  <ServiceChip s={s} ink={ink} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ul className="mt-7 flex flex-wrap gap-2.5">
                      {list.map((s) => (
                        <li key={s.slug}>
                          <ServiceChip s={s} ink={ink} />
                        </li>
                      ))}
                    </ul>
                  )}
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
