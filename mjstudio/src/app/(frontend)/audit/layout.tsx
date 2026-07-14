import type { Metadata } from "next";

const SITE = "https://brandivibe.com";

export const metadata: Metadata = {
  title: "Free Homepage Review for Founders — an Honest Human Look · Brandivibe",
  description:
    "Send your homepage and get a free, hand-written review from a real person — design, clarity, and the highest-impact fixes, emailed within one business day. No signup, no sales call.",
  alternates: { canonical: "/audit" },
  openGraph: {
    title: "Free Homepage Review for Founders — an Honest Human Look",
    description:
      "A real person reviews your homepage by hand and emails you a few clear fixes. No signup wall, no sales call.",
    url: `${SITE}/audit`,
    type: "website",
    images: [{ url: `${SITE}/brand-og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Homepage Review for Founders",
    description: "A hand-written homepage review, emailed within a business day. No signup.",
    images: [`${SITE}/brand-og`],
  },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Brandivibe's free homepage review?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's a free, hand-written review of a startup or founder homepage. A real person on the Brandivibe team looks at your homepage the way a visitor would, then emails you an honest write-up of the design, what's working, and the few highest-impact things to fix. There's no signup wall and no sales call.",
      },
    },
    {
      "@type": "Question",
      name: "How does the homepage review work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter your website address and email. A member of the team reviews your homepage by hand — the same once-over Brandivibe does before quoting a rebuild — and replies by email, usually within one business day. It isn't an automated tool or a score; it's a person's honest read.",
      },
    },
    {
      "@type": "Question",
      name: "Is the homepage review free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely free. There's no signup wall, no sales call, and no follow-up phone call. You give your website address and one email address, and the review comes back by email. You can unsubscribe with one click.",
      },
    },
    {
      "@type": "Question",
      name: "What does the review look at?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The review looks at your homepage across the things that actually move visitors: visual design and hierarchy, headline clarity and conversion copy, what's above the fold, trust signals, and mobile readability. You get a short, prioritised list of the changes worth making first.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Brandivibe charge to rebuild a homepage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brandivibe rebuilds founder homepages on a per-project basis. Each engagement covers one dedicated designer, a production Next.js codebase you own outright, and roughly a 6-week delivery timeline. There's no ongoing retainer. Reach out via the contact form for a tailored proposal.",
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
