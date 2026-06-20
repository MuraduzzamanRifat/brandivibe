"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { LazyVideo } from "./LazyVideo";
import { CONTACT_EMAIL, CONTACT_ENDPOINT, WEB3FORMS_KEY } from "@/lib/contact";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (CONTACT_ENDPOINT) {
        // Deliver through a no-backend form service (static host has no /api).
        const payload = {
          name,
          email,
          company,
          message,
          subject: `New Brandivibe enquiry — ${name}${company ? ` (${company})` : ""}`,
          ...(WEB3FORMS_KEY ? { access_key: WEB3FORMS_KEY } : {}),
        };
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(
            (json as { message?: string; error?: string }).message ??
              (json as { error?: string }).error ??
              "Failed to send"
          );
        }
        setSubmitted(true);
      } else {
        // No endpoint configured: never drop the lead — open the visitor's mail
        // client prefilled, addressed to the real inbox.
        const subject = encodeURIComponent(`New Brandivibe enquiry — ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\n\n${message}`
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setSubmitted(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="relative py-14 md:py-16 px-6 border-t border-white/5 overflow-hidden">
      {/* atmospheric stock video — Alex Dos Santos / Pexels */}
      <LazyVideo
        src="/stock/studio-bg.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#08080a]/70 to-[#08080a] pointer-events-none" />
      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm text-[#84e1ff]">— Get free strategy call</span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance">
            Turn your business into a 24/7 client-generating machine.
          </h2>
          <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto">
            Limited onboarding — 4 slots per month. Tell us where you are and we&apos;ll
            come back within 24 hours with a tailored automation plan and a kickoff date.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-10 md:p-14 text-center border border-white/10 bg-white/[0.02]"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#84e1ff]/40 mb-6">
              <span className="text-[#84e1ff] text-2xl">✓</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
              Message received.
            </h3>
            <p className="text-white/60 max-w-md mx-auto">
              We&apos;ll review your project and reply within 24 hours. Keep an eye on <span className="text-white">{email}</span>.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 md:p-12 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cf-name" className="block font-mono text-xs text-white/50 mb-2">NAME</label>
                <input
                  id="cf-name"
                  required
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-transparent border-b border-white/30 pb-3 outline-none focus-visible:border-[#84e1ff] transition-colors placeholder:text-white/50"
                />
              </div>
              <div>
                <label htmlFor="cf-email" className="block font-mono text-xs text-white/50 mb-2">EMAIL</label>
                <input
                  id="cf-email"
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full bg-transparent border-b border-white/30 pb-3 outline-none focus-visible:border-[#84e1ff] transition-colors placeholder:text-white/50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cf-company" className="block font-mono text-xs text-white/50 mb-2">COMPANY</label>
              <input
                id="cf-company"
                type="text"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className="w-full bg-transparent border-b border-white/30 pb-3 outline-none focus-visible:border-[#84e1ff] transition-colors placeholder:text-white/50"
              />
            </div>
            <div>
              <label htmlFor="cf-message" className="block font-mono text-xs text-white/50 mb-2">
                TELL US ABOUT YOUR PROJECT
              </label>
              <textarea
                id="cf-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We're building…"
                className="w-full bg-transparent border-b border-white/30 pb-3 outline-none focus-visible:border-[#84e1ff] transition-colors placeholder:text-white/50 resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send message"}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.form>
        )}

        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm mb-2">or reach us directly</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 text-white hover:text-[#84e1ff] transition-colors"
          >
            <Mail className="w-4 h-4" />
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
