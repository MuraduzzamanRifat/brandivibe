import type { Metadata } from "next";

// Default social-share image. Sub-page templates that define their own
// `openGraph` must include `images` explicitly — Next does not merge the
// parent layout's openGraph.images into a child openGraph object, so without
// this every sub-page shipped with no og:image (text-only shares).
// A branded card generated at /brand-og (see app/(frontend)/brand-og/route.tsx),
// not a portfolio demo screenshot. Absolute URL so scrapers resolve it.
export const OG_IMAGE: NonNullable<NonNullable<Metadata["openGraph"]>["images"]> = [
  {
    url: "https://brandivibe.com/brand-og",
    width: 1200,
    height: 630,
    alt: "Brandivibe — websites, software, marketing & AI under one warm roof",
  },
];
