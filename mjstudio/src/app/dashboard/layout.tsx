import type { Metadata } from "next";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Dashboard · Brandivibe",
  description:
    "Internal sales operations dashboard for the Brandivibe AI outreach system.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="brain-root" data-theme="brain">
      {children}
    </div>
  );
}
