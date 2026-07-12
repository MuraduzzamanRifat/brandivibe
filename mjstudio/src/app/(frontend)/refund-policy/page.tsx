import type { Metadata } from "next";
import Link from "next/link";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CONTACT_EMAIL } from "@/lib/contact";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Refunds & Cancellation · Brandivibe",
  description:
    "How deposits, staged payments, cancellation and refunds work at Brandivibe. Fixed price, no lock-in, and you keep what's been built.",
  alternates: { canonical: "/refund-policy" },
  robots: { index: true, follow: true },
};

/**
 * Also 404'd from the footer on every page.
 *
 * Everything here matches the commercial terms the site already states publicly
 * (fixed price agreed up front, staged payments, care plans cancellable any
 * time, client owns the work). No new promises are invented — a refund policy
 * that contradicts the sales copy is worse than none.
 */
export default function RefundPolicyPage() {
  return (
    <>
      <WarmNav />
      <main className="px-5 sm:px-8 pt-36 pb-24">
        <article className="mx-auto max-w-[760px]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — No small print
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-[3.4rem] font-semibold tracking-tight text-balance">
            Refunds &amp; cancellation
          </h1>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            We&apos;d rather sort a problem out than hide behind a clause. If something
            isn&apos;t right, tell us early — that&apos;s almost always fixable.
          </p>

          <div className="mt-12 space-y-10 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                How payment works
              </h2>
              <p className="mt-3">
                One fixed price, agreed in writing before anything starts. It&apos;s split
                into a deposit and staged payments tied to milestones. No hourly billing, no
                invoices that quietly grow, nothing you didn&apos;t agree to.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                The deposit
              </h2>
              <p className="mt-3">
                The deposit reserves your slot and pays for the discovery and design work
                that happens first. Once that work has started it isn&apos;t refundable —
                but you keep everything produced in it: the research, the plan, the designs.
                They&apos;re yours whether or not you continue with us.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                If you cancel mid-project
              </h2>
              <p className="mt-3">
                You can stop at any point. You pay for the work completed up to that
                milestone, and we hand over everything done so far — code, files, designs, in
                a state you or another developer can pick up. We don&apos;t hold work hostage,
                and we don&apos;t charge a cancellation penalty.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                If we cancel
              </h2>
              <p className="mt-3">
                Rare, but if we can&apos;t deliver what we promised, we refund any payment
                for work not yet done and hand over what exists. We&apos;d rather return your
                money than ship something we&apos;re not proud of.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Ongoing plans
              </h2>
              <p className="mt-3">
                Care plans and monthly marketing work run month to month. Cancel any time and
                you simply aren&apos;t billed for the next month — there&apos;s no notice
                period and no exit fee. Part-months already paid aren&apos;t refunded, because
                the work has been done.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                What we can&apos;t promise
              </h2>
              <p className="mt-3">
                We don&apos;t offer refunds based on search rankings, traffic, or revenue —
                because nobody honest can guarantee those, and we won&apos;t pretend
                otherwise. What we guarantee is the work itself: built to the scope we agreed,
                to the standard we showed you.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Something wrong?
              </h2>
              <p className="mt-3">
                Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                and you&apos;ll reach a person who can actually do something about it — not a
                ticket queue. Or{" "}
                <Link
                  href="/contact"
                  className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
                >
                  say hello here
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <WarmFooter />
    </>
  );
}
