import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://helix.finance";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Helix — Institutional-grade liquid staking for Ethereum",
  description:
    "Stake ETH. Earn real yield. Stay liquid. Non-custodial liquid staking audited by Trail of Bits, OpenZeppelin & Certora. $4.8B TVL, 184K stakers, 4.82% APY.",
  keywords: [
    "liquid staking",
    "ETH staking",
    "DeFi protocol",
    "Ethereum",
    "non-custodial staking",
    "hxETH",
    "real yield",
  ],
  authors: [{ name: "Helix Protocol" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Helix — Institutional-grade liquid staking for Ethereum",
    description:
      "Stake ETH. Earn real yield. Stay liquid. $4.8B TVL, audited by Trail of Bits & OpenZeppelin.",
    siteName: "Helix",
    images: [
      {
        url: "/og.jpg",
        width: 1600,
        height: 1000,
        alt: "Helix — liquid staking protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Helix — Liquid staking for Ethereum",
    description: "Stake ETH. Earn real yield. Stay liquid. $4.8B TVL.",
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
    <html lang="en" className={`${orbitron.variable} ${exo2.variable} antialiased`}>
      <body className="noise">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
