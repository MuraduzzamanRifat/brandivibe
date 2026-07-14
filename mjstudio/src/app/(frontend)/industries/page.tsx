import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getIndustries, getAllServices } from "@/lib/content";
import { industryImage } from "@/lib/section-images";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Industries — WebGL, SEO, AI Automation by Vertical · Brandivibe",
  description:
    "Brandivibe ships premium WebGL websites, SEO, AI automation, marketing, and AI agents tailored to 8 industries — SaaS, e-commerce, real estate, hospitality, FinTech, Web3, agencies, and healthcare.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industries — Brandivibe by vertical",
    description:
      "Premium digital builds tailored to your industry — every Brandivibe service, shaped for 8 verticals.",
    url: "/industries",
    type: "website",
  },
};

export default async function IndustriesHubPage() {
  const [industries, services] = await Promise.all([getIndustries(), getAllServices()]);
  // Hub-page schema: signals to AI search this is a navigational
  // overview page that fans out to industry-specific service pages.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://brandivibe.com/industries",
    name: "Industries Brandivibe serves",
    description:
      "Industries Brandivibe builds for, paired with the services we offer per vertical.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://brandivibe.com/#website",
      name: "Brandivibe",
    },
    // Enumerate the verticals so the CollectionPage actually lists its
    // collection (was an empty shell before).
    mainEntity: {
      "@type": "ItemList",
      itemListElement: industries.map((ind, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: ind.name,
        url: `https://brandivibe.com/industries#${ind.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <WarmNav />
      <main id="main-content" tabIndex={-1}>
        {/* ---- hero ---- */}
        <section className="relative overflow-hidden pt-36 md:pt-40 pb-14 px-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-8%] h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,106,61,0.28), rgba(255,106,61,0) 68%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-40 left-[-12%] h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(15,165,152,0.20), rgba(15,165,152,0) 70%)" }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
              — Made for your world
            </p>
            <h1 className="mt-5 font-display font-semibold tracking-tight text-balance text-[2.7rem] leading-[1.03] sm:text-6xl md:text-[4.2rem] max-w-[16ch]">
              Built for your industry, not the average of everyone else.
            </h1>
            <p className="mt-6 text-xl text-foreground/70 max-w-[54ch] leading-relaxed text-pretty">
              Every business speaks a slightly different language. We know eight of them well — so the words, the design, and the path to “yes” are shaped around the way your customers actually decide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary-strong text-white px-7 py-4 font-medium hover:bg-primary-deep transition-colors"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-7 py-4 font-medium text-foreground hover:border-foreground/30 transition-colors"
              >
                See all services
              </Link>
            </div>
            <p className="mt-8 text-foreground/65 max-w-[60ch] leading-relaxed">
              We tend to be a great fit for founders and growth leads at growing brands who care about quality — not another template that looks like the competitor down the street.
            </p>
          </div>
        </section>

        {/* ---- industries ---- */}
        <section className="px-5 sm:px-8 py-14">
          <div className="mx-auto max-w-[1200px]">
            <div className="max-w-[52ch]">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— Eight industries</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
                Find the one closest to home.
              </h2>
              <p className="mt-5 text-foreground/70 text-lg leading-relaxed">
                Pick the industry that sounds most like you, then choose the help you need. Each one comes with framing built around your buyers — no guessing.
              </p>
            </div>

            <div className="mt-14 space-y-12">
              {industries.map((industry) => (
                <article
                  key={industry.slug}
                  className="border-t border-border pt-12 first:border-t-0 first:pt-0"
                >
                  <div className="grid grid-cols-12 gap-6 md:gap-10">
                    <div className="col-span-12 md:col-span-4">
                      {/* Artwork is optional — a missing file just leaves the
                          column typographic, exactly as before. */}
                      {(() => {
                        const img = industryImage(industry.slug);
                        return img ? (
                          <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl border border-border">
                            <Image
                              src={img}
                              alt={`${industry.name} — the buyers and businesses we build for`}
                              fill
                              sizes="(min-width: 768px) 33vw, 100vw"
                              className="object-cover"
                            />
                          </div>
                        ) : null;
                      })()}
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mb-3">
                        {industry.shortLabel}
                      </p>
                      <h3 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
                        {industry.name}
                      </h3>
                      <p className="mt-4 text-foreground/70 leading-relaxed text-[0.97rem]">
                        {industry.intro}
                      </p>
                      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-2">
                        Who we build for
                      </p>
                      <p className="text-foreground/70 text-sm leading-relaxed">{industry.buyerPersona}</p>
                    </div>

                    <div className="col-span-12 md:col-span-8">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-4">
                        {services.length} ways we help {industry.pluralName}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {services.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}/${industry.slug}`}
                            className="group card-soft lift p-5"
                            style={{ ["--pa" as string]: service.accent }}
                          >
                            <p
                              className="font-mono text-[10px] uppercase tracking-[0.16em] mb-2"
                              style={{ color: service.accent }}
                            >
                              Service · {service.num}
                            </p>
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-display text-base md:text-lg font-semibold tracking-tight">
                                {service.title}
                                <span className="text-foreground/45 font-normal"> for {industry.name}</span>
                              </p>
                              <ArrowUpRight
                                className="h-4 w-4 shrink-0 mt-1 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
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

        {/* ---- cta ---- */}
        <section className="px-5 sm:px-8 py-20">
          <div className="mx-auto max-w-[1080px] rounded-[36px] bg-foreground text-background p-10 md:p-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
              — Don&apos;t see yours?
            </p>
            <h2 className="mt-5 font-display text-3xl md:text-[3rem] font-semibold tracking-tight text-balance max-w-[18ch] mx-auto">
              We happily work outside these too.
            </h2>
            <p className="mt-4 text-background/70 max-w-[52ch] mx-auto leading-relaxed">
              These eight cover most of what we do, but the way we work travels anywhere. If your world isn&apos;t on the list and you care about doing it well, say hello — we&apos;ll come back with a friendly, tailored plan within a day.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary-strong text-white px-7 py-4 font-medium hover:bg-primary-deep transition-colors"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 rounded-full border border-background/25 px-7 py-4 font-medium text-background hover:bg-background/10 transition-colors"
              >
                Get a free audit
              </Link>
            </div>
          </div>
        </section>
      </main>
      <WarmFooter />
    </>
  );
}
