import { ImageResponse } from "next/og";

/**
 * The icon iOS uses when someone adds the site to their home screen.
 * Apple does not apply rounding itself, so the mark is drawn on the warm
 * canvas with its own rounded square — otherwise it would be a bare coral
 * block cropped to iOS's own shape.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            width: 132,
            height: 132,
            borderRadius: 34,
            background: "#d13000",
            color: "#ffffff",
            fontSize: 94,
            fontWeight: 700,
            fontFamily: "sans-serif",
            paddingBottom: 10,
          }}
        >
          b
        </div>
      </div>
    ),
    size
  );
}
