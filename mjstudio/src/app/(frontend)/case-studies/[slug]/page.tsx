import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { OG_IMAGE } from "@/lib/seo";
import { getCaseStudies, getCaseStudyFull } from "@/lib/case-studies";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand, CtaInline } from "@/components/warm/Cta";

// New case studies published in the admin appear without a redeploy.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyFull(slug);
  if (!cs) return { title: "Case study not found" };
  return {
    title: `${cs.seoTitle} · Case Study · Brandivibe`,
    description: cs.seoDescription,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: {
      title: cs.seoTitle,
      description: cs.seoDescription,
      url: `/case-studies/${slug}`,
      type: "article",
      images: cs.heroImage ? [{ url: cs.heroImage }] : OG_IMAGE,
    },
  };
}

/** A titled rich-text section; renders nothing when the content is empty. */
function Section({ eyebrow, title, html }: { eyebrow: string; title: string; html: string }) {
  if (!html) return null;
  return (
    <section className="px-5 sm:px-8 py-10">
      <div className="mx-auto max-w-[760px]">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary-strong">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
        <div
          className="prose max-w-none mt-6 text-lg text-foreground/80 leading-relaxed space-y-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudyFull(slug);
  if (!cs) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: cs.title,
        description: cs.excerpt,
        datePublished: cs.publishedAt,
        author: { "@type": "Organization", "@id": "https://brandivibe.com/#organization", name: "Brandivibe" },
        publisher: { "@type": "Organization", "@id": "https://brandivibe.com/#organization", name: "Brandivibe" },
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://brandivibe.com/case-studies/${slug}` },
        ...(cs.heroImage && { image: { "@type": "ImageObject", url: cs.heroImage } }),
        ...(cs.client && { about: { "@type": "Organization", name: cs.client } }),
        articleSection: "Case study",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://brandivibe.com" },
          { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://brandivibe.com/case-studies" },
          { "@type": "ListItem", position: 3, name: cs.title, item: `https://brandivibe.com/case-studies/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <WarmNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        {/* ---- hero ---- */}
        <section className="relative overflow-hidden pt-36 pb-12 px-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,106,61,0.30), transparent 68%)" }}
          />
          <div className="relative mx-auto max-w-[900px]">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Our work
            </Link>
            <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-strong">
              {[cs.client, cs.industry].filter(Boolean).join(" · ")}
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold tracking-tight text-balance">
              {cs.title}
            </h1>
            {cs.excerpt && (
              <p className="mt-6 text-xl text-foreground/70 max-w-[56ch] leading-relaxed text-pretty">{cs.excerpt}</p>
            )}
            {(cs.services.length > 0 || cs.technologies.length > 0) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {cs.services.map((s) => (
                  <span key={s} className="rounded-full bg-primary-soft text-primary-deep px-4 py-1.5 text-sm font-medium">{s}</span>
                ))}
                {cs.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground/70">{t}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---- metrics band ---- */}
        {cs.metrics.length > 0 && (
          <section className="px-5 sm:px-8 pb-4">
            <div className="mx-auto max-w-[900px] card-soft p-7 md:p-9 grid gap-6 sm:grid-cols-3">
              {cs.metrics.slice(0, 6).map((m) => (
                <div key={m.label}>
                  <div className="font-display text-3xl md:text-4xl font-semibold text-primary-strong">{m.value}</div>
                  <div className="mt-1 text-sm text-foreground/70">{m.label}</div>
                  {m.note && <div className="mt-0.5 text-xs text-muted">{m.note}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---- hero image ---- */}
        {cs.heroImage && (
          <section className="px-5 sm:px-8 py-8">
            <div className="mx-auto max-w-[1100px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cs.heroImage} alt={cs.title} className="w-full rounded-3xl border border-border" />
            </div>
          </section>
        )}

        <Section eyebrow="— The client" title="Overview" html={cs.overviewHtml} />
        <Section eyebrow="— The problem" title="The challenge" html={cs.challengeHtml} />

        {/* ---- objectives ---- */}
        {cs.objectives.length > 0 && (
          <section className="px-5 sm:px-8 py-10">
            <div className="mx-auto max-w-[760px] card-soft p-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight">What we set out to do</h2>
              <ul className="mt-5 space-y-3">
                {cs.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-foreground/80">
                    <Check className="h-5 w-5 shrink-0 mt-0.5 text-primary-strong" /> {o}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <Section eyebrow="— Research & strategy" title="How we approached it" html={cs.researchHtml} />
        <Section eyebrow="— Design" title="The design process" html={cs.designHtml} />
        <Section eyebrow="— Development" title="Bringing it to life" html={cs.devHtml} />
        <Section eyebrow="— Marketing & AI" title="Helping it grow" html={cs.marketingHtml} />

        {/* ---- timeline ---- */}
        {cs.timeline.length > 0 && (
          <section className="px-5 sm:px-8 py-10">
            <div className="mx-auto max-w-[1000px]">
              <h2 className="font-display text-3xl font-semibold tracking-tight">How the project ran</h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cs.timeline.map((t, i) => (
                  <div key={i} className="card-soft p-6">
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary-strong">{t.duration}</span>
                    <h3 className="mt-2.5 font-display text-lg font-semibold">{t.phase}</h3>
                    <p className="mt-2 text-foreground/70 text-[0.93rem] leading-relaxed">{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- before / after ---- */}
        {cs.beforeAfter && (cs.beforeAfter.beforeImage || cs.beforeAfter.afterImage) && (
          <section className="px-5 sm:px-8 py-10 bg-surface-2 border-y border-border">
            <div className="mx-auto max-w-[1100px]">
              <h2 className="font-display text-3xl font-semibold tracking-tight">Before & after</h2>
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {cs.beforeAfter.beforeImage && (
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cs.beforeAfter.beforeImage} alt={cs.beforeAfter.beforeLabel} className="w-full rounded-2xl border border-border" />
                    <figcaption className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">{cs.beforeAfter.beforeLabel}</figcaption>
                  </figure>
                )}
                {cs.beforeAfter.afterImage && (
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cs.beforeAfter.afterImage} alt={cs.beforeAfter.afterLabel} className="w-full rounded-2xl border border-border" />
                    <figcaption className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-primary-strong">{cs.beforeAfter.afterLabel}</figcaption>
                  </figure>
                )}
              </div>
              {cs.beforeAfter.note && <p className="mt-5 text-foreground/70 max-w-[60ch] leading-relaxed">{cs.beforeAfter.note}</p>}
            </div>
          </section>
        )}

        {/* ---- gallery ---- */}
        {cs.gallery.length > 0 && (
          <section className="px-5 sm:px-8 py-10">
            <div className="mx-auto max-w-[1100px]">
              <h2 className="font-display text-3xl font-semibold tracking-tight">A closer look</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {cs.gallery.map((g, i) => (
                  <figure key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.image} alt={g.caption || cs.title} className="w-full rounded-2xl border border-border" />
                    {g.caption && <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- videos ---- */}
        {cs.videos.length > 0 && (
          <section className="px-5 sm:px-8 py-10">
            <div className="mx-auto max-w-[760px]">
              <h2 className="font-display text-3xl font-semibold tracking-tight">Watch it in action</h2>
              <ul className="mt-6 space-y-3">
                {cs.videos.map((v) => (
                  <li key={v.url}>
                    <a href={v.url} target="_blank" rel="noopener noreferrer" className="card-soft lift flex items-center justify-between gap-4 p-5 group">
                      <span className="font-medium text-foreground">{v.title || v.url}</span>
                      <ArrowRight className="h-4 w-4 text-primary-strong opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ---- testimonial ---- */}
        {cs.testimonial && (
          <section className="px-5 sm:px-8 py-12">
            <div className="mx-auto max-w-[820px] rounded-[28px] bg-primary-soft p-9 md:p-12">
              <p className="font-display text-2xl md:text-[1.7rem] leading-snug text-foreground text-pretty">
                “{cs.testimonial.quote}”
              </p>
              <p className="mt-6 font-medium text-foreground">{cs.testimonial.authorName}</p>
              {cs.testimonial.authorRole && <p className="text-sm text-muted">{cs.testimonial.authorRole}</p>}
            </div>
          </section>
        )}

        <CtaInline text="Want results like this for your business?" />

        {/* ---- related services ---- */}
        {cs.relatedServices.length > 0 && (
          <section className="px-5 sm:px-8 py-10">
            <div className="mx-auto max-w-[900px]">
              <h2 className="font-display text-2xl font-semibold text-foreground/80">The services behind this project</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {cs.relatedServices.slice(0, 3).map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="card-soft lift p-5">
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary-strong font-medium">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBand
          title="Let's write your case study next."
          subtitle="Tell us what you're hoping to achieve — we'll show you exactly how we'd approach it."
        />
      </main>
      <WarmFooter />
    </>
  );
}
