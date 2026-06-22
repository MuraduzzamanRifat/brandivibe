import type { Metadata } from "next";

// Keep the admin panel out of search + AI indexes. It's an unlinked,
// token-gated tool — not part of the public site.
export const metadata: Metadata = {
  title: "Admin · Brandivibe",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
