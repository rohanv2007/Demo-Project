"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useIssues } from "@/hooks/useIssues";
import {
  CATEGORIES,
  STATUSES,
  daysOpen,
  type Category,
  type Status,
} from "@/lib/issues";
import { cn } from "@/lib/cn";
import Kicker from "@/components/Kicker";
import IssueCard from "@/components/IssueCard";
import EmptyState from "@/components/EmptyState";
import { SkeletonCard } from "@/components/Skeleton";

type Sort = "top" | "new" | "oldest" | "recent-fixed";

const SORT_LABELS: { value: Sort; label: string }[] = [
  { value: "top", label: "Most upvoted" },
  { value: "new", label: "Newest" },
  { value: "oldest", label: "Oldest open" },
  { value: "recent-fixed", label: "Recently fixed" },
];

export default function BoardPage() {
  const { issues, upvotedIds, myIssueIds, ready, toggleUpvote } = useIssues();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<Sort>("top");
  const [mineOnly, setMineOnly] = useState(false);
  const [backedOnly, setBackedOnly] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to jump to search.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = issues.filter((i) => {
      if (mineOnly && !myIssueIds.includes(i.id)) return false;
      if (backedOnly && !upvotedIds.includes(i.id)) return false;
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
    list = [...list].sort((a, b) => {
      if (sort === "top")
        return b.upvotes - a.upvotes || +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sort === "new") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sort === "oldest") return daysOpen(b) - daysOpen(a);
      const aFixed = [...a.timeline].reverse().find((t) => t.status === "fixed");
      const bFixed = [...b.timeline].reverse().find((t) => t.status === "fixed");
      return (
        (bFixed ? +new Date(bFixed.at) : 0) - (aFixed ? +new Date(aFixed.at) : 0)
      );
    });
    return list;
  }, [issues, query, status, category, sort, mineOnly, backedOnly, myIssueIds, upvotedIds]);

  const openCount = issues.filter((i) => i.status !== "fixed").length;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 md:pt-16">
      <Kicker>The board</Kicker>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[38px] font-semibold tracking-tight md:text-[56px]">
          Every open issue, <em className="text-signal">in one place.</em>
        </h1>
        <div className="flex items-center gap-4 pb-2">
          <Link
            href="/map"
            className="u-sweep text-[13px] font-semibold uppercase tracking-[0.14em] text-soot"
          >
            Map view →
          </Link>
          <p className="flex items-center gap-3 text-[13px] uppercase tracking-[0.16em] text-faint">
          {ready ? `${filtered.length} shown · ${openCount} still open` : "Loading…"}
          {(query || status !== "all" || category !== "all" || mineOnly || backedOnly) && (
            <button
              onClick={() => {
                setQuery("");
                setStatus("all");
                setCategory("all");
                setMineOnly(false);
                setBackedOnly(false);
              }}
              className="cursor-pointer normal-case tracking-normal text-signal hover:text-ember"
            >
              Clear filters
            </button>
          )}
        </p>
        </div>
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
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try “wifi”, “hostel”, “projector”…  ( / )"
            className="w-full rounded-[3px] border border-line bg-cream py-3 pl-11 pr-4 text-[15px] placeholder:text-faint/70 focus:border-ink focus:outline-none"
          />
        </label>
        <div className="thin-scroll flex overflow-x-auto rounded-[3px] border border-line bg-cream p-1 text-[13px] font-semibold">
          {SORT_LABELS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={cn(
                "cursor-pointer whitespace-nowrap rounded-[2px] px-4 py-2 transition-colors",
                sort === s.value ? "bg-ink text-cream" : "text-soot hover:text-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        {myIssueIds.length > 0 && (
          <button
            onClick={() => setMineOnly((v) => !v)}
            aria-pressed={mineOnly}
            className={cn(
              "cursor-pointer whitespace-nowrap rounded-[3px] border px-4 py-2 text-[13px] font-semibold transition-colors",
              mineOnly
                ? "border-signal bg-signal text-cream"
                : "border-line bg-cream text-soot hover:border-ink",
            )}
          >
            My reports ({myIssueIds.length})
          </button>
        )}
        {upvotedIds.length > 0 && (
          <button
            onClick={() => setBackedOnly((v) => !v)}
            aria-pressed={backedOnly}
            className={cn(
              "cursor-pointer whitespace-nowrap rounded-[3px] border px-4 py-2 text-[13px] font-semibold transition-colors",
              backedOnly
                ? "border-signal bg-signal text-cream"
                : "border-line bg-cream text-soot hover:border-ink",
            )}
          >
            Backed by you ({upvotedIds.length})
          </button>
        )}
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
        {!ready ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                upvoted={upvotedIds.includes(issue.id)}
                onToggleUpvote={toggleUpvote}
                mine={myIssueIds.includes(issue.id)}
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
