import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Star } from "lucide-react";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { getFeaturedTestimonials } from "@/lib/content";
import { buildServiceIndustryPayload } from "@/lib/programmatic-seo";
import { PRIMARY_CTA } from "@/lib/cta";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand, CtaInline } from "@/components/warm/Cta";
import { accentInk } from "@/lib/accent";

// Prebuilt via generateStaticParams (the service × industry matrix), then
// ISR: revalidate=300 lets a testimonial added in the admin appear here
// within ~5 min, matching the homepage and service detail pages.
export const dynamicParams = false;
export const revalidate = 300;

export async function generateStaticParams() {
  return services.flatMap((s) =>
    industries.map((i) => ({ slug: s.slug, industry: i.slug }))
  );
}

type Props = {
  params: Promise<{ slug: string; industry: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, industry } = await params;
  const service = services.find((s) => s.slug === slug);
  const industryRecord = industries.find((i) => i.slug === industry);
  if (!service || !industryRecord) return { title: "Page not found" };

  const payload = buildServiceIndustryPayload(service, industryRecord);

  return {
    title: payload.metaTitle,
    description: payload.metaDescription,
    alternates: { canonical: payload.canonical },
    openGraph: {
      title: payload.metaTitle,
      description: payload.metaDescription,
      url: payload.canonical,
      type: "website",
      images: OG_IMAGE,
    },
  };
}

export default async function ServiceForIndustryPage({ params }: Props) {
  const { slug, industry } = await params;
  const service = services.find((s) => s.slug === slug);
  const industryRecord = industries.find((i) => i.slug === industry);
  if (!service || !industryRecord) notFound();

  const payload = buildServiceIndustryPayload(service, industryRecord);
  const a = service.accent; // bright accent — glows, tints, decorative fills
  const ink = accentInk(a); // accessible variant — white-text buttons + accent-as-text

  // Sibling industries for this service — internal linking layer.
  // Helps Google crawl the cluster and signals topical breadth.
  const siblingIndustries = industries.filter((i) => i.slug !== industryRecord.slug);

  // Other services for this same industry — second internal linking
  // layer. Lets a visitor reading "WebGL for SaaS" easily find "AI
  // Automation for SaaS" or "SEO for SaaS".
  const otherServicesForIndustry = services.filter((s) => s.slug !== service.slug);

  const proof = (await getFeaturedTestimonials(1))[0]; // single strongest review, if any

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.breadcrumbSchema) }}
      />

      <WarmNav />
      <main id="main-content" tabIndex={-1}>
        {/* ---- hero ---- */}
        <section className="relative overflow-hidden pt-36 md:pt-40 pb-14 px-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
            style={{ background: `radial-gradient(circle, ${a}55, transparent 68%)` }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted flex-wrap">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                </li>
                <li className="text-foreground/25">/</li>
                <li>
                  <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
                </li>
                <li className="text-foreground/25">/</li>
                <li>
                  <Link href={`/services/${service.slug}`} className="hover:text-foreground transition-colors">
                    {service.title}
                  </Link>
                </li>
                <li className="text-foreground/25">/</li>
                <li className="text-foreground/70">For {industryRecord.name}</li>
              </ol>
            </nav>

            <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em]" style={{ color: ink }}>
              — {service.title} · for {industryRecord.pluralName}
            </p>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[1.03] sm:text-6xl md:text-[4.2rem] font-semibold tracking-tight text-balance max-w-[16ch]">
              {payload.hook}
            </h1>
            <p className="mt-6 text-xl text-foreground/70 max-w-[54ch] leading-relaxed text-pretty">
              {payload.tagline}
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 max-w-[820px]">
              {payload.intro.map((p, i) => (
                <p key={i} className="text-foreground/75 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-9">
              <Link
                href={PRIMARY_CTA.href}
                className="inline-flex items-center gap-2 rounded-full text-white px-7 py-4 font-medium transition-transform hover:scale-[1.02]"
                style={{ background: ink }}
              >
                {PRIMARY_CTA.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---- in one sentence ---- */}
        <section className="px-5 sm:px-8 py-4">
          <div className="mx-auto max-w-[1200px]">
            {/* Definition block — AI-extractable summary anchored to the
                service × industry pair. Lifts cleanly into ChatGPT or
                Perplexity answers for "what is <service> for <industry>". */}
            <div
              className="max-w-[900px] rounded-2xl border-l-2 pl-6 py-3"
              style={{ borderColor: a }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.14em] mb-3" style={{ color: ink }}>
                In one sentence
              </p>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed text-pretty">
                <span className="font-semibold text-foreground">
                  {service.title} for {industryRecord.pluralName}
                </span>{" "}
                is Brandivibe&apos;s {service.tagline.charAt(0).toLowerCase() + service.tagline.slice(1).replace(/\.$/, "")}, shaped around the conversion priorities and day-to-day realities of {industryRecord.shortLabel} — and ready to launch in about 6 weeks.
              </p>
            </div>

            {/* Industry signal — quick credibility anchor */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                Made for
              </span>
              <span className="text-foreground/70">{industryRecord.buyerPersona}</span>
              <span className="text-foreground/25">·</span>
              <span className="text-foreground/70">{industryRecord.conversionFrame}</span>
            </div>
          </div>
        </section>

        {/* ---- where you get stuck (pain points) ---- */}
        <section className="px-5 sm:px-8 py-16 mt-6 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[900px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: ink }}>
              — Where {industryRecord.pluralName} get stuck
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
              If any of these sound familiar, let&apos;s talk.
            </h2>
            <ul className="mt-8 space-y-3.5">
              {payload.combinedPainPoints.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-lg text-foreground/80">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: a }} />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- capabilities ---- */}
        <section className="px-5 sm:px-8 py-16">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: ink }}>
              — How we help {industryRecord.pluralName}
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
              Real capabilities, not promises.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.capabilities.map((c) => (
                <div key={c.title} className="card-soft p-6">
                  <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${a}1f`, color: ink }}>
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-foreground/70 text-[0.95rem] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaInline text={`Want ${service.title.toLowerCase()} built for ${industryRecord.pluralName}?`} />

        {/* ---- process ---- */}
        <section className="px-5 sm:px-8 py-16 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: ink }}>
              — The six-week rhythm
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
              The same steady steps, tuned for {industryRecord.pluralName}.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, i) => (
                <div key={i} className="card-soft p-6">
                  <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: ink }}>{step.label}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-foreground/70 text-[0.93rem] leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- deliverables ---- */}
        <section className="px-5 sm:px-8 py-14">
          <div className="mx-auto max-w-[900px] card-soft p-8 md:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: ink }}>
              — What you take home
            </p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold tracking-tight">
              What you&apos;ll walk away with
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-foreground/80">
                  <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: ink }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- proof (one featured review, accent pull-quote — renders only when present) ---- */}
        {proof && (
          <section className="px-5 sm:px-8 py-10">
            <figure
              className="mx-auto max-w-[900px] rounded-[28px] p-8 md:p-12 text-center"
              style={{ background: `${a}0f`, border: `1px solid ${a}26` }}
            >
              <div className="flex justify-center gap-0.5 mb-5" style={{ color: ink }}>
                {Array.from({ length: Math.max(1, Math.min(5, Math.round(proof.rating))) }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="font-display text-2xl md:text-[1.9rem] leading-snug tracking-tight text-balance text-pretty text-foreground">
                &ldquo;{proof.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-muted">
                <span className="font-medium text-foreground">{proof.authorName || proof.company}</span>
                {(proof.authorRole || (proof.authorName && proof.company)) && (
                  <span> · {[proof.authorRole, proof.authorName ? proof.company : ""].filter(Boolean).join(" · ")}</span>
                )}
              </figcaption>
            </figure>
          </section>
        )}

        {/* ---- FAQ ---- */}
        <section className="px-5 sm:px-8 py-16 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[900px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: ink }}>
              — Questions we hear from {industryRecord.pluralName}
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
              Answered, in plain language.
            </h2>
            <div className="mt-8 space-y-3">
              {payload.faqPairs.map((pair, i) => (
                <details
                  key={i}
                  className="group card-soft overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-6 md:px-7 py-5 cursor-pointer list-none">
                    <span className="text-lg font-medium tracking-tight text-foreground pr-2">
                      {pair.q}
                    </span>
                    <span
                      className="shrink-0 grid h-8 w-8 place-items-center rounded-full text-white transition-transform duration-200 group-open:rotate-45"
                      style={{ background: ink }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 md:px-7 pb-6 text-foreground/70 leading-relaxed">
                    {pair.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---- sibling industries ---- */}
        <section className="px-5 sm:px-8 py-16">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: ink }}>
              — {service.title} for other industries
            </p>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-semibold tracking-tight text-balance">
              We do this for these folks too.
            </h2>
            <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
              {siblingIndustries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/services/${service.slug}/${ind.slug}`}
                  className="card-soft lift group p-5"
                >
                  <div className="font-mono text-xs uppercase tracking-[0.14em] mb-2" style={{ color: ink }}>
                    {service.title}
                  </div>
                  <div className="font-display text-base md:text-lg font-semibold">
                    For {ind.name}
                  </div>
                  <div className="text-foreground/60 text-xs mt-2">{ind.shortLabel}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---- other services for this industry ---- */}
        <section className="px-5 sm:px-8 py-16 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: ink }}>
              — More ways we help {industryRecord.pluralName}
            </p>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-semibold tracking-tight text-balance">
              Other things we can do together.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {otherServicesForIndustry.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}/${industryRecord.slug}`}
                  className="card-soft lift group p-6 md:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-mono text-xs uppercase tracking-[0.14em] mb-2" style={{ color: svc.accent }}>
                        Service · {svc.num}
                      </div>
                      <div className="font-display text-xl md:text-2xl font-semibold tracking-tight mb-2">
                        {svc.title} for {industryRecord.pluralName}
                      </div>
                      <p className="text-foreground/65 text-sm leading-relaxed line-clamp-2">
                        {svc.tagline}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-5 h-5 shrink-0 mt-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      style={{ color: svc.accent }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---- cta ---- */}
        <CtaBand
          accent={a}
          title={`Made for ${industryRecord.pluralName}. Live in about 6 weeks.`}
          subtitle={`We take on just a handful of new projects each month, so we can give yours real attention. Say hello and we'll reply within a day with a friendly, tailored plan for your ${industryRecord.shortLabel.toLowerCase()} build.`}
        />
      </main>
      <WarmFooter />
    </>
  );
}
