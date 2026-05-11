import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { buildServiceIndustryPayload } from "@/lib/programmatic-seo";

// Fully prerendered at build time — required for `output: "export"`
// (GitHub Pages). 5 services × 8 industries = 40 static pages. No
// runtime; the HTML is committed to the static bundle.
export const dynamic = "force-static";
export const dynamicParams = false;

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
    },
  };
}

export default async function ServiceForIndustryPage({ params }: Props) {
  const { slug, industry } = await params;
  const service = services.find((s) => s.slug === slug);
  const industryRecord = industries.find((i) => i.slug === industry);
  if (!service || !industryRecord) notFound();

  const payload = buildServiceIndustryPayload(service, industryRecord);

  // Sibling industries for this service — internal linking layer.
  // Helps Google crawl the cluster and signals topical breadth.
  const siblingIndustries = industries.filter((i) => i.slug !== industryRecord.slug);

  // Other services for this same industry — second internal linking
  // layer. Lets a visitor reading "WebGL for SaaS" easily find "AI
  // Automation for SaaS" or "SEO for SaaS".
  const otherServicesForIndustry = services.filter((s) => s.slug !== service.slug);

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
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

      <header className="border-b border-white/5 px-6 md:px-10 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
          >
            Brandivibe
          </Link>
          <Link
            href={`/services/${service.slug}`}
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white"
          >
            ← {service.title}
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="px-6 md:px-10 pt-8 mx-auto max-w-6xl"
      >
        <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 flex-wrap">
          <li>
            <Link href="/" className="hover:text-white">Home</Link>
          </li>
          <li className="text-white/20">/</li>
          <li>
            <Link href="/services" className="hover:text-white">Services</Link>
          </li>
          <li className="text-white/20">/</li>
          <li>
            <Link href={`/services/${service.slug}`} className="hover:text-white">
              {service.title}
            </Link>
          </li>
          <li className="text-white/20">/</li>
          <li className="text-white/60">For {industryRecord.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-10 py-16 md:py-24 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1200px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: `radial-gradient(circle, ${service.accent}, transparent 70%)` }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div
            className="font-mono text-xs uppercase tracking-[0.4em] mb-6"
            style={{ color: service.accent }}
          >
            — {service.title} · For {industryRecord.pluralName}
          </div>
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight leading-[0.9] text-balance mb-6">
            {payload.hook}
          </h1>
          <div className="text-xl md:text-2xl uppercase tracking-[0.2em] font-mono text-white/40 mb-10">
            {service.title} · {industryRecord.shortLabel}
          </div>
          <p className="text-2xl md:text-4xl tracking-tight italic text-white/65 leading-tight max-w-4xl text-balance mb-12">
            {payload.tagline}
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mb-12">
            {payload.intro.map((p, i) => (
              <p key={i} className="text-white/60 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Definition block — AI-extractable summary anchored to the
              service × industry pair. Lifts cleanly into ChatGPT or
              Perplexity answers for "what is <service> for <industry>". */}
          <div
            className="max-w-4xl rounded-2xl border-l-2 pl-6 py-2"
            style={{ borderColor: service.accent }}
          >
            <div
              className="font-mono text-[10px] uppercase tracking-[0.3em] mb-3"
              style={{ color: service.accent }}
            >
              In one sentence
            </div>
            <p className="text-lg md:text-xl text-white/85 leading-relaxed">
              <span className="font-semibold">
                {service.title} for {industryRecord.pluralName}
              </span>{" "}
              is Brandivibe&apos;s {service.tagline.charAt(0).toLowerCase() + service.tagline.slice(1).replace(/\.$/, "")}, scoped to the conversion priorities and operational realities of {industryRecord.shortLabel} — shipped in 6 weeks.
            </p>
          </div>

          {/* Industry signal — quick credibility anchor */}
          <div className="mt-10 flex flex-wrap items-center gap-4 text-white/40 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              Built for
            </span>
            <span className="text-white/55">{industryRecord.buyerPersona}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/55">{industryRecord.conversionFrame}</span>
          </div>
        </div>
      </section>

      {/* When you need this — combined industry + service pain points */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 mb-12">
            <div className="col-span-12 md:col-span-4">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
                style={{ color: service.accent }}
              >
                — Where {industryRecord.pluralName} get stuck
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05] text-balance">
                If any of these sound familiar, we should talk.
              </h2>
            </div>
          </div>
          <ul className="space-y-4 max-w-4xl ml-auto">
            {payload.combinedPainPoints.map((line, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <span
                  className="mt-2 w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-150"
                  style={{ background: service.accent }}
                />
                <span className="text-white/75 text-lg leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Capabilities — sourced from service, presented as the answer
          to industry pains */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 mb-14 md:mb-16">
            <div className="col-span-12 md:col-span-4">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
                style={{ color: service.accent }}
              >
                — How we deliver for {industryRecord.pluralName}
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] text-balance">
                Capabilities, not promises.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.capabilities.map((c) => (
              <article
                key={c.title}
                className="rounded-2xl border border-white/8 bg-white/[0.015] p-7 hover:border-white/20 transition-colors"
              >
                <h3 className="text-xl font-semibold tracking-tight mb-3">{c.title}</h3>
                <p className="text-white/55 leading-relaxed text-[15px]">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 mb-14 md:mb-16">
            <div className="col-span-12 md:col-span-4">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
                style={{ color: service.accent }}
              >
                — The 6-week process
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] text-balance">
                Same cadence. Tailored to {industryRecord.pluralName}.
              </h2>
            </div>
          </div>
          <div className="space-y-6">
            {service.process.map((step, i) => (
              <article
                key={i}
                className="grid grid-cols-12 gap-4 md:gap-8 items-start py-8 border-b border-white/5 last:border-0"
              >
                <div className="col-span-12 md:col-span-2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
                  {step.label}
                </div>
                <div className="col-span-12 md:col-span-3">
                  <h3
                    className="text-2xl md:text-3xl font-semibold tracking-tight"
                    style={{ color: service.accent }}
                  >
                    {step.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="text-white/65 leading-relaxed text-lg">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div
            className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
            style={{ color: service.accent }}
          >
            — What you take home
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-12 text-balance">
            Deliverables.
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 max-w-5xl">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <Check className="w-5 h-5 shrink-0 mt-1" style={{ color: service.accent }} />
                <span className="text-white/80 leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ — industry + service combined */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
            <div className="col-span-12 md:col-span-4">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
                style={{ color: service.accent }}
              >
                — Common questions from {industryRecord.pluralName}
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] text-balance">
                Answered, in plain language.
              </h2>
            </div>
          </div>
          <div className="space-y-4 md:space-y-5 max-w-4xl">
            {payload.faqPairs.map((pair, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/8 bg-white/[0.015] overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 md:px-8 py-5 md:py-6 cursor-pointer hover:bg-white/[0.02] transition-colors">
                  <span className="text-lg md:text-xl font-medium tracking-tight pr-4">
                    {pair.q}
                  </span>
                  <span
                    className="shrink-0 w-2.5 h-2.5 border-r-2 border-b-2 border-white/40 rotate-45 group-open:-rotate-135 group-open:translate-y-1 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-6 md:px-8 pb-6 text-white/65 leading-relaxed">
                  {pair.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Sibling industries — internal linking layer */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div
            className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
            style={{ color: service.accent }}
          >
            — Also building {service.title.toLowerCase()} for
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[0.95] mb-10 text-balance">
            Other industries we ship for.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {siblingIndustries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/services/${service.slug}/${ind.slug}`}
                className="group rounded-2xl border border-white/8 bg-white/[0.015] p-5 hover:border-white/25 hover:bg-white/[0.03] transition-colors"
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2"
                  style={{ color: service.accent }}
                >
                  {service.title}
                </div>
                <div className="text-base md:text-lg font-semibold tracking-tight group-hover:translate-x-0.5 transition-transform">
                  For {ind.name}
                </div>
                <div className="text-white/45 text-xs mt-2">{ind.shortLabel}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other services for this industry — second internal linking layer */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div
            className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
            style={{ color: service.accent }}
          >
            — More services for {industryRecord.pluralName}
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[0.95] mb-10 text-balance">
            Other ways we partner with {industryRecord.pluralName}.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherServicesForIndustry.map((svc) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}/${industryRecord.slug}`}
                className="group rounded-2xl border border-white/8 bg-white/[0.015] p-6 md:p-7 hover:border-white/25 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div
                      className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2"
                      style={{ color: svc.accent }}
                    >
                      Service · {svc.num}
                    </div>
                    <div className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
                      {svc.title} for {industryRecord.pluralName}
                    </div>
                    <p className="text-white/55 text-sm leading-relaxed line-clamp-2">
                      {svc.tagline}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-5 h-5 shrink-0 mt-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    style={{ color: svc.accent }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="font-mono text-[10px] uppercase tracking-[0.4em] mb-6"
            style={{ color: service.accent }}
          >
            — Ready for {industryRecord.pluralName}
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-8 text-balance">
            Built for {industryRecord.pluralName}. Shipped in 6 weeks.
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
            Limited onboarding — 4 slots per month. Book a free strategy call and we&apos;ll come back within 24 hours with a tailored plan for your {industryRecord.shortLabel.toLowerCase()} build.
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
