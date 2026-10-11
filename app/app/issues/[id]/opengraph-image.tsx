import { ImageResponse } from "next/og";
import { seedIssues, STATUS_LABEL, type Status } from "@/lib/issues";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STATUS_COLOR: Record<Status, string> = {
  reported: "#1c1917",
  acknowledged: "#a97a0c",
  "in-progress": "#c93e1c",
  fixed: "#2f6e4e",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = seedIssues().find((i) => i.id === id);
  const title = issue?.title ?? "Campus issue";
  const status: Status = issue?.status ?? "reported";
  const meta = issue
    ? `${issue.category} · ${issue.location} · ${issue.upvotes} upvotes`
    : "FixMyCampus";

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
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "#c93e1c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fcf9f1",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            !
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#1c1917" }}>
              FixMyCampus
            </div>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#78716c",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {meta}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1,
              color: "#1c1917",
            }}
          >
            {title.length > 90 ? `${title.slice(0, 90)}…` : title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 24,
              fontFamily: "Arial, sans-serif",
              fontWeight: 700,
              color: STATUS_COLOR[status],
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: STATUS_COLOR[status],
              }}
            />
            {STATUS_LABEL[status].toUpperCase()}
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
          See it. Report it. Get it fixed.
        </div>
      </div>
    ),
    { ...size },
  );
}
