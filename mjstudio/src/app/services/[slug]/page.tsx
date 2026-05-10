import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/data/services";
import { demos } from "@/data/demos";

export const dynamic = "force-static";

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
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const relatedDemos = demos.filter((d) => service.relatedDemos.includes(d.href.replace("/", "")));

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
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
            ← All services
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-10 py-20 md:py-28 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1200px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: `radial-gradient(circle, ${service.accent}, transparent 70%)` }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="font-mono text-xs uppercase tracking-[0.4em] mb-6" style={{ color: service.accent }}>
            — Service · {service.num}
          </div>
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight leading-[0.9] text-balance mb-6">
            {service.hook}
          </h1>
          <div className="text-xl md:text-2xl uppercase tracking-[0.2em] font-mono text-white/40 mb-10">
            {service.title}
          </div>
          <p className="text-2xl md:text-4xl tracking-tight italic text-white/65 leading-tight max-w-4xl text-balance mb-12">
            {service.tagline}
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {service.heroBody.map((p, i) => (
              <p key={i} className="text-white/60 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 mb-14 md:mb-16">
            <div className="col-span-12 md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: service.accent }}>
                — What's included
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

      {/* When you need this */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 mb-12">
            <div className="col-span-12 md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: service.accent }}>
                — When you need this
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05] text-balance">
                If any of these sound familiar, we should talk.
              </h2>
            </div>
          </div>
          <ul className="space-y-4 max-w-4xl ml-auto">
            {service.whenYouNeedThis.map((line, i) => (
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

      {/* Process */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 mb-14 md:mb-16">
            <div className="col-span-12 md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: service.accent }}>
                — The 6-week process
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] text-balance">
                Predictable timelines, real demos.
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
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: service.accent }}>
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
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: service.accent }}>
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

      {/* Related demos */}
      {relatedDemos.length > 0 && (
        <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: service.accent }}>
              — Built for {service.title.toLowerCase()}
            </div>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-12 text-balance">
              See it in production.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDemos.map((d) => (
                <Link
                  key={d.num}
                  href={d.href}
                  className="group block rounded-2xl border border-white/10 hover:border-white/30 transition-colors overflow-hidden bg-white/[0.015]"
                >
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${d.gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-[14vw] md:text-[5vw] font-semibold tracking-tighter text-white/85">
                        {d.name}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                      {d.num} · {d.year}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                      {d.category}
                    </div>
                    <div className="text-2xl font-semibold tracking-tight">{d.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: service.accent }}>
            — Ready to start?
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-8 text-balance">
            Stop being manual. Your competitors aren&apos;t.
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
            Limited onboarding — 4 slots per month. Book a free strategy call and we&apos;ll come back within 24 hours with a tailored plan.
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
