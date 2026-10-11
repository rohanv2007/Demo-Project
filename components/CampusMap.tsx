"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABEL, type Issue, type Status } from "@/lib/issues";
import { cn } from "@/lib/cn";
import StatusPill from "./StatusPill";
import UpvoteButton from "./UpvoteButton";

/* Schematic campus plan — architectural drawing style, ink on paper. */
const ZONE_RECTS: { name: string; x: number; y: number; w: number; h: number }[] = [
  { name: "Central Library", x: 430, y: 280, w: 140, h: 120 },
  { name: "CSE Block", x: 170, y: 240, w: 160, h: 120 },
  { name: "EEE Block", x: 170, y: 430, w: 160, h: 100 },
  { name: "ME Block", x: 60, y: 510, w: 160, h: 100 },
  { name: "ECE Block", x: 330, y: 130, w: 140, h: 120 },
  { name: "Admin Block", x: 640, y: 400, w: 140, h: 100 },
  { name: "Boys Hostel", x: 790, y: 180, w: 140, h: 120 },
  { name: "Food Court", x: 560, y: 480, w: 120, h: 90 },
  { name: "Canteen", x: 640, y: 560, w: 130, h: 80 },
  { name: "Bus Bay", x: 800, y: 560, w: 120, h: 90 },
  { name: "Open-air Theatre", x: 380, y: 520, w: 140, h: 90 },
  { name: "Sports Ground", x: 560, y: 60, w: 130, h: 110 },
];

const WALKWAYS = [
  "M860,600 L740,500 L640,450 L560,420 L480,380",
  "M480,380 L360,330 L290,320",
  "M480,380 L430,260 L410,250",
  "M560,480 L640,540 L690,570",
  "M710,500 L800,540 L850,570",
];

const PIN_FILL: Record<Status, string> = {
  reported: "#1d1710",
  acknowledged: "#a97a0c",
  "in-progress": "#c93e1c",
  fixed: "#2f6e4e",
};

type Filter = "all" | "open" | "fixed";

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
            viewBox="0 0 1000 700"
            className="block h-auto w-full"
            role="img"
            aria-label="Schematic campus map with issue pins"
          >
            {/* Walkways */}
            {WALKWAYS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#dcd0b4"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="2 14"
                aria-hidden="true"
              />
            ))}
            {/* Zone blocks — tap one to file a report there */}
            {ZONE_RECTS.map((z) => (
              <g
                key={z.name}
                onClick={() =>
                  router.push(`/report?zone=${encodeURIComponent(z.name)}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/report?zone=${encodeURIComponent(z.name)}`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`File a report near ${z.name}`}
                className="cursor-pointer"
              >
                <title>Report near {z.name}</title>
                <rect
                  x={z.x}
                  y={z.y}
                  width={z.w}
                  height={z.h}
                  rx="3"
                  fill="#f6f1e5"
                  stroke="#1d1710"
                  strokeWidth="1.5"
                  opacity="0.9"
                  className="transition-colors hover:fill-sand"
                />
                <text
                  x={z.x + z.w / 2}
                  y={z.y + z.h / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="15"
                  letterSpacing="2"
                  fill="#8b7f66"
                  style={{ textTransform: "uppercase", fontWeight: 600 }}
                  pointerEvents="none"
                >
                  {z.name}
                </text>
              </g>
            ))}
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
            is about it. Pins are placed at the reported zone.
          </p>
        </div>
      </div>
    </div>
  );
}
