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
  title: "Brandivibe — Premium web experiences for ambitious brands",
  description:
    "Independent design & engineering practice crafting cinematic websites for crypto, SaaS, and luxury brands. Next.js, WebGL, and obsessive attention to detail.",
  keywords: [
    "web design studio",
    "premium website development",
    "Next.js agency",
    "WebGL design",
    "crypto website design",
    "SaaS landing page",
    "creative web development",
  ],
  authors: [{ name: "Brandivibe" }],
  creator: "Brandivibe",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Brandivibe — Premium web experiences for ambitious brands",
    description:
      "Independent design & engineering practice crafting cinematic websites for crypto, SaaS, and luxury brands.",
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
    title: "Brandivibe — Premium web experiences for ambitious brands",
    description:
      "Cinematic websites for crypto, SaaS, and luxury brands. Next.js, WebGL, motion design.",
    images: ["/work/helix.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="noise">
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
