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
  title: "Brandivibe — Build a Business That Runs 24/7 With AI Automation",
  description:
    "We build conversion-focused AI-powered digital systems that make businesses look premium, rank higher, automate operations, and generate more customers. WebGL websites, SEO, AI automation, marketing strategy, custom AI agents.",
  keywords: [
    "WebGL website development",
    "AI automation systems",
    "AI agent development",
    "SEO optimization",
    "digital marketing strategy",
    "conversion-focused web design",
    "AI-powered business automation",
    "custom AI agents",
    "lead generation automation",
  ],
  authors: [{ name: "Brandivibe" }],
  creator: "Brandivibe",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Brandivibe — Build a Business That Runs 24/7 With AI Automation",
    description:
      "WebGL websites, SEO, AI automation, marketing strategy, and custom AI agents — built so your business attracts customers and scales revenue while you sleep.",
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
    title: "Brandivibe — Build a Business That Runs 24/7 With AI Automation",
    description:
      "WebGL sites, AI automation, SEO, marketing, custom AI agents. Stop being manual — your competitors aren't.",
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
        "Brandivibe builds conversion-focused AI-powered digital systems. WebGL websites, SEO optimization, AI automation systems, digital marketing strategy, and custom AI agent development for businesses ready to scale revenue without scaling headcount.",
      foundingDate: "2024",
      areaServed: "Worldwide",
      priceRange: "$$",
      knowsAbout: [
        "WebGL website development",
        "Next.js development",
        "SEO optimization",
        "AI automation systems",
        "AI agent development",
        "digital marketing strategy",
        "conversion rate optimization",
        "lead generation automation",
        "autonomous content publishing",
        "customer support AI agents",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://brandivibe.com/#website",
      url: "https://brandivibe.com",
      name: "Brandivibe",
      description: "Build a business that runs 24/7 with AI automation — for founders who want a system that attracts customers, automates operations, and scales revenue while they sleep.",
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
