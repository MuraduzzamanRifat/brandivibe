import type { Metadata } from "next";
import Link from "next/link";
import { WarmNav } from "@/components/warm/WarmNav";
import { WarmFooter } from "@/components/warm/WarmFooter";
import { CONTACT_EMAIL } from "@/lib/contact";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy · Brandivibe",
  description:
    "What data Brandivibe collects, why, how long we keep it, and how to have it deleted. Plain English, no legalese.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

/**
 * The footer linked here from every page and it 404'd — a broken legal link is
 * both a trust problem and a crawl error.
 *
 * Written from what the site ACTUALLY does: a contact form that stores a lead
 * in Payload, and Vercel's own request logs. Nothing is claimed that isn't
 * true — no invented cookie banner, no analytics vendor we don't run.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <WarmNav />
      <main id="main-content" tabIndex={-1} className="px-5 sm:px-8 pt-36 pb-24">
        <article className="mx-auto max-w-[760px]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-strong">
            — The legal bit, in plain English
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-[3.4rem] font-semibold tracking-tight text-balance">
            Privacy Policy
          </h1>
          <p className="mt-4 font-mono text-xs text-muted uppercase tracking-[0.16em]">
            Last updated 13 July 2026
          </p>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            We collect as little as we can get away with, we never sell it, and you can
            have it deleted by sending one email. That&apos;s the whole policy — the
            detail is below.
          </p>

          <div className="mt-12 space-y-10 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Who we are
              </h2>
              <p className="mt-3">
                Brandivibe is a digital studio operated by Muraduzzaman, based in Dhaka,
                Bangladesh, working with founders worldwide. We are the data controller for
                anything you send us. You can reach us any time at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-strong underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                What we collect
              </h2>
              <p className="mt-3">
                Only what you type into our contact form: your name, email, company (if you
                give one), the service you&apos;re interested in, and your message. If you
                email us directly, we hold that email.
              </p>
              <p className="mt-3">
                Our host (Vercel) keeps standard server logs — IP address, browser, the page
                requested — for security and reliability. We don&apos;t run advertising
                trackers, and we don&apos;t sell or share your data with anyone.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Why we have it
              </h2>
              <p className="mt-3">
                To reply to you, and to run the project if we end up working together. That
                is the only reason. We won&apos;t add you to a mailing list because you asked
                us a question.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                How long we keep it
              </h2>
              <p className="mt-3">
                Enquiries that don&apos;t turn into work are deleted within 24 months. Client
                records are kept for as long as we&apos;re working together, and for the period
                afterwards that tax and accounting rules require.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Your rights
              </h2>
              <p className="mt-3">
                You can ask us what we hold about you, ask us to correct it, or ask us to
                delete it — and we&apos;ll do it. No form, no process. Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                and say what you want.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Cookies &amp; analytics
              </h2>
              <p className="mt-3">
                We use Google Analytics to understand which pages people find useful — how
                many visitors a page gets, roughly where they came from, and what they
                clicked. It sets a cookie (<code>_ga</code>) to tell one visit from another.
                We look at it in aggregate; we&apos;re not trying to identify you, and we
                never sell or share it.
              </p>
              <p className="mt-3">
                We run no advertising or retargeting cookies. The only other storage we use
                is the strictly-necessary kind that makes the site work — and, if you log in
                to a client area, keeps you signed in.
              </p>
              <p className="mt-3">
                If you&apos;re in the UK or EU, nothing is measured until you say yes — we
                ask first, and analytics stays switched off until you accept. Everywhere
                else you can turn it off with the same banner. Changed your mind? Hit{" "}
                <strong className="font-medium text-foreground">Cookie choices</strong> at
                the bottom of any page and pick again.
              </p>
              <p className="mt-3">
                You can also opt out with Google&apos;s{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
                >
                  browser add-on
                </a>
                , or by blocking cookies in your browser — the site works perfectly well
                without them.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Who we share it with
              </h2>
              <p className="mt-3">
                The services that make the site run: Vercel (hosting) and Neon (database).
                They process data on our behalf and cannot use it for their own purposes.
              </p>
              <p className="mt-3">
                Google Analytics also processes anonymised usage data — page views and
                rough location — so we can see which pages are worth improving. Anything you
                type into a form stays between us; it is never sent to Google. Nobody else
                gets your data, and we never sell it.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Work we build for you
              </h2>
              <p className="mt-3">
                Anything we build is yours — code, files, accounts, in your name. That
                includes any data your own site or software collects. We don&apos;t keep a
                copy after handover unless you ask us to maintain it.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Questions
              </h2>
              <p className="mt-3">
                Ask a person:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
                >
                  {CONTACT_EMAIL}
                </a>
                . Or{" "}
                <Link
                  href="/contact"
                  className="font-medium text-primary-strong underline underline-offset-4 hover:text-primary-deep"
                >
                  use the form
                </Link>{" "}
                — which, yes, is the thing this policy is about.
              </p>
            </section>
          </div>
        </article>
      </main>
      <WarmFooter />
    </>
  );
}
