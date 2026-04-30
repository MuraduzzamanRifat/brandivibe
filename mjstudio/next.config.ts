import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // Without this entry, next/image refuses to optimize the URLs.
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
