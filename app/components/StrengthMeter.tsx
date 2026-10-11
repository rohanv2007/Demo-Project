"use client";

import { useState } from "react";
import { reportStrength, type Issue } from "@/lib/issues";
import { cn } from "@/lib/cn";

/**
 * Explainable report-strength meter: 0–100 score with a hover/tap breakdown
 * of exactly what feeds it. Never a black box.
 */
export default function StrengthMeter({
  issue,
  all,
}: {
  issue: Issue;
  all: Issue[];
}) {
  const [open, setOpen] = useState(false);
  const b = reportStrength(issue, all);
  const rows: [string, number][] = [
    ["Photo evidence", b.photo],
    ["Descriptive detail", b.detail],
    ["Community backing", b.backing],
    ["Nearby corroboration", b.corroborated],
    ["Recency", b.fresh],
  ];

  return (
    <div className="no-print">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
          Report strength
        </span>
        <span className="font-display text-[22px] font-semibold tabular-nums">
          {b.score}
          <span className="text-[13px] font-normal text-faint">/100</span>
        </span>
      </button>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
        role="img"
        aria-label={`Report strength ${b.score} out of 100`}
      >
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-500"
          style={{ width: `${b.score}%` }}
        />
      </div>
      {open && (
        <ul className="mt-3 space-y-1.5 border-t border-dashed border-line pt-3">
          {rows.map(([label, pts]) => (
            <li key={label} className="flex items-center justify-between text-[13px]">
              <span className="text-soot">{label}</span>
              <span className={cn("font-semibold tabular-nums", pts > 0 ? "text-ink" : "text-faint")}>
                +{pts}
              </span>
            </li>
          ))}
          <li className="pt-1 text-[12px] leading-relaxed text-faint">
            Stronger reports get fixed faster — add a photo or more detail to
            raise the score.
          </li>
        </ul>
      )}
    </div>
  );
}
