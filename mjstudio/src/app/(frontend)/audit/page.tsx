"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand } from "@/components/warm/Cta";

type AuditResult = {
  ok: boolean;
  company: string;
  domain: string;
  designScore: number;
  techStackSummary: string;
  industryName: string;
  specificObservation: string;
  observations: Array<{ title: string; fix: string }>;
  topPriority: string;
  weaknesses: string[];
  emailSent: boolean;
};

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/audit/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Audit failed. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <WarmNav />
      <main>
        {/* ---- hero + form ---- */}
        <section className="relative overflow-hidden pt-36 md:pt-40 pb-20 px-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,106,61,0.28), rgba(255,106,61,0) 68%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-40 left-[-12%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(15,165,152,0.22), rgba(15,165,152,0) 70%)" }}
          />
          <div className="relative mx-auto max-w-[760px]">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— A free homepage check-up</p>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[1.03] sm:text-6xl font-semibold tracking-tight text-balance">
              See what your homepage is <span className="gradient-text">quietly costing you</span> — in about 90 seconds.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-foreground/70 leading-relaxed text-pretty">
              Pop in your web address and we&apos;ll take a friendly, 30-point look at your homepage — the same
              once-over we do before any rebuild. We&apos;ll score the design, spot what&apos;s getting in your
              visitors&apos; way, and hand you a few clear things to fix. No sales call, no signup wall, just one
              email so we know where to send it.
            </p>

            {!result && (
              <form
                onSubmit={submit}
                className="mt-10 card-soft p-8 md:p-10 space-y-6"
              >
                <div>
                  <label
                    htmlFor="audit-url"
                    className="block font-mono text-xs uppercase tracking-[0.16em] text-muted mb-2"
                  >
                    Your website
                  </label>
                  <input
                    id="audit-url"
                    required
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="yourcompany.com"
                    className="w-full bg-transparent border-b border-border-strong pb-3 outline-none text-lg text-foreground focus:border-primary transition-colors placeholder:text-muted/70"
                  />
                </div>
                <div>
                  <label
                    htmlFor="audit-email"
                    className="block font-mono text-xs uppercase tracking-[0.16em] text-muted mb-2"
                  >
                    Where to send it
                  </label>
                  <input
                    id="audit-email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-transparent border-b border-border-strong pb-3 outline-none text-lg text-foreground focus:border-primary transition-colors placeholder:text-muted/70"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-strong text-white px-7 py-4 font-medium hover:bg-primary-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Taking a look…" : "Check my homepage"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
                <p className="text-sm text-muted leading-relaxed">
                  We&apos;ll read your homepage live, just like a visitor would. No sign-up, no sales call, no
                  surprise follow-ups — you&apos;ll get the report by email and can say goodbye with one click.
                </p>
              </form>
            )}

            {error && (
              <div className="mt-6 p-5 rounded-2xl border border-primary/30 bg-primary-soft text-primary-deep text-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="mt-10 text-center">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong animate-pulse">
                  Reading your page · Spotting the stack · Making notes
                </div>
                <div className="mt-3 text-muted text-sm">This usually takes about 30–60 seconds — hang tight.</div>
              </div>
            )}
          </div>
        </section>

        {/* ---- results ---- */}
        {result && (
          <section className="px-5 sm:px-8 pb-4">
            <div className="mx-auto max-w-[760px] space-y-10">
              <div className="card-soft p-8 md:p-10">
                <div className="font-mono text-xs uppercase tracking-[0.16em] text-primary-strong mb-4">
                  — All done
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-balance">
                  {result.company}{" "}
                  <span className="text-muted">/ {result.domain}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <ScoreCard label="Design score" value={`${result.designScore}/10`} />
                  <ScoreCard label="Industry read" value={result.industryName} />
                  <ScoreCard label="Tech stack" value={result.techStackSummary} />
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.16em] text-muted mb-2">
                  The thing that jumped out
                </div>
                <p className="font-display text-xl md:text-2xl leading-snug text-balance">
                  {result.specificObservation}
                </p>
              </div>

              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong mb-5">
                  — Three things worth fixing first
                </div>
                <ul className="space-y-4">
                  {result.observations.map((o, i) => (
                    <li key={i} className="card-soft p-6">
                      <div className="font-display text-lg mb-2 font-semibold text-foreground">
                        {i + 1}. {o.title}
                      </div>
                      <div className="text-foreground/70 text-[0.95rem] leading-relaxed">
                        <span className="text-primary-strong font-medium">Fix →</span> {o.fix}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-5 rounded-2xl border border-primary/25 bg-primary-soft">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-deep mb-1">
                    Start here
                  </div>
                  <div className="text-foreground/85">{result.topPriority}</div>
                </div>
              </div>

              {result.weaknesses.length > 0 && (
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong mb-5">
                    — Everything else we spotted
                  </div>
                  <ol className="space-y-2.5">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="text-foreground/75 pl-7 relative leading-relaxed">
                        <span className="absolute left-0 text-muted font-mono text-xs top-0.5">{i + 1}.</span>
                        {w}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="text-sm text-muted flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                {result.emailSent
                  ? "The full report is on its way to your inbox."
                  : "Your full report is right here above (we skipped the email this time)."}
              </div>

              <CtaBand
                title="Want a hand fixing it?"
                subtitle="We love rebuilding founder homepages — one designer on it, a clean Next.js codebase that's yours to keep, and no retainer afterwards. Roughly six friendly weeks, start to finish."
              />

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl("");
                    setEmail("");
                  }}
                  className="text-muted hover:text-foreground transition-colors text-sm"
                >
                  ← Check another site
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
      <WarmFooter />
    </>
  );
}

function ScoreCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </div>
      <div className="mt-2 font-display text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
