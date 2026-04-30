import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://brandivibe.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Brandivibe — Websites that close $25K deals on sight",
  description:
    "Premium 3D web design for seed → Series A founders. $5K–$25K builds, 6-week delivery, and an autonomous AI brain that writes content, sources prospects, and runs cold outreach for you.",
  keywords: [
    "premium web design for startups",
    "3D website design",
    "founder homepage rebuild",
    "Next.js design studio",
    "high-conversion landing page",
    "Shopify storefront design",
    "AI-powered marketing for startups",
  ],
  authors: [{ name: "Brandivibe" }],
  creator: "Brandivibe",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Brandivibe — Websites that close $25K deals on sight",
    description:
      "Premium 3D web design ($5K–$25K) plus an autonomous AI growth engine for content, leads, and cold outreach. Built for seed → Series A founders.",
    siteName: "Brandivibe",
    images: [
      {
        url: "/work/helix.jpg",
        width: 1600,
        height: 1000,
        alt: "Brandivibe — selected work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandivibe — Websites that close $25K deals on sight",
    description:
      "Premium 3D web design + AI growth engine. $5K–$25K builds, 6-week delivery.",
    images: ["/work/helix.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://brandivibe.com/#organization",
      name: "Brandivibe",
      url: "https://brandivibe.com",
      description:
        "Premium 3D web design studio building $5K–$25K founder homepages in 6 weeks. Pairs every Next.js build with an autonomous AI brain for content publishing, prospect sourcing, and cold outreach.",
      foundingDate: "2024",
      areaServed: "Worldwide",
      priceRange: "$$",
      knowsAbout: [
        "premium web design for startups",
        "Next.js development",
        "3D and WebGL websites",
        "Shopify storefront design",
        "founder homepage rebuilds",
        "website conversion optimization",
        "AI-powered cold outreach",
        "autonomous content marketing",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://brandivibe.com/#website",
      url: "https://brandivibe.com",
      name: "Brandivibe",
      description: "Websites that close $25K deals on sight — for founders who want a homepage that sells while they sleep.",
      publisher: { "@id": "https://brandivibe.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://brandivibe.com/journal?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
      </head>
      <body className="noise">
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
