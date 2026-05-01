"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { LazyVideo } from "./LazyVideo";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, budget, message }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? "Failed to send");
      }
      setSubmitted(true);
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
          <span className="font-mono text-sm text-[#84e1ff]">— Let&apos;s talk</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-balance">
            Have a project in mind?
          </h2>
          <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto">
            We take on 2 projects per quarter. Tell us what you&apos;re building
            and we&apos;ll reply within 24 hours.
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
                <label className="block font-mono text-xs text-white/50 mb-2">NAME</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-transparent border-b border-white/20 pb-3 outline-none focus:border-[#84e1ff] transition-colors placeholder:text-white/50"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-white/50 mb-2">EMAIL</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full bg-transparent border-b border-white/20 pb-3 outline-none focus:border-[#84e1ff] transition-colors placeholder:text-white/50"
                />
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs text-white/50 mb-2">COMPANY</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className="w-full bg-transparent border-b border-white/20 pb-3 outline-none focus:border-[#84e1ff] transition-colors placeholder:text-white/50"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-white/50 mb-2">BUDGET</label>
              <div className="flex flex-wrap gap-3">
                {["$5-10k", "$10-15k", "$15-25k", "$25k+"].map((b) => (
                  <label key={b} className="cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      value={b}
                      checked={budget === b}
                      onChange={() => setBudget(b)}
                      className="peer sr-only"
                    />
                    <span className="block px-4 py-2 rounded-full border border-white/20 text-sm hover:border-white/40 peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-colors">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs text-white/50 mb-2">
                TELL US ABOUT YOUR PROJECT
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We're building…"
                className="w-full bg-transparent border-b border-white/20 pb-3 outline-none focus:border-[#84e1ff] transition-colors placeholder:text-white/50 resize-none"
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
            href="mailto:mjrifat54@gmail.com"
            className="inline-flex items-center gap-2 text-white hover:text-[#84e1ff] transition-colors"
          >
            <Mail className="w-4 h-4" />
            mjrifat54@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
