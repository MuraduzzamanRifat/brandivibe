import { ImageResponse } from "next/og";

/**
 * The branded social-share card, generated on the fly.
 *
 * Replaces /work/helix.jpg — a portfolio DEMO screenshot that every share of
 * the site (WhatsApp, LinkedIn, Slack, X) and every AI preview was showing
 * instead of anything branded. Generating it here means no design asset to
 * maintain and it always matches the site's warm palette.
 *
 * Served at a stable, non-/api path so scrapers that honour robots.txt (which
 * disallows /api/) still fetch it. Cached hard — the card rarely changes.
 */

export const runtime = "nodejs";
export const revalidate = 86400;

const SIZE = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fbf6ef",
          // Soft coral + teal blooms — the site's calm-flowing look, static.
          backgroundImage:
            "radial-gradient(60% 60% at 12% 8%, rgba(255,106,61,0.20), transparent 60%)," +
            "radial-gradient(55% 55% at 92% 22%, rgba(15,165,152,0.16), transparent 60%)," +
            "radial-gradient(70% 70% at 78% 108%, rgba(255,106,61,0.12), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "#d13000",
              color: "#ffffff",
              fontSize: 52,
              fontWeight: 700,
            }}
          >
            b
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#2a231f" }}>Brandivibe</div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#2a231f",
              maxWidth: 900,
            }}
          >
            Websites, software, marketing &amp; AI — under one warm roof.
          </div>
          <div style={{ fontSize: 30, color: "#6f6258", maxWidth: 820 }}>
            A friendly, senior studio for growing businesses. You own everything we build.
          </div>
        </div>

        {/* Footer strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 10, width: 10, borderRadius: 10, background: "#d13000" }} />
          <div style={{ height: 10, width: 10, borderRadius: 10, background: "#0b7b71" }} />
          <div style={{ height: 10, width: 10, borderRadius: 10, background: "#9a6207" }} />
          <div style={{ fontSize: 26, color: "#6f6258", marginLeft: 12 }}>brandivibe.com</div>
        </div>
      </div>
    ),
    SIZE
  );
}
