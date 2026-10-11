"use client";

import { useMemo, useState } from "react";
import { useIssues } from "@/hooks/useIssues";
import {
  CATEGORIES,
  STATUSES,
  type Category,
  type Status,
} from "@/lib/issues";
import { cn } from "@/lib/cn";
import Kicker from "@/components/Kicker";
import IssueCard from "@/components/IssueCard";
import EmptyState from "@/components/EmptyState";

type Sort = "top" | "new";

export default function BoardPage() {
  const { issues, upvotedIds, ready, toggleUpvote } = useIssues();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<Sort>("top");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = issues.filter((i) => {
      if (status !== "all" && i.status !== status) return false;
      if (category !== "all" && i.category !== category) return false;
      if (
        q &&
        !`${i.title} ${i.description} ${i.location} ${i.category}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "top"
        ? b.upvotes - a.upvotes || +new Date(b.createdAt) - +new Date(a.createdAt)
        : +new Date(b.createdAt) - +new Date(a.createdAt),
    );
    return list;
  }, [issues, query, status, category, sort]);

  const openCount = issues.filter((i) => i.status !== "fixed").length;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 md:pt-16">
      <Kicker>The board</Kicker>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[38px] font-semibold tracking-tight md:text-[56px]">
          Every open issue, <em className="text-signal">in one place.</em>
        </h1>
        <p className="pb-2 text-[13px] uppercase tracking-[0.16em] text-faint">
          {ready ? `${filtered.length} shown · ${openCount} still open` : "Loading…"}
        </p>
      </div>

      {/* Search + sort */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search issues</span>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m13.5 13.5 4 4" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try “wifi”, “hostel”, “projector”…"
            className="w-full rounded-[3px] border border-line bg-cream py-3 pl-11 pr-4 text-[15px] placeholder:text-faint/70 focus:border-ink focus:outline-none"
          />
        </label>
        <div className="flex rounded-[3px] border border-line bg-cream p-1 text-[13px] font-semibold">
          {(["top", "new"] as Sort[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "cursor-pointer rounded-[2px] px-4 py-2 transition-colors",
                sort === s ? "bg-ink text-cream" : "text-soot hover:text-ink",
              )}
            >
              {s === "top" ? "Most upvoted" : "Newest"}
            </button>
          ))}
        </div>
      </div>

      {/* Status filter */}
      <div className="thin-scroll mt-4 flex gap-2 overflow-x-auto pb-1">
        {[{ value: "all" as const, label: "All" }, ...STATUSES].map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value as Status | "all")}
            className={cn(
              "shrink-0 cursor-pointer rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-all",
              status === s.value
                ? "border-ink bg-ink text-cream"
                : "border-line bg-cream text-soot hover:border-ink",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="thin-scroll mt-2 flex gap-2 overflow-x-auto pb-1">
        {(["all", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c as Category | "all")}
            className={cn(
              "shrink-0 cursor-pointer rounded-[3px] border px-3.5 py-1.5 text-[12px] font-medium transition-all",
              category === c
                ? "border-signal bg-signal text-cream"
                : "border-line bg-transparent text-soot hover:border-soot",
            )}
          >
            {c === "all" ? "All categories" : c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8">
        {filtered.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                upvoted={upvotedIds.includes(issue.id)}
                onToggleUpvote={toggleUpvote}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={ready ? "Nothing matches those filters." : "Loading the board…"}
            body="Try widening the search — or be the first to report what you're looking for."
            actionHref="/report"
            actionLabel="Report it instead"
          />
        )}
      </div>
    </div>
  );
}
