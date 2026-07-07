import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

const display = Space_Grotesk({
  variable: "--font-ironwood-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  variable: "--font-ironwood-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ironwood — Drop 07 · Spring Chapter · Brandivibe",
  description:
    "A drop-model streetwear Shopify store. Limited-run releases, waitlist mechanics, editorial lookbook. An ecommerce concept study by Brandivibe.",
  alternates: { canonical: "/ironwood" },
  openGraph: {
    title: "Ironwood — Drop 07 · Spring Chapter",
    description: "Drop-model streetwear Shopify storefront concept by Brandivibe.",
    url: "/ironwood",
    type: "website",
  },
};

export default function IronwoodLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${display.variable} ${sans.variable}`} data-theme="ironwood">
      {children}
    </div>
  );
}
