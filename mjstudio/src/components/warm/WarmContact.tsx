"use client";

import { useState } from "react";
import { ArrowRight, Calendar, Check } from "lucide-react";
import { pillars } from "@/data/services";
import { CONTACT_EMAIL, BOOKING_URL } from "@/lib/contact";
import { CTA_REASSURANCE } from "@/lib/cta";

/**
 * The single conversion surface for the whole site. A real lead form that
 * actually delivers (via a no-backend endpoint) with a prefilled mailto
 * fallback so a lead is never lost — plus an optional "book a call" path.
 * Every primary CTA points here (/#contact).
 */
export function WarmContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [botField, setBotField] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          service,
          message,
          website: botField,
          source: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      // Never lose a lead — the visible "email us directly" link is the fallback.
      setError(
        err instanceof Error
          ? `${err.message} You can also email us at ${CONTACT_EMAIL}.`
          : `Something went wrong — please email us at ${CONTACT_EMAIL}.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus-visible:border-primary transition-colors placeholder:text-muted/70";
  const label = "block text-sm font-medium text-foreground/80 mb-1.5";

  return (
    <section id="contact" className="scroll-mt-24 px-5 sm:px-8 py-24 md:py-32">
      <div className="mx-auto max-w-[1100px] grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
        {/* left — the pitch + booking */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">— Let&apos;s talk</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Tell us what you&apos;re thinking about.
          </h2>
          <p className="mt-5 text-lg text-foreground/70 leading-relaxed max-w-[46ch]">
            Share a little about your project and we&apos;ll reply within a day with honest,
            friendly advice — whether or not we end up working together.
          </p>
          <ul className="mt-7 space-y-3">
            {CTA_REASSURANCE.split(" · ").map((r) => (
              <li key={r} className="flex items-center gap-2.5 text-foreground/75">
                <Check className="h-5 w-5 text-primary shrink-0" /> {r}
              </li>
            ))}
          </ul>
          {BOOKING_URL && (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3.5 font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Calendar className="h-4 w-4" /> Prefer a quick call? Book a time
            </a>
          )}
          <p className="mt-6 text-sm text-muted">
            Or email us directly at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-primary-deep">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        {/* right — the form */}
        <div className="card-soft p-6 md:p-8">
          {submitted ? (
            // role="status" so screen readers announce the confirmation when
            // the form is replaced by this block.
            <div className="py-10 text-center" role="status">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary mb-5">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-semibold">Message on its way — thank you.</h3>
              <p className="mt-3 text-foreground/70 max-w-sm mx-auto">
                We&apos;ll get back to you within a day. Keep an eye on{" "}
                <span className="text-foreground">{email}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* honeypot — hidden from people, bots fill it and get silently dropped */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-name" className={label}>Your name</label>
                  <input id="c-name" required autoComplete="name" className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jamie Doe" />
                </div>
                <div>
                  <label htmlFor="c-email" className={label}>Email</label>
                  <input id="c-email" required type="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jamie@company.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-company" className={label}>Company <span className="text-muted font-normal">(optional)</span></label>
                  <input id="c-company" autoComplete="organization" className={field} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Co." />
                </div>
                <div>
                  <label htmlFor="c-service" className={label}>What can we help with?</label>
                  <select id="c-service" className={field} value={service} onChange={(e) => setService(e.target.value)}>
                    <option value="">Choose an area…</option>
                    {pillars.map((p) => (
                      <option key={p.slug} value={p.title}>{p.title}</option>
                    ))}
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="c-message" className={label}>A few words about your project</label>
                <textarea id="c-message" required rows={4} className={`${field} resize-none`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What are you hoping to do?" />
              </div>
              {error && <p role="alert" className="text-sm text-[#c0392b]">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-7 py-4 font-medium hover:bg-primary-deep transition-colors disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send message"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
