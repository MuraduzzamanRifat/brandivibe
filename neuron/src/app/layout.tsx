import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jbm = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://neuron.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Neuron — Ship AI agents in minutes, not months",
  description:
    "The developer-first platform for building, evaluating, and deploying production-grade AI agents. TypeScript SDK, built-in observability, guardrails, and evals. 47ms p95 latency, 99.99% uptime.",
  keywords: [
    "AI agents platform",
    "LLM agents",
    "AI SDK",
    "Claude API",
    "agent framework",
    "AI evals",
    "production AI",
    "developer-first AI",
  ],
  authors: [{ name: "Neuron" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Neuron — Ship AI agents in minutes, not months",
    description:
      "Developer-first platform for production-grade AI agents. Observability, guardrails, and evals — built in.",
    siteName: "Neuron",
    images: [
      {
        url: "/og.jpg",
        width: 1600,
        height: 1000,
        alt: "Neuron — AI agent platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuron — Ship AI agents in minutes, not months",
    description:
      "Developer-first AI agent platform. Free tier with 10k runs/month.",
    images: ["/og.jpg"],
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
    <html lang="en" className={`${jakarta.variable} ${jbm.variable} antialiased`}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
