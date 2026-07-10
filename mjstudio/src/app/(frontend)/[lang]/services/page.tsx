import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OG_IMAGE } from "@/lib/seo";
import { pillars, getAllServices, type Service } from "@/lib/content";
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

function ServiceCard({ s, accent }: { s: Service; accent: string }) {
  return (
    <Link href={`/services/${s.slug}`} className="card-soft lift group p-6 flex flex-col">
      <h3 className="font-display text-xl font-semibold tracking-tight flex items-center gap-1.5">
        {s.title}
        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: accent }} />
      </h3>
      <p className="mt-2 text-foreground/70 text-[0.95rem] leading-relaxed flex-1">{s.summary}</p>
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
      <main>
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
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground/75 hover:border-foreground/30 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: p.accent }} />
                  {p.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {pillars.map((p) => {
          const list = allServices.filter((s) => s.pillar === p.title);
          return (
            <section key={p.slug} id={p.slug} className="px-5 sm:px-8 py-14 scroll-mt-24 border-t border-border">
              <div className="mx-auto max-w-[1200px]">
                <div className="flex items-center gap-3">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: p.accent }} />
                  <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{p.title}</h2>
                </div>
                <p className="mt-2 text-foreground/65 max-w-[52ch]">{p.blurb}</p>

                {p.slug === "digital-marketing" ? (
                  <div className="mt-8 space-y-10">
                    {DM_SUBGROUPS.map((g) => {
                      const items = g.slugs
                        .map((slug) => list.find((s) => s.slug === slug))
                        .filter((s): s is Service => Boolean(s));
                      if (items.length === 0) return null;
                      return (
                        <div key={g.label}>
                          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted mb-4">{g.label}</p>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((s) => (
                              <ServiceCard key={s.slug} s={s} accent={p.accent} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((s) => (
                      <ServiceCard key={s.slug} s={s} accent={p.accent} />
                    ))}
                  </div>
                )}
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
