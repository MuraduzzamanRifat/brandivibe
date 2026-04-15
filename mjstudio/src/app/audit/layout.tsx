import type { Metadata } from "next";

const SITE = "https://brandivibe.com";

export const metadata: Metadata = {
  title: "Free Founder Homepage Audit — 30-Point Analysis in 90 Seconds · Brandivibe",
  description:
    "Get a free 30-point audit of your founder homepage in 90 seconds. AI-powered analysis scores your design (out of 10), identifies your tech stack, and lists the three highest-impact fixes. No signup required.",
  alternates: { canonical: "/audit" },
  openGraph: {
    title: "Free Founder Homepage Audit — 30-Point Analysis in 90 Seconds",
    description:
      "AI-powered homepage audit: design score, tech stack detection, and three actionable fixes. Takes 90 seconds. No sales call, no signup wall.",
    url: `${SITE}/audit`,
    type: "website",
    images: [{ url: `${SITE}/work/helix.jpg`, width: 1600, height: 1000 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Founder Homepage Audit in 90 Seconds",
    description:
      "Design score, tech stack, 3 fixes. AI-powered analysis of your homepage. No signup.",
    images: [`${SITE}/work/helix.jpg`],
  },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a founder homepage audit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A founder homepage audit is an automated analysis of a startup or SaaS company's homepage. It scores visual design quality (0–10), detects the tech stack, identifies conversion blockers, and surfaces the highest-impact improvements. Brandivibe's audit runs in 90 seconds and delivers a 30-point report without requiring any signup.",
      },
    },
    {
      "@type": "Question",
      name: "How does Brandivibe's homepage audit work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter your website URL and email address. The tool scrapes your homepage in real time, analyses the design and copy using the same AI engine Brandivibe uses before quoting a rebuild, then emails you a full report. The on-screen results are instant — typically 30 to 60 seconds.",
      },
    },
    {
      "@type": "Question",
      name: "Is the homepage audit free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Brandivibe homepage audit is completely free. There is no signup wall, no sales call, and no follow-up phone call. You provide your website URL and one email address, and the report is delivered immediately on screen and by email.",
      },
    },
    {
      "@type": "Question",
      name: "What does the audit check?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The audit checks 30 points across six categories: visual design quality (scored 0–10), technology stack identification, headline clarity and conversion copy, above-the-fold hierarchy, trust signals and social proof, and mobile/performance readiness. It produces a prioritised list of the three most impactful fixes.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Brandivibe charge to rebuild a homepage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brandivibe charges $35,000–$90,000 for a full founder homepage rebuild. That covers one dedicated designer, a production Next.js codebase you own outright, and a 6-week delivery timeline. There is no ongoing retainer.",
      },
    },
  ],
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      {children}
    </>
  );
}
