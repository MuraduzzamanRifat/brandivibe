import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { services, pillars, getServicesByPillar } from "@/data/services";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
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
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const a = service.accent;
  const pillarSlug = pillars.find((p) => p.title === service.pillar)?.slug ?? "";
  const siblings = getServicesByPillar(service.pillar).filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <WarmNav />
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
            <h1 className="mt-5 font-display text-[2.7rem] leading-[1.03] sm:text-6xl md:text-[4.2rem] font-semibold tracking-tight text-balance max-w-[15ch]">
              {service.hook}
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
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full text-white px-7 py-4 font-medium transition-transform hover:scale-[1.02]"
                style={{ background: a }}
              >
                Start a project <ArrowRight className="h-4 w-4" />
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

        {/* ---- capabilities ---- */}
        <section className="px-5 sm:px-8 py-14">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">What you get</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.capabilities.map((c) => (
                <div key={c.title} className="card-soft p-6">
                  <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${a}1f`, color: a }}>
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-foreground/70 text-[0.95rem] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                  <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: a }}>{step.label}</span>
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
                  <Check className="h-5 w-5 shrink-0 mt-0.5" style={{ color: a }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>

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

        {/* ---- cta ---- */}
        <section className="px-5 sm:px-8 py-20">
          <div className="mx-auto max-w-[1080px] rounded-[36px] p-10 md:p-16 text-center text-white" style={{ background: a }}>
            <h2 className="font-display text-3xl md:text-[3rem] font-semibold tracking-tight text-balance max-w-[18ch] mx-auto">
              Let&apos;s talk about your {service.title.toLowerCase()}.
            </h2>
            <p className="mt-4 text-white/85 max-w-[44ch] mx-auto leading-relaxed">
              A friendly chat, honest advice, and a clear plan. No pressure, no jargon.
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-medium hover:bg-white/90 transition-colors"
              style={{ color: "#2a231f" }}
            >
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <WarmFooter />
    </>
  );
}
