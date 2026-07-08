import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
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

// Warm, characterful display face — used for headings only. Distinct from
// the cold neutral sans; carries the friendly personality.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const SITE_URL = "https://brandivibe.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Brandivibe — Friendly Digital Studio: Web, Software, Marketing & AI",
  // ≤160 chars so it never truncates in SERPs.
  description:
    "A friendly digital studio for growing businesses — websites, software, marketing, design, and AI automation. Senior work, and you own everything we build.",
  authors: [{ name: "Brandivibe" }],
  creator: "Brandivibe",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Brandivibe — Friendly Digital Studio: Web, Software, Marketing & AI",
    description:
      "Websites, software, marketing, content, design, and AI — made by a small, senior team that enjoys the work. Premium quality, none of the corporate coldness.",
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
    title: "Brandivibe — Friendly Digital Studio: Web, Software, Marketing & AI",
    description:
      "Websites, software, marketing, content, design, and AI — a friendly senior studio for growing businesses. You own everything we build.",
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
        "Brandivibe is a friendly digital studio founded in 2024 by Muraduzzaman, based in Dhaka, Bangladesh, working with founders worldwide. Services span web development, custom software, digital marketing, creative content, design, and AI automation — senior work with full client ownership of everything built.",
      founder: {
        "@type": "Person",
        name: "Muraduzzaman",
        url: "https://brandivibe.com/about",
        jobTitle: "Founder & Lead Engineer",
      },
      foundingDate: "2024",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
      areaServed: "Worldwide",
      priceRange: "$$",
      email: "hello@brandivibe.com",
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@brandivibe.com",
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English"],
      },
      knowsAbout: [
        "web development",
        "Next.js development",
        "WebGL and 3D web experiences",
        "custom software development",
        "SEO and answer engine optimization",
        "digital marketing strategy",
        "creative content and design",
        "AI automation systems",
        "AI agent development",
        "conversion rate optimization",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://brandivibe.com/#website",
      url: "https://brandivibe.com",
      name: "Brandivibe",
      description:
        "Everything a growing business needs online, under one warm roof — websites, software, marketing, content, design, and AI automation from a friendly senior studio.",
      publisher: { "@id": "https://brandivibe.com/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
      </head>
      <body className="grain">
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
