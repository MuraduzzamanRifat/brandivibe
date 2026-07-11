import { ImageResponse } from "next/og";

/**
 * The browser tab icon. Replaces Next's stock favicon.ico, which was still
 * shipping — the site was showing the framework's default icon in every tab
 * and bookmark.
 *
 * Next's `icon` file convention generates and wires the <link rel="icon">
 * automatically. Drawn rather than shipped as a binary so it always matches
 * the brand tokens.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#d13000",
          borderRadius: 14,
          color: "#ffffff",
          fontSize: 46,
          fontWeight: 700,
          fontFamily: "sans-serif",
          // Optical centring — the "b" sits high without this.
          paddingBottom: 5,
        }}
      >
        b
      </div>
    ),
    size
  );
}
