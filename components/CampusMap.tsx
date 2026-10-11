"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABEL, type Issue, type Status } from "@/lib/issues";
import {
  CAMPUS_BUILDINGS,
  CAMPUS_RING,
  CAMPUS_ROADS,
  CAMPUS_VIEWBOX,
  buildingBounds,
  type CampusBuilding,
} from "@/lib/campus-map";
import { cn } from "@/lib/cn";
import StatusPill from "./StatusPill";
import UpvoteButton from "./UpvoteButton";

/* The real REC campus — Rohan's own layout, ink on paper. */

const TONE_FILL: Record<string, string> = {
  building: "#fbf7ec",
  green: "#e4e9d4",
  water: "#d8e5ed",
};

const ROAD_STROKE = "#c4b795";

const PIN_FILL: Record<Status, string> = {
  reported: "#1d1710",
  acknowledged: "#a97a0c",
  "in-progress": "#c93e1c",
  fixed: "#2f6e4e",
};

type Filter = "all" | "open" | "fixed";

/** Width estimate for an uppercase semibold map label, including letter-spacing. */
function textWidth(text: string, size: number): number {
  const ls = size > 9 ? 1.5 : 0.5;
  return text.length * (size * 0.62 + ls);
}

type LabelLayout =
  | { mode: "inside"; lines: string[]; size: number; x: number; y: number }
  | { mode: "outside"; x: number; y: number };

/** Best 2-line word split minimizing the longest line's width. */
function wrapTwoLines(
  words: string[],
  size: number,
  maxW: number,
): string[] | null {
  let best: string[] | null = null;
  let bestW = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const w = Math.max(textWidth(a, size), textWidth(b, size));
    if (w <= maxW && w < bestW) {
      best = [a, b];
      bestW = w;
    }
  }
  return best;
}

/**
 * Where and how a building's name renders. Small boxes get the name
 * outside with a leader line; everything else fits inside (1 or 2 lines).
 * Text never overflows its box.
 */
function layoutLabel(b: CampusBuilding): LabelLayout {
  const bounds = buildingBounds(b);
  const cx = b.lx ?? bounds.x + bounds.w / 2;
  const cy = b.ly ?? bounds.y + bounds.h / 2;
  if (b.outside) {
    return { mode: "outside", x: cx, y: cy };
  }
  const innerW = bounds.w - 10;
  const innerH = bounds.h - 8;
  const name = b.name;
  // Single line, shrink to fit.
  for (let size = 12.5; size >= 8; size -= 0.5) {
    if (textWidth(name, size) <= innerW && size * 1.2 <= innerH) {
      return { mode: "inside", lines: [name], size, x: cx, y: cy };
    }
  }
  // Two wrapped lines, shrink to fit.
  const words = name.split(" ");
  if (words.length > 1) {
    for (let size = 11; size >= 8; size -= 0.5) {
      const lines = wrapTwoLines(words, size, innerW);
      if (lines && lines.length * size * 1.3 <= innerH) {
        return { mode: "inside", lines, size, x: cx, y: cy };
      }
    }
  }
  // Last resort: outside, below the box.
  return {
    mode: "outside",
    x: bounds.x + bounds.w / 2,
    y: bounds.y + bounds.h + 18,
  };
}

/** Nearest point on a building's bounding box to an external label anchor. */
function leaderFoot(
  bounds: { x: number; y: number; w: number; h: number },
  lx: number,
  ly: number,
): { x: number; y: number } {
  return {
    x: Math.max(bounds.x, Math.min(lx, bounds.x + bounds.w)),
    y: Math.max(bounds.y, Math.min(ly, bounds.y + bounds.h)),
  };
}

export default function CampusMap({
  issues,
  upvotedIds,
  onToggleUpvote,
}: {
  issues: Issue[];
  upvotedIds: string[];
  onToggleUpvote: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("open");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  const visible = useMemo(
    () =>
      issues.filter((i) => {
        if (filter === "open") return i.status !== "fixed";
        if (filter === "fixed") return i.status === "fixed";
        return true;
      }),
    [issues, filter],
  );

  const selected = issues.find((i) => i.id === selectedId) ?? null;

  /** Open (non-fixed) issues whose pin falls inside a building's footprint. */
  function buildingOpenCount(b: CampusBuilding): number {
    const z = buildingBounds(b);
    return issues.filter(
      (i) =>
        i.status !== "fixed" &&
        i.map.x >= z.x - 24 &&
        i.map.x <= z.x + z.w + 24 &&
        i.map.y >= z.y - 24 &&
        i.map.y <= z.y + z.h + 24,
    ).length;
  }

  function openReport(b: CampusBuilding) {
    router.push(`/report?zone=${encodeURIComponent(b.name)}`);
  }

  return (
    <div>
      {/* Filter + legend */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-[3px] border border-line bg-cream p-1 text-[13px] font-semibold">
          {(["open", "all", "fixed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setSelectedId(null);
              }}
              aria-pressed={filter === f}
              className={cn(
                "cursor-pointer rounded-[2px] px-4 py-2 capitalize transition-colors",
                filter === f ? "bg-ink text-cream" : "text-soot hover:text-ink",
              )}
            >
              {f === "open" ? "Open now" : f}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Pin legend">
          {(Object.keys(PIN_FILL) as Status[]).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: PIN_FILL[s] }}
                aria-hidden="true"
              />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Map */}
        <div className="overflow-hidden rounded-[4px] border border-line bg-cream">
          <svg
            viewBox={CAMPUS_VIEWBOX}
            className="block h-auto w-full"
            role="img"
            aria-label="REC campus map with issue pins"
          >
            {/* Ring road */}
            <rect
              x={CAMPUS_RING.x}
              y={CAMPUS_RING.y}
              width={CAMPUS_RING.w}
              height={CAMPUS_RING.h}
              rx={CAMPUS_RING.rx}
              fill="none"
              stroke={ROAD_STROKE}
              strokeWidth={CAMPUS_RING.width}
              aria-hidden="true"
            />
            {/* Roads */}
            {CAMPUS_ROADS.map((r, i) => (
              <polyline
                key={i}
                points={r.points.map((p) => p.join(",")).join(" ")}
                fill="none"
                stroke={ROAD_STROKE}
                strokeWidth={r.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
            ))}
            {/* Buildings — tap one to file a report there */}
            {CAMPUS_BUILDINGS.map((b) => {
              const label = layoutLabel(b);
              const open = buildingOpenCount(b);
              const bounds = buildingBounds(b);
              const shape =
                b.kind === "rect" ? (
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx="3"
                    fill={TONE_FILL[b.tone ?? "building"]}
                    stroke="#1d1710"
                    strokeWidth="1.5"
                    className="transition-colors hover:fill-sand"
                  />
                ) : (
                  <circle
                    cx={b.cx}
                    cy={b.cy}
                    r={b.r}
                    fill={TONE_FILL[b.tone ?? "building"]}
                    stroke="#1d1710"
                    strokeWidth="1.5"
                    className="transition-colors hover:fill-sand"
                  />
                );
              return (
                <g
                  key={b.id}
                  onClick={() => openReport(b)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openReport(b);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`File a report near ${b.name}`}
                  className="cursor-pointer"
                >
                  <title>Report near {b.name}</title>
                  {shape}
                  {label.mode === "inside" ? (
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={label.size}
                      letterSpacing={label.size > 9 ? 1.5 : 0.5}
                      fill="#8b7f66"
                      style={{ textTransform: "uppercase", fontWeight: 600 }}
                      pointerEvents="none"
                    >
                      {label.lines.map((line, i) => (
                        <tspan
                          key={i}
                          x={label.x}
                          dy={i === 0 ? -((label.lines.length - 1) * label.size * 1.3) / 2 : label.size * 1.3}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  ) : (
                    <g pointerEvents="none">
                      {(() => {
                        const foot = leaderFoot(bounds, label.x, label.y);
                        const dx = label.x - foot.x;
                        const dy = label.y - foot.y;
                        const len = Math.hypot(dx, dy) || 1;
                        const ex = label.x - (dx / len) * 8;
                        const ey = label.y - (dy / len) * 8;
                        return (
                          <>
                            <line
                              x1={foot.x}
                              y1={foot.y}
                              x2={ex}
                              y2={ey}
                              stroke="#8b7f66"
                              strokeWidth="1"
                            />
                            <circle cx={foot.x} cy={foot.y} r="2.5" fill="#8b7f66" />
                          </>
                        );
                      })()}
                      <text
                        x={label.x}
                        y={label.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9.5"
                        letterSpacing="0.8"
                        fill="#57534a"
                        style={{ textTransform: "uppercase", fontWeight: 700 }}
                      >
                        {b.name}
                      </text>
                    </g>
                  )}
                  {open > 0 && (
                    <g pointerEvents="none">
                      <circle
                        cx={bounds.x + bounds.w - 12}
                        cy={bounds.y + 12}
                        r="11"
                        fill="#c93e1c"
                      />
                      <text
                        x={bounds.x + bounds.w - 12}
                        y={bounds.y + 12}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="12"
                        fontWeight="700"
                        fill="#fcf9f1"
                      >
                        {open}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {/* Pins */}
            {visible.map((issue) => {
              const isSel = issue.id === selectedId;
              return (
                <g
                  key={issue.id}
                  transform={`translate(${issue.map.x}, ${issue.map.y})`}
                  onClick={() => setSelectedId(isSel ? null : issue.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(isSel ? null : issue.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${issue.title} — ${STATUS_LABEL[issue.status]}, ${issue.upvotes} upvotes`}
                  className="cursor-pointer"
                >
                  <title>{issue.title}</title>
                  <circle r="26" fill="transparent" />
                  {isSel && (
                    <circle
                      r="19"
                      fill="none"
                      stroke="#1d1710"
                      strokeWidth="2"
                    />
                  )}
                  <circle r="13" fill={PIN_FILL[issue.status]} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10.5"
                    fontWeight="700"
                    fill="#fcf9f1"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                    pointerEvents="none"
                  >
                    {issue.upvotes}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail card */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          {selected ? (
            <div className="rounded-[4px] border border-ink bg-cream p-6">
              <div className="flex items-center justify-between gap-3">
                <StatusPill status={selected.status} />
                <button
                  onClick={() => setSelectedId(null)}
                  className="cursor-pointer text-[12px] font-semibold uppercase tracking-[0.12em] text-faint hover:text-ink"
                  aria-label="Clear selection"
                >
                  ✕
                </button>
              </div>
              <Link
                href={`/issues/${selected.id}`}
                className="mt-3 block font-display text-[22px] font-semibold leading-snug tracking-tight hover:text-signal"
              >
                {selected.title}
              </Link>
              <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-faint">
                {selected.location}
              </p>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-soot">
                {selected.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-line/70 pt-4">
                <UpvoteButton
                  count={selected.upvotes}
                  active={upvotedIds.includes(selected.id)}
                  onToggle={() => onToggleUpvote(selected.id)}
                />
                <Link
                  href={`/issues/${selected.id}`}
                  className="u-sweep text-[12px] font-semibold uppercase tracking-[0.14em] text-soot"
                >
                  Full report →
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-[4px] border border-dashed border-faint/60 bg-cream/60 p-6 text-center">
              <p className="font-display text-[20px] font-semibold tracking-tight">
                Select a pin
              </p>
              <p className="mx-auto mt-2 max-w-[26ch] text-[14px] leading-relaxed text-soot">
                {visible.length === 0
                  ? "Nothing on the map under this filter."
                  : "Tap any numbered pin to read the report behind it."}
              </p>
            </div>
          )}
          <p className="mt-4 text-[13px] leading-relaxed text-faint">
            Numbers show upvotes — the bigger the number, the louder the campus
            is about it. Pins are placed at the reported zone. Tap any building
            to file a report there.
          </p>
        </div>
      </div>
    </div>
  );
}
