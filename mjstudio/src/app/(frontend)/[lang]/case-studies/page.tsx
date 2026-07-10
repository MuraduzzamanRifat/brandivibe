import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { OG_IMAGE } from "@/lib/seo";
import { getCaseStudies } from "@/lib/case-studies";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand } from "@/components/warm/Cta";

// Revalidate every 5 minutes — case studies published in the admin appear on
// the live site without a redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Work & Case Studies · Brandivibe",
  description:
    "Real projects and results — a look at the websites, software, and campaigns we've built for growing businesses.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Our work · Brandivibe",
    description: "Real projects and the results they delivered.",
    url: "/case-studies",
    type: "website",
    images: OG_IMAGE,
  },
};

export default async function CaseStudiesPage() {
  const items = await getCaseStudies();

  // CollectionPage + ItemList — declares the portfolio to search/AI engines.
  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://brandivibe.com/case-studies",
    name: "Brandivibe case studies",
    description: "Real client projects by Brandivibe — the work, the process, and the results.",
    isPartOf: { "@id": "https://brandivibe.com/#website" },
    ...(items.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        itemListElement: items.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.title,
          url: `https://brandivibe.com/case-studies/${c.slug}`,
        })),
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }} />
      <WarmNav />
      <main>
        <section className="pt-36 pb-14 px-5 sm:px-8">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— Our work</p>
            <h1 className="mt-4 font-display text-5xl md:text-7xl font-semibold tracking-tight text-balance max-w-[15ch]">
              Real projects, real results.
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-[56ch] leading-relaxed text-pretty">
              A look at the websites, software, and campaigns we&apos;ve built — and the difference they made.
            </p>
          </div>
        </section>

        {items.length === 0 ? (
          <section className="px-5 sm:px-8 pb-10">
            <div className="mx-auto max-w-[900px] card-soft p-10 md:p-14 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-semibold">Fresh case studies are on the way.</h2>
              <p className="mt-4 text-foreground/70 max-w-[48ch] mx-auto leading-relaxed">
                We&apos;re busy writing up recent projects. In the meantime, tell us what you&apos;re working on —
                we&apos;re always happy to share relevant examples on a quick call.
              </p>
              <Link
                href="/#contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary-strong text-white px-7 py-4 font-medium hover:bg-primary-deep transition-colors"
              >
                Book a free call <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ) : (
          <section className="px-5 sm:px-8 pb-10">
            <div className="mx-auto max-w-[1200px] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <Link key={c.slug} href={`/case-studies/${c.slug}`} className="card-soft lift group overflow-hidden flex flex-col">
                  {c.heroImage ? (
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={c.heroImage}
                        alt={c.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-surface-2" />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {c.client}{c.industry ? ` · ${c.industry}` : ""}
                    </div>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight leading-snug">{c.title}</h2>
                    <p className="mt-2 text-foreground/70 text-[0.95rem] leading-relaxed line-clamp-2 flex-1">{c.excerpt}</p>
                    {c.metrics && c.metrics.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        {c.metrics.slice(0, 3).map((m) => (
                          <div key={m.label}>
                            <div className="font-display text-lg font-semibold text-primary-strong">{m.value}</div>
                            <div className="text-[11px] text-muted">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <CtaBand
          title="Want results like these?"
          subtitle="Tell us what you're hoping to achieve — we'll show you how we'd approach it."
        />
      </main>
      <WarmFooter />
    </>
  );
}
