"use client";

import { useState } from "react";
import Link from "next/link";

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
    <main className="min-h-screen bg-[#08080a] text-white px-6 md:px-10 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 md:mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-5">
            — The Brandivibe Homepage Audit
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance mb-5">
            Get a 30-point audit of your homepage in <span className="italic text-[#84e1ff]">90 seconds</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Real analysis by the same engine we use before quoting a $35–90K
            rebuild. Scraped, scored, and explained. No sales call, no signup
            wall, one email required.
          </p>
        </header>

        {!result && (
          <form
            onSubmit={submit}
            className="glass rounded-3xl p-8 md:p-10 space-y-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl"
          >
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.25em] text-white/50 mb-2">
                Your website
              </label>
              <input
                required
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourcompany.com"
                className="w-full bg-transparent border-b border-white/20 pb-3 outline-none text-lg focus:border-[#84e1ff] transition-colors placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.25em] text-white/50 mb-2">
                Where to send the report
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-transparent border-b border-white/20 pb-3 outline-none text-lg focus:border-[#84e1ff] transition-colors placeholder:text-white/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Running audit…" : "Run the audit →"}
            </button>
            <p className="text-xs text-white/40">
              Your site will be scraped in real time. No sign-up, no sales call,
              no follow-up phone call. You&apos;ll get the report via email and
              can unsubscribe with one click.
            </p>
          </form>
        )}

        {error && (
          <div className="mt-6 p-5 rounded-2xl border border-red-400/30 bg-red-500/5 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-10 text-center">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] animate-pulse">
              Scraping · Detecting stack · Analyzing
            </div>
            <div className="mt-3 text-white/40 text-sm">This takes about 30–60 seconds.</div>
          </div>
        )}

        {result && (
          <div className="space-y-10">
            <div className="rounded-3xl p-8 md:p-10 border border-white/10 bg-white/[0.02] backdrop-blur-xl">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-4">
                — Audit complete
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-balance">
                {result.company}{" "}
                <span className="text-white/40">/ {result.domain}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <ScoreCard label="Design score" value={`${result.designScore}/10`} />
                <ScoreCard label="Industry read" value={result.industryName} />
                <ScoreCard label="Tech stack" value={result.techStackSummary} />
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 mb-2">
                The sharpest observation
              </div>
              <p className="text-xl md:text-2xl leading-snug text-balance mb-2">
                {result.specificObservation}
              </p>
            </div>

            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-5">
                — Three things worth fixing
              </div>
              <ul className="space-y-4">
                {result.observations.map((o, i) => (
                  <li
                    key={i}
                    className="rounded-2xl p-6 border border-white/10 bg-white/[0.015]"
                  >
                    <div className="text-white/90 text-lg mb-2 font-medium">{i + 1}. {o.title}</div>
                    <div className="text-white/60 text-sm">
                      <span className="text-[#84e1ff]">Fix →</span> {o.fix}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 rounded-xl border border-[#84e1ff]/30 bg-[#84e1ff]/5">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#84e1ff] mb-1">
                  Top priority
                </div>
                <div className="text-white/90">{result.topPriority}</div>
              </div>
            </div>

            {result.weaknesses.length > 0 && (
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-5">
                  — Full weakness list
                </div>
                <ol className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-white/70 pl-6 relative">
                      <span className="absolute left-0 text-white/30 font-mono text-xs">{i + 1}.</span>
                      {w}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="rounded-3xl p-8 md:p-10 border border-white/10 bg-white/[0.02] text-center">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                Want this fixed?
              </h3>
              <p className="text-white/60 mb-6 max-w-xl mx-auto">
                Brandivibe rebuilds founder homepages in 6 weeks for $35–90K. One
                designer, production Next.js codebase you own, no retainer.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all hover:scale-[1.02]"
              >
                Start a project →
              </Link>
              <div className="mt-4 text-xs text-white/40">
                {result.emailSent
                  ? "The full report has been emailed to you."
                  : "Report is rendered above (email delivery was skipped)."}
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                onClick={() => {
                  setResult(null);
                  setUrl("");
                  setEmail("");
                }}
                className="text-white/40 hover:text-white transition-colors text-sm"
              >
                ← Audit another site
              </button>
            </div>
          </div>
        )}

        <footer className="mt-24 pt-8 border-t border-white/10 text-white/40 text-sm flex items-center justify-between">
          <Link href="/" className="hover:text-white">← Brandivibe home</Link>
          <Link href="/journal" className="hover:text-white">Read the journal →</Link>
        </footer>
      </div>
    </main>
  );
}

function ScoreCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.015] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}
