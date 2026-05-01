import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadBrain } from "@/lib/brain-storage";
import { ArrowRight } from "lucide-react";

// Pre-render one audit page per prospect at build time. Each new prospect
// the brain commits to brain.json triggers a rebuild + redeploy.
export const dynamic = "force-static";

export async function generateStaticParams() {
  const brain = await loadBrain();
  return brain.prospects
    .filter((p) => p.auditSlug)
    .map((p) => ({ slug: p.auditSlug as string }));
}

type Props = { params: Promise<{ slug: string }> };

async function getProspect(slug: string) {
  const brain = await loadBrain();
  return brain.prospects.find((p) => p.auditSlug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prospect = await getProspect(slug);
  if (!prospect) return { title: "Audit not found" };
  return {
    title: `${prospect.company} — Site audit by Brandivibe`,
    description: `A homepage audit prepared for ${prospect.company}. Three specific issues, three specific fixes, no signup required.`,
    alternates: { canonical: `/audit/${slug}` },
    robots: { index: false, follow: false }, // never let Google index per-prospect pages
  };
}

export default async function ProspectAuditPage({ params }: Props) {
  const { slug } = await params;
  const prospect = await getProspect(slug);
  if (!prospect) notFound();

  const dr = prospect.deepResearch;
  const firstName = dr?.decisionMaker?.firstName || prospect.founder?.split(" ")[0] || "there";
  const observations = dr
    ? [
        { obs: dr.observation1, fix: dr.fix1OneLine, label: "Issue 01" },
        { obs: dr.observation2, fix: dr.fix2OneLine, label: "Issue 02" },
        { obs: dr.observation3, fix: dr.fix3OneLine, label: "Issue 03" },
      ].filter((o) => o.obs && o.fix)
    : [];

  const designScore = dr?.currentDesignScore ?? prospect.scraped?.designScore ?? 5;
  const techStack = prospect.scraped?.techStack ?? [];
  const demoUrl = `https://brandivibe.com/${prospect.bestFitDemo}`;
  const bookingUrl = `https://brandivibe.com/api/brain/book?p=${encodeURIComponent(prospect.id)}`;

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/5 px-6 md:px-10 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
          >
            Brandivibe
          </Link>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            Personal audit · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-10 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1200px] h-[600px] rounded-full bg-gradient-to-b from-[#84e1ff]/[0.06] via-[#a78bfa]/[0.04] to-transparent blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-6xl">
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-[#84e1ff] mb-6">
            — Built for {prospect.company}
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance mb-8">
            {firstName}, here&apos;s what we noticed about {prospect.company}&apos;s homepage.
          </h1>
          <p className="text-lg md:text-xl text-white/55 max-w-2xl leading-relaxed text-balance">
            No signup. No sales call required. We pulled this together after
            looking at <span className="text-white/80">{prospect.domain}</span> and thought you&apos;d want a
            second opinion before your next homepage cycle.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl md:text-4xl font-semibold tabular-nums">{designScore}/10</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Design score</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold">{prospect.industry}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Industry</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold">{prospect.icpTier}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">ICP tier</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold">{techStack.length || "—"}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                {techStack.length ? "Detected libs" : "Stack analysis"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specific observation banner */}
      {dr?.specificObservation && (
        <section className="border-y border-white/5 bg-white/[0.02] px-6 md:px-10 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">
              — The sharpest thing we noticed
            </div>
            <p className="text-2xl md:text-4xl font-semibold leading-tight tracking-tight text-balance">
              &ldquo;{dr.specificObservation}&rdquo;
            </p>
            {dr.oneSentenceImpact && (
              <p className="mt-6 text-white/55 max-w-2xl text-balance">
                <span className="text-[#84e1ff] font-mono text-xs uppercase tracking-[0.3em] mr-3">Why it matters</span>
                {dr.oneSentenceImpact}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Three issues */}
      {observations.length > 0 && (
        <section className="px-6 md:px-10 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#84e1ff] mb-4">
              — The fix list
            </div>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-12 md:mb-16 text-balance">
              Three things, ranked by impact.
            </h2>
            <div className="space-y-8 md:space-y-10">
              {observations.map((o, i) => (
                <article
                  key={i}
                  className="grid grid-cols-12 gap-6 md:gap-10 pb-8 md:pb-10 border-b border-white/5 last:border-0"
                >
                  <div className="col-span-12 md:col-span-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
                      {o.label}
                    </div>
                    <div className="mt-2 text-7xl md:text-8xl font-semibold tabular-nums text-white/15 leading-none">
                      0{i + 1}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-4 text-balance">
                      {o.obs}
                    </h3>
                    <div className="rounded-2xl border border-[#84e1ff]/20 bg-[#84e1ff]/5 p-5 md:p-6">
                      <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#84e1ff] mb-2">
                        — Quick fix
                      </div>
                      <p className="text-white/80 leading-relaxed">{o.fix}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quantified bleed if present */}
      {dr?.quantifiedBleed && (
        <section className="border-t border-white/5 px-6 md:px-10 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-[#fcd34d]/15 bg-gradient-to-br from-[#fcd34d]/5 via-transparent to-transparent p-8 md:p-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#fcd34d] mb-4">
                — What this is costing
              </div>
              <p className="text-2xl md:text-4xl font-semibold leading-tight text-balance">
                {dr.quantifiedBleed}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Closest demo */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-12 items-center">
            <div className="col-span-12 md:col-span-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#84e1ff] mb-4">
                — What this could look like
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance">
                A reference for {prospect.company} in 6 weeks.
              </h2>
              <p className="text-white/55 leading-relaxed mb-8">
                Our <span className="text-white">{prospect.bestFitDemo}</span> demo is the closest reference for{" "}
                <span className="text-white">{prospect.industry}</span> brands at your stage. Live site, real WebGL,
                production codebase you&apos;d own outright.
              </p>
              <Link
                href={demoUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 transition-colors font-medium text-sm"
              >
                See {prospect.bestFitDemo} live <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="col-span-12 md:col-span-7">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#84e1ff]/15 via-[#a78bfa]/10 to-transparent">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[14vw] md:text-[8vw] font-semibold tracking-tighter text-white/80 capitalize">
                    {prospect.bestFitDemo}
                  </div>
                </div>
                <div className="absolute top-5 left-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Live demo · brandivibe.com/{prospect.bestFitDemo}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#84e1ff] mb-6">
            — If this resonates
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] mb-8 text-balance">
            Want a 15-minute walkthrough of these fixes?
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
            No pitch deck, no sales motion. Just me, your homepage on screen, and the three fixes spelled out
            in detail. Booked by you, ended by you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={bookingUrl}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Grab 15 mins <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={demoUrl}
              target="_blank"
              rel="noopener"
              className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white"
            >
              Or browse the {prospect.bestFitDemo} demo →
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            Built by Muraduzzaman · Brandivibe — brandivibe.com
          </div>
        </div>
      </section>
    </main>
  );
}
