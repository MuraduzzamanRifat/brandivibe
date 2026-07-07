import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Pin the workspace root to THIS project. There's a stray package-lock.json one
// directory up (H:\VS Code File\) that otherwise makes Turbopack infer the wrong root.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

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
      turbopack: { root: projectRoot },
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

// withPayload mounts the CMS admin + REST/GraphQL API and applies the
// Next config tweaks Payload needs (server externals, transpilation).
export default withPayload(nextConfig);
