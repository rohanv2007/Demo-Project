"use client";

import Link from "next/link";
import { daysOpen, timeAgo, type Issue } from "@/lib/issues";
import StatusPill from "./StatusPill";
import UpvoteButton from "./UpvoteButton";

export default function IssueCard({
  issue,
  upvoted,
  onToggleUpvote,
  mine = false,
}: {
  issue: Issue;
  upvoted: boolean;
  onToggleUpvote: (id: string) => void;
  mine?: boolean;
}) {
  return (
    <Link
      href={`/issues/${issue.id}`}
      className="lift group flex flex-col rounded-[4px] border border-line bg-cream p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
          {issue.category} <span className="mx-1 text-line">·</span> {issue.location}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {mine && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cream">
              Yours
            </span>
          )}
          <StatusPill status={issue.status} />
        </div>
      </div>
      <h3 className="mt-3 font-display text-[21px] font-semibold leading-snug tracking-tight">
        {issue.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-soot">
        {issue.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-4">
        <UpvoteButton
          count={issue.upvotes}
          active={upvoted}
          onToggle={() => onToggleUpvote(issue.id)}
        />
        <span className="text-[12px] text-faint">
          {issue.reporter} · {timeAgo(issue.createdAt)}
          {issue.status !== "fixed" && (
            <span className={daysOpen(issue) >= 7 ? "font-semibold text-ember" : undefined}>
              {" "}· {daysOpen(issue)}d open
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}
