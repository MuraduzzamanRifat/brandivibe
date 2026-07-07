import type { Metadata } from "next";
import { Clock, MessageCircle, CalendarCheck } from "lucide-react";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { WarmContact } from "@/components/warm/WarmContact";

export const metadata: Metadata = {
  title: "Book a Free Call — Contact Brandivibe",
  description:
    "Tell us about your project and book a free, no-pressure call. Friendly reply within a day — honest advice, a clear plan, and a fixed quote before anything starts.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Book a free call · Brandivibe",
    description:
      "Tell us about your project — we reply within a day with honest advice and times for a free call.",
    url: "/contact",
    type: "website",
  },
};

const STEPS = [
  {
    icon: MessageCircle,
    title: "Tell us what you're working on",
    body: "Use the form below — a couple of sentences is plenty. No brief required, no jargon needed.",
  },
  {
    icon: Clock,
    title: "We reply within a day",
    body: "A real person (not an autoresponder) reads it and comes back with honest first thoughts and a few times for a call.",
  },
  {
    icon: CalendarCheck,
    title: "A free call — then a clear plan",
    body: "We talk through your goals, and if we're a good fit you get a clear plan and a fixed quote. No pressure either way.",
  },
];

export default function ContactPage() {
  return (
    <>
      <WarmNav />
      <main>
        <section className="pt-36 pb-8 px-5 sm:px-8">
          <div className="mx-auto max-w-[900px] text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">— Let&apos;s talk</p>
            <h1 className="mt-4 font-display text-5xl md:text-6xl font-semibold tracking-tight text-balance">
              Book your free call.
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-[52ch] mx-auto leading-relaxed text-pretty">
              Tell us about your project below. We reply within a day with honest thoughts and times
              for a free, no-pressure call — even if the honest answer is that you don&apos;t need us yet.
            </p>
          </div>
        </section>

        <section className="px-5 sm:px-8 py-8">
          <div className="mx-auto max-w-[1000px] grid gap-5 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.title} className="card-soft p-6 text-left">
                <s.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <h2 className="mt-4 font-display text-lg font-semibold">{s.title}</h2>
                <p className="mt-2 text-foreground/70 leading-relaxed text-[0.95rem]">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The real form (shared component, includes reassurance + booking button when configured) */}
        <WarmContact />
      </main>
      <WarmFooter />
    </>
  );
}
