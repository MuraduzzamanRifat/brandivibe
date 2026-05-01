import type { NextConfig } from "next";

/**
 * Dual-mode build:
 *
 *   - Default (Koyeb / dev):  full Next.js server with API routes, redirects(),
 *                             dynamic SSR, image optimization.
 *   - NEXT_BUILD_TARGET=static (GitHub Pages workflow): output: "export" mode,
 *                             which requires API routes + force-dynamic to be
 *                             removed (the workflow deletes src/app/api before
 *                             building) and disables image optimization.
 *
 * The flag lets us migrate to GitHub Pages without breaking the existing
 * Koyeb deployment during the transition.
 */
const isStaticBuild = process.env.NEXT_BUILD_TARGET === "static";

const nextConfig: NextConfig = isStaticBuild
  ? {
      output: "export",
      images: { unoptimized: true },
      // Trailing slashes match GitHub Pages' file-based routing better
      // (folder/index.html vs folder.html).
      trailingSlash: true,
    }
  : {
      async redirects() {
        return [
          {
            source: "/demos",
            destination: "/portfolio",
            permanent: true,
          },
        ];
      },
      images: {
        remotePatterns: [
          // Pexels CDN — used for journal hero images and uTurn store demo imagery.
          { protocol: "https", hostname: "images.pexels.com" },
        ],
      },
    };

export default nextConfig;
