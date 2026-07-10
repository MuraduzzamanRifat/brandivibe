import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Star } from "lucide-react";
import { getAllServices, getServiceBySlug, getServicesByPillar, getFeaturedTestimonials, pillars } from "@/lib/content";
import { PRIMARY_CTA } from "@/lib/cta";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand, CtaInline } from "@/components/warm/Cta";
import { accentInk } from "@/lib/accent";
import { WebglShowcase } from "@/components/warm/scene/WebglShowcase";

export const dynamicParams = false;
// ISR so a testimonial added in the admin appears on service pages within 5 min
// (matches the homepage). Pages are still prebuilt via generateStaticParams.
export const revalidate = 300;

export async function generateStaticParams() {
  const all = await getAllServices();
  return all.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/services/${slug}`,
      type: "website",
      images: OG_IMAGE,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const a = service.accent; // bright accent — glows, tints, decorative fills
  const ink = accentInk(a); // accessible variant — white-text buttons + accent-as-text
  const pillarSlug = pillars.find((p) => p.title === service.pillar)?.slug ?? "";
  const siblings = (await getServicesByPillar(service.pillar)).filter((s) => s.slug !== service.slug).slice(0, 3);
  const proof = (await getFeaturedTestimonials(1))[0]; // single strongest review, if any

  // Service + BreadcrumbList schema — declares what this page sells and where
  // it sits in the site hierarchy (Home > Services > Pillar > Service).
  const serviceSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://brandivibe.com/services/${service.slug}#service`,
        name: service.title,
        description: service.summary,
        serviceType: service.title,
        provider: { "@id": "https://brandivibe.com/#organization" },
        areaServed: "Worldwide",
        url: `https://brandivibe.com/services/${service.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://brandivibe.com" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://brandivibe.com/services" },
          { "@type": "ListItem", position: 3, name: service.pillar, item: `https://brandivibe.com/services#${pillarSlug}` },
          { "@type": "ListItem", position: 4, name: service.title, item: `https://brandivibe.com/services/${service.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <WarmNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {service.faqs && service.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: service.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      )}
      <main>
        {/* ---- hero ---- */}
        <section className="relative overflow-hidden pt-36 pb-14 px-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
            style={{ background: `radial-gradient(circle, ${a}55, transparent 68%)` }}
          />
          <div className="relative mx-auto max-w-[1200px]">
            <Link
              href={`/services#${pillarSlug}`}
              className="font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-foreground"
            >
              ← {service.pillar}
            </Link>
            <h1 className="mt-5 font-display font-semibold tracking-tight text-balance">
              {/* Keyword-bearing kicker keeps the service entity in the H1 while the warm hook stays the visual lead. */}
              <span className="block text-lg sm:text-xl font-medium tracking-normal" style={{ color: ink }}>
                {service.title}
              </span>
              <span className="block mt-2 text-[2.7rem] leading-[1.03] sm:text-6xl md:text-[4.2rem] max-w-[15ch]">
                {service.hook}
              </span>
            </h1>
            <p className="mt-6 text-xl text-foreground/70 max-w-[52ch] leading-relaxed text-pretty">{service.tagline}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {service.bullets.map((b) => (
                <span key={b} className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground/75">
                  {b}
                </span>
              ))}
            </div>
            <div className="mt-8">
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

        {/* ---- intro ---- */}
        <section className="px-5 sm:px-8 py-10">
          <div className="mx-auto max-w-[760px] space-y-5 text-lg text-foreground/80 leading-relaxed">
            {service.heroBody.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* ---- live 3D demo: only on the page that actually sells 3D ----
             Every other service page must not pay three.js's weight, so this is
             gated on the slug rather than rendered for all 35 services. */}
        {service.slug === "webgl-3d-experiences" && (
          <section className="py-6">
            <WebglShowcase accent={a} />
          </section>
        )}

        {/* ---- capabilities ---- */}
        <section className="px-5 sm:px-8 py-14">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">What you get</h2>
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

        <CtaInline text={`Curious what ${service.title.toLowerCase()} could do for you?`} />

        {/* ---- when you need this ---- */}
        <section className="px-5 sm:px-8 py-16 bg-surface-2 border-y border-border">
          <div className="mx-auto max-w-[900px]">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">This is for you if…</h2>
            <ul className="mt-8 space-y-3.5">
              {service.whenYouNeedThis.map((w) => (
                <li key={w} className="flex items-start gap-3 text-lg text-foreground/80">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: a }} />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- process ---- */}
        <section className="px-5 sm:px-8 py-16">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">How it works</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step) => (
                <div key={step.title} className="card-soft p-6">
                  <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: ink }}>{step.label}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-foreground/70 text-[0.93rem] leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- deliverables ---- */}
        <section className="px-5 sm:px-8 py-8">
          <div className="mx-auto max-w-[900px] card-soft p-8 md:p-10">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">What you&apos;ll walk away with</h2>
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

        {/* ---- how pricing works ---- */}
        <section className="px-5 sm:px-8 py-14">
          <div className="mx-auto max-w-[900px] rounded-[28px] p-8 md:p-10" style={{ background: `${a}12` }}>
            <p className="font-mono text-xs uppercase tracking-[0.16em] mb-3" style={{ color: ink }}>How pricing works</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Clear, fixed pricing — no surprises.</h2>
            <p className="mt-4 text-lg text-foreground/75 leading-relaxed max-w-[62ch]">
              Every project is quoted to what you actually need — no bloated packages, no monthly
              retainers you can&apos;t cancel. We agree a clear, fixed price before we start, so you always
              know exactly where you stand. The quickest way to a real number is a short, free call.
            </p>
            <Link
              href={PRIMARY_CTA.href}
              className="mt-6 inline-flex items-center gap-2 rounded-full text-white px-6 py-3 font-medium transition-transform hover:scale-[1.02]"
              style={{ background: ink }}
            >
              {PRIMARY_CTA.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ---- faqs ---- */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="px-5 sm:px-8 py-14 border-t border-border">
            <div className="mx-auto max-w-[820px]">
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Questions, answered</h2>
              <div className="mt-8 space-y-3">
                {service.faqs.map((f) => (
                  <details key={f.q} className="card-soft group overflow-hidden p-0">
                    <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 p-5 font-medium text-foreground">
                      <span>{f.q}</span>
                      <span className="font-mono text-xl shrink-0 leading-none transition-transform group-open:rotate-45" style={{ color: ink }}>+</span>
                    </summary>
                    <p className="px-5 pb-5 -mt-1 text-foreground/75 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- siblings ---- */}
        {siblings.length > 0 && (
          <section className="px-5 sm:px-8 py-16 mt-6 border-t border-border">
            <div className="mx-auto max-w-[1200px]">
              <h2 className="font-display text-2xl font-semibold text-foreground/80">More in {service.pillar}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {siblings.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="card-soft lift p-6">
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-foreground/65 text-[0.92rem] leading-relaxed">{s.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- industries we serve (links the industry-specific variants) ---- */}
        <section className="px-5 sm:px-8 py-10">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="font-display text-2xl font-semibold text-foreground/80">
              {service.title} for your industry
            </h2>
            <p className="mt-2 text-foreground/65 max-w-[56ch]">
              The same senior craft, shaped around how your buyers actually decide.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { slug: "saas", name: "SaaS" },
                { slug: "ecommerce", name: "E-commerce" },
                { slug: "real-estate", name: "Real Estate" },
                { slug: "hospitality", name: "Hospitality" },
                { slug: "fintech", name: "FinTech" },
                { slug: "web3", name: "Web3" },
                { slug: "agencies", name: "Agencies" },
                { slug: "healthcare", name: "Healthcare" },
              ].map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/services/${service.slug}/${ind.slug}`}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground/75 hover:border-foreground/30 transition-colors"
                >
                  {service.title} for {ind.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---- cta ---- */}
        <CtaBand
          accent={a}
          title={`Let's talk about your ${service.title} project.`}
          subtitle="A friendly chat, honest advice, and a clear plan. No pressure, no jargon."
        />
      </main>
      <WarmFooter />
    </>
  );
}
