import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { industries } from "@/data/industries";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Industries — WebGL, SEO, AI Automation by Vertical · Brandivibe",
  description:
    "Brandivibe ships premium WebGL websites, SEO, AI automation, marketing, and AI agents tailored to 8 industries — SaaS, e-commerce, real estate, hospitality, FinTech, Web3, agencies, and healthcare.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industries — Brandivibe by vertical",
    description:
      "Premium digital builds tailored to your industry. 5 services × 8 industries.",
    url: "/industries",
    type: "website",
  },
};

export default function IndustriesHubPage() {
  // Hub-page schema: signals to AI search this is a navigational
  // overview page that fans out to industry-specific service pages.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://brandivibe.com/industries",
    name: "Industries Brandivibe serves",
    description:
      "Industries Brandivibe builds for, paired with the 5 services we offer per vertical.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://brandivibe.com/#website",
      name: "Brandivibe",
    },
  };

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <header className="border-b border-white/5 px-6 md:px-10 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
          >
            Brandivibe
          </Link>
          <Link
            href="/services"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white"
          >
            All services →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-10 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1200px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-25 bg-[radial-gradient(circle,#84e1ff,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="font-mono text-xs uppercase tracking-[0.4em] mb-6 text-[#84e1ff]">
            — Industries we ship for
          </div>
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight leading-[0.9] text-balance mb-6">
            Built for your industry. Not the average.
          </h1>
          <p className="text-2xl md:text-3xl tracking-tight italic text-white/65 leading-tight max-w-4xl text-balance mb-12">
            Five services. Eight industries. Forty tailored engagements where the strategy, copy, and conversion architecture are scoped to the buyer journey of your category.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              For
            </span>
            <span className="text-white/55">
              Founders and growth leads at seed-to-Series-B brands competing on quality, not template.
            </span>
          </div>
        </div>
      </section>

      {/* Industries grid */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 mb-14">
            <div className="col-span-12 md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4 text-[#84e1ff]">
                — Eight industries
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] text-balance">
                Pick the one closest to your business.
              </h2>
            </div>
          </div>

          <div className="space-y-12">
            {industries.map((industry) => (
              <article
                key={industry.slug}
                className="border-t border-white/5 pt-12 first:border-t-0 first:pt-0"
              >
                <div className="grid grid-cols-12 gap-6 md:gap-10">
                  <div className="col-span-12 md:col-span-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-3">
                      {industry.shortLabel}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-balance">
                      {industry.name}
                    </h3>
                    <p className="text-white/55 leading-relaxed text-[15px] mb-5">
                      {industry.intro}
                    </p>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
                      Buyer
                    </div>
                    <p className="text-white/45 text-sm">{industry.buyerPersona}</p>
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">
                      Five services for {industry.pluralName}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}/${industry.slug}`}
                          className="group rounded-2xl border border-white/8 bg-white/[0.015] p-5 hover:border-white/25 hover:bg-white/[0.03] transition-colors"
                        >
                          <div
                            className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2"
                            style={{ color: service.accent }}
                          >
                            Service · {service.num}
                          </div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-base md:text-lg font-semibold tracking-tight">
                              {service.title}
                              <span className="text-white/35 font-normal"> for {industry.name}</span>
                            </div>
                            <ArrowRight
                              className="w-4 h-4 shrink-0 mt-1 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                              style={{ color: service.accent }}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-6 text-[#84e1ff]">
            — Don&apos;t see your industry?
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-8 text-balance">
            We work outside these too.
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
            These eight cover most of our work — but the engagement model travels. If your category isn&apos;t listed and you&apos;re competing on quality, book a call and we&apos;ll come back with a tailored plan within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Get free strategy call <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/audit"
              className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white"
            >
              Or audit my business →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
