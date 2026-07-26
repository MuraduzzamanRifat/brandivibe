"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CtaBand } from "@/components/warm/Cta";

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<{ domain: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/audit/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setSent({ domain: json.domain || url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <WarmNav />
      <main id="main-content" tabIndex={-1}>
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
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">— A free homepage review</p>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[1.03] sm:text-6xl font-semibold tracking-tight text-balance">
              A friendly, human look at what your homepage is{" "}
              <span className="gradient-text">quietly costing you</span>.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-foreground/70 leading-relaxed text-pretty">
              Drop in your web address and we&apos;ll give your homepage the same honest once-over we do before any
              rebuild — design, clarity, and the things getting in your visitors&apos; way. A real person reads it,
              writes up a few clear fixes, and emails them to you. No automated score, no sales call, no signup wall —
              just one email so we know where to send it.
            </p>

            {!sent && (
              <form onSubmit={submit} className="mt-10 card-soft p-8 md:p-10 space-y-6">
                {/* Honeypot: hidden from real users; bots fill it and get a silent no-op. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  onChange={() => {}}
                />
                <div>
                  <label htmlFor="audit-url" className="block font-mono text-xs uppercase tracking-[0.16em] text-muted mb-2">
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
                  <label htmlFor="audit-email" className="block font-mono text-xs uppercase tracking-[0.16em] text-muted mb-2">
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
                  {loading ? "Sending…" : "Send me my review"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
                <p className="text-sm text-muted leading-relaxed">
                  We read your homepage the way a visitor would and reply by email — usually within one business day. No
                  sign-up, no sales call, no surprise follow-ups, and you can say goodbye with one click.
                </p>
              </form>
            )}

            {error && (
              <div className="mt-6 p-5 rounded-2xl border border-primary/30 bg-primary-soft text-primary-deep text-sm">
                {error}
              </div>
            )}

            {sent && (
              <div className="mt-10 space-y-10">
                <div className="card-soft p-8 md:p-10">
                  <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-primary-strong mb-4">
                    <Check className="h-4 w-4" /> Got it
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-balance">
                    We&apos;ll take a look at{" "}
                    <span className="text-primary-strong">{sent.domain}</span>.
                  </h2>
                  <p className="text-foreground/70 text-lg leading-relaxed">
                    A real person on the team will review your homepage by hand and email you a short write-up — the
                    design, what&apos;s working, and the few things worth fixing first. Expect it within one business
                    day. If it doesn&apos;t land, check your spam folder or just reply to say hello.
                  </p>
                </div>

                <CtaBand
                  title="Want a hand fixing it?"
                  subtitle="We love rebuilding founder homepages — one designer on it, a clean Next.js codebase that's yours to keep, and no retainer afterwards. Roughly six friendly weeks, start to finish."
                />

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setSent(null);
                      setUrl("");
                      setEmail("");
                    }}
                    className="text-muted hover:text-foreground transition-colors text-sm"
                  >
                    ← Send another site
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <WarmFooter />
    </>
  );
}
