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
      // Don't advertise the stack (was "X-Powered-By: Next.js, Payload").
      poweredByHeader: false,
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
        // Optimized images are content-addressed and safe to cache for a year.
        minimumCacheTTL: 31536000,
      },
      async headers() {
        return [
          {
            // Security headers site-wide. frame-ancestors + X-Frame-Options
            // close the clickjacking gap on the Payload /admin login; the CSP
            // ships Report-Only first so it can't break the admin bundle —
            // switch the key to "Content-Security-Policy" once reports are clean.
            source: "/:path*",
            headers: [
              { key: "X-Frame-Options", value: "SAMEORIGIN" },
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              {
                key: "Permissions-Policy",
                value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
              },
              {
                key: "Strict-Transport-Security",
                value: "max-age=63072000; includeSubDomains; preload",
              },
              {
                // Google Analytics needs googletagmanager.com to load the tag and
                // google-analytics.com to beacon hits back, so both are allowlisted
                // in script-src/connect-src/img-src. Still Report-Only — flip the key
                // to "Content-Security-Policy" once the reports come back clean.
                key: "Content-Security-Policy-Report-Only",
                value:
                  "default-src 'self'; img-src 'self' data: blob: https://images.pexels.com https://*.public.blob.vercel-storage.com https://*.google-analytics.com https://*.googletagmanager.com; media-src 'self' https://*.public.blob.vercel-storage.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://*.public.blob.vercel-storage.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; worker-src 'self' blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
              },
            ],
          },
          {
            // Static media in /public is effectively immutable — cache hard.
            // (Use versioned filenames if a file's contents ever change.)
            source: "/:all*(mp4|webm|hdr|exr|avif|webp|png|jpg|jpeg|gif|svg|woff2)",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
        ];
      },
    };

// withPayload mounts the CMS admin + REST/GraphQL API and applies the
// Next config tweaks Payload needs (server externals, transpilation).
export default withPayload(nextConfig);
