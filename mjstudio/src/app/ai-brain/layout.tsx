import type { Metadata } from "next";
import "./ai-brain.css";

export const metadata: Metadata = {
  title: "AI Brain · Brandivibe",
  description:
    "Internal sales operations dashboard for the Brandivibe AI outreach system.",
  robots: { index: false, follow: false },
};

export default function AiBrainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="brain-root" data-theme="brain">
      {children}
    </div>
  );
}
