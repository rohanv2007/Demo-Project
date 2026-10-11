import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f6f1e5",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: "#c93e1c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fcf9f1",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            !
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#1c1917" }}>
            FixMyCampus
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#1c1917",
            }}
          >
            See it. <span style={{ color: "#c93e1c" }}>Report it.</span>
            <br />
            Get it fixed.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              color: "#57534e",
              fontFamily: "Arial, sans-serif",
            }}
          >
            A public fix-list for campus — out in the open, where ignoring it
            is no longer an option.
          </div>
        </div>
        <div
          style={{
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#78716c",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Rajalakshmi Engineering College
        </div>
      </div>
    ),
    { ...size },
  );
}
