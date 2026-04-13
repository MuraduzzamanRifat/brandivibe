import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder Homepage Audit — Brandivibe",
  description:
    "Get a 30-point audit of your founder homepage in 90 seconds. Real analysis by the same engine Brandivibe uses before quoting a $35–90K rebuild. No signup wall.",
  alternates: { canonical: "/audit" },
  openGraph: {
    title: "Founder Homepage Audit — Brandivibe",
    description:
      "Real homepage audit in 90 seconds. Tech stack, design score, three things worth fixing. No sales call.",
    url: "/audit",
    type: "website",
  },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
