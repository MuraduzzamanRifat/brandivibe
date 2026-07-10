import { ImageResponse } from "next/og";

/**
 * The brand logo as a clean square PNG, for the Organization `logo` in
 * structured data (Google's knowledge panel + brand recognition want one, and
 * we had none). Also usable as a favicon source.
 *
 * The site's mark — a coral rounded square with a white "b" — centred on the
 * warm canvas. Non-/api path so robots.txt (which blocks /api/) doesn't hide
 * it from crawlers. 512x512 clears Google's 112px minimum with headroom.
 */

export const runtime = "nodejs";
export const revalidate = 604800; // a logo effectively never changes

const S = 512;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf6ef",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 340,
            height: 340,
            borderRadius: 84,
            background: "#d13000",
            color: "#ffffff",
            fontSize: 240,
            fontWeight: 700,
            fontFamily: "sans-serif",
            // Optical centring: the "b" sits slightly high without this.
            paddingBottom: 24,
          }}
        >
          b
        </div>
      </div>
    ),
    { width: S, height: S }
  );
}
