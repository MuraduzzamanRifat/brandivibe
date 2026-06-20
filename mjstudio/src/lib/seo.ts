import type { Metadata } from "next";

// Default social-share image. Sub-page templates that define their own
// `openGraph` must include `images` explicitly — Next does not merge the
// parent layout's openGraph.images into a child openGraph object, so without
// this every sub-page shipped with no og:image (text-only shares).
export const OG_IMAGE: NonNullable<NonNullable<Metadata["openGraph"]>["images"]> = [
  {
    url: "/work/helix.jpg",
    width: 1600,
    height: 1000,
    alt: "Brandivibe — premium WebGL sites, SEO & AI automation",
  },
];
