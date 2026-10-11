"use client";

import { cn } from "@/lib/cn";

export default function UpvoteButton({
  count,
  active,
  onToggle,
  size = "md",
}: {
  count: number;
  active: boolean;
  onToggle: () => void;
  size?: "md" | "lg";
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={active}
      aria-label={active ? "Remove your upvote" : "Upvote this issue"}
      className={cn(
        "group inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[3px] border font-semibold transition-all duration-200",
        size === "lg" ? "px-4 py-2.5 text-sm" : "px-3 py-1.5 text-[13px]",
        active
          ? "border-signal bg-signal text-cream shadow-[0_6px_16px_-8px_rgba(214,69,32,0.8)]"
          : "border-line bg-cream text-soot hover:-translate-y-0.5 hover:border-ink hover:text-ink",
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className={cn(
          "transition-transform duration-200 group-active:-translate-y-0.5",
          size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
      </svg>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
