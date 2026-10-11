"use client";

import { useState } from "react";
import Link from "next/link";
import { useIssues } from "@/hooks/useIssues";
import {
  STATUSES,
  STATUS_LABEL,
  CATEGORIES,
  daysOpen,
  timeAgo,
  updateIssueStatus,
  type Category,
  type Issue,
  type Status,
} from "@/lib/issues";
import { cn } from "@/lib/cn";
import { issuesToCsv, downloadCsv } from "@/lib/csv";
import Kicker from "@/components/Kicker";
import StatusPill from "@/components/StatusPill";
import StewardStats from "@/components/StewardStats";

const DEMO_PASSCODE = "fixit2026";
const GATE_KEY = "fixmycampus.steward.v1";

function StewardRow({
  issue,
  onUpdated,
  selected,
  onToggleSelect,
}: {
  issue: Issue;
  onUpdated: () => void;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function advance(status: Status) {
    if (status === issue.status) return;
    setBusy(true);
    updateIssueStatus(issue.id, status, note);
    setNote("");
    onUpdated();
    setBusy(false);
  }

  return (
    <div
      className={cn(
        "rounded-[4px] border bg-cream p-5 transition-colors",
        selected ? "border-signal" : "border-line",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            aria-label={`Select report: ${issue.title}`}
            className="mt-1.5 h-4 w-4 shrink-0 cursor-pointer accent-[#c93e1c]"
          />
          <div className="min-w-0">
          <Link
            href={`/issues/${issue.id}`}
            className="font-display text-[19px] font-semibold leading-snug tracking-tight hover:text-signal"
          >
            {issue.title}
          </Link>
          <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-faint">
            {issue.location} · {issue.upvotes} upvotes · {issue.reporter}
            <span
              className={cn(
                "ml-2 font-bold",
                daysOpen(issue) >= 7 ? "text-ember" : "text-faint",
              )}
            >
              · {daysOpen(issue)}d open
            </span>
          </p>
          <p className="mt-2 line-clamp-2 max-w-2xl text-[14px] leading-relaxed text-soot">
            {issue.description}
          </p>
          </div>
        </div>
        <StatusPill status={issue.status} />
      </div>
      <div className="mt-4 flex flex-col gap-2.5 md:flex-row">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Status note — e.g. “Electrician assigned, parts on order”"
          className="flex-1 rounded-[3px] border border-line bg-paper px-3.5 py-2.5 text-[14px] placeholder:text-faint/70 focus:border-ink focus:outline-none"
          maxLength={140}
        />
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              disabled={busy || s.value === issue.status}
              onClick={() => advance(s.value)}
              className={cn(
                "cursor-pointer rounded-[3px] border px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all disabled:cursor-default disabled:opacity-35",
                s.value === issue.status
                  ? "border-ink bg-ink text-cream"
                  : "border-line hover:border-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StewardPage() {
  const { issues, ready, refresh } = useIssues();
  const [authed, setAuthed] = useState(
    () => typeof window !== "undefined" && window.sessionStorage.getItem(GATE_KEY) === "1",
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [queueCategory, setQueueCategory] = useState<Category | "all">("all");
  const [staleOnly, setStaleOnly] = useState(false);

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function bulkSet(status: Status) {
    for (const id of selectedIds) updateIssueStatus(id, status, "Bulk update");
    setSelectedIds([]);
    refresh();
  }

  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === DEMO_PASSCODE) {
      window.sessionStorage.setItem(GATE_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-5 pb-8 pt-16 md:pt-24">
        <Kicker>Steward access</Kicker>
        <h1 className="mt-4 font-display text-[34px] font-semibold tracking-tight">
          For the people who <em className="text-signal">fix things.</em>
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-soot">
          Stewards — estate office staff, wardens, lab in-charges — update
          statuses here. Every change lands on the issue’s public timeline.
        </p>
        <form
          onSubmit={unlock}
          className={cn(
            "mt-8 rounded-[4px] border border-line bg-cream p-6",
            error && "animate-[shake_0.3s_ease]",
          )}
        >
          <label htmlFor="passcode" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            Steward passcode
          </label>
          <input
            id="passcode"
            type={showCode ? "text" : "password"}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Enter passcode"
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-[15px] focus:border-ink focus:outline-none"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            className="u-sweep mt-3 cursor-pointer text-[12px] font-semibold uppercase tracking-[0.12em] text-faint"
            aria-label={showCode ? "Hide passcode" : "Show passcode"}
          >
            {showCode ? "Hide" : "Show"}
          </button>
          {error && (
            <p className="mt-2 text-[13px] font-medium text-ember">
              That passcode didn’t work. Try again.
            </p>
          )}
          <button
            type="submit"
            className="lift mt-4 w-full cursor-pointer rounded-[3px] bg-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream"
          >
            Unlock console
          </button>
          <p className="mt-4 border-t border-dashed border-line pt-4 text-[13px] text-faint">
            Demonstration build — the steward passcode is{" "}
            <code className="rounded bg-sand px-1.5 py-0.5 font-mono text-[12px] text-ink">
              {DEMO_PASSCODE}
            </code>
          </p>
        </form>
        <style>{`@keyframes shake { 25% { transform: translateX(-4px);} 75% { transform: translateX(4px);} }`}</style>
      </div>
    );
  }

  const open = issues.filter((i) => i.status !== "fixed");
  const done = issues.filter((i) => i.status === "fixed");
  const q = query.trim().toLowerCase();
  const ordered = [...open]
    .filter(
      (i) =>
        (queueCategory === "all" || i.category === queueCategory) &&
        (!staleOnly || daysOpen(i) >= 7) &&
        (!q ||
          `${i.title} ${i.location} ${i.category} ${i.reporter}`
            .toLowerCase()
            .includes(q)),
    )
    .sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-8 pt-12 md:pt-16">
      <Kicker>Steward console</Kicker>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[38px] font-semibold tracking-tight md:text-[52px]">
          Work the <em className="text-signal">queue.</em>
        </h1>
        <p className="pb-2 text-[13px] uppercase tracking-[0.16em] text-faint">
          {ready ? `${open.length} open · ${done.length} fixed` : "Loading…"}
        </p>
        <button
          onClick={() =>
            downloadCsv(
              `fixmycampus-queue-${new Date().toISOString().slice(0, 10)}.csv`,
              issuesToCsv(issues),
            )
          }
          className="u-sweep cursor-pointer pb-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-soot"
        >
          Export CSV ↓
        </button>
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-soot">
        Highest-upvoted first — that’s the campus telling you what hurts most.
        Add a short note with every status change; it goes straight onto the
        public timeline.
      </p>

      <StewardStats issues={issues} />

      <div className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block max-w-md flex-1">
            <span className="sr-only">Search the queue</span>
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
              placeholder="Search the queue…"
              className="w-full rounded-[3px] border border-line bg-cream py-2.5 pl-11 pr-4 text-[14px] placeholder:text-faint/70 focus:border-ink focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-[13px] font-medium text-soot">
            <span className="sr-only">Filter by category</span>
            <select
              value={queueCategory}
              onChange={(e) => setQueueCategory(e.target.value as Category | "all")}
              className="cursor-pointer rounded-[3px] border border-line bg-cream px-3 py-2.5 text-[14px] focus:border-ink focus:outline-none"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => setStaleOnly((v) => !v)}
            aria-pressed={staleOnly}
            className={cn(
              "cursor-pointer rounded-[3px] border px-3 py-2.5 text-[13px] font-semibold transition-colors",
              staleOnly
                ? "border-ember bg-ember text-cream"
                : "border-line bg-cream text-soot hover:border-ember",
            )}
          >
            Needs attention (7+ days)
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-[4px] border border-ink bg-ink px-4 py-3 text-cream">
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">
              {selectedIds.length} selected
            </span>
            <span className="text-cream/40">·</span>
            <span className="text-[12px] text-cream/70">Move all to:</span>
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => bulkSet(s.value)}
                className="cursor-pointer rounded-[3px] border border-cream/30 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-cream hover:text-ink"
              >
                {s.label}
              </button>
            ))}
            <button
              onClick={() => setSelectedIds([])}
              className="ml-auto cursor-pointer text-[12px] font-semibold text-cream/70 underline-offset-4 hover:text-cream hover:underline"
            >
              Clear
            </button>
          </div>
        )}
        {ordered.length === 0 && (
          <p className="rounded-[4px] border border-dashed border-faint/60 bg-cream/60 px-5 py-10 text-center text-[14px] text-soot">
            {q ? "No queue items match that search." : "The queue is clear."}
          </p>
        )}
        {ordered.map((issue) => (
          <StewardRow
            key={issue.id}
            issue={issue}
            onUpdated={refresh}
            selected={selectedIds.includes(issue.id)}
            onToggleSelect={() => toggleSelect(issue.id)}
          />
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-[24px] font-semibold tracking-tight">
            Recently fixed
          </h2>
          <div className="mt-4 space-y-2">
            {done.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="flex items-center justify-between gap-4 rounded-[3px] border border-line bg-cream/60 px-4 py-3 text-[14px] hover:border-ink"
              >
                <span className="truncate font-medium">{issue.title}</span>
                <StatusPill status={issue.status} className="shrink-0" />
              </Link>
            ))}
          </div>
        </>
      )}

      <ActivityFeed issues={issues} />
    </div>
  );
}

function ActivityFeed({ issues }: { issues: Issue[] }) {
  const events = issues
    .flatMap((i) =>
      i.timeline.map((t) => ({ issue: i, event: t })),
    )
    .sort((a, b) => +new Date(b.event.at) - +new Date(a.event.at))
    .slice(0, 8);

  return (
    <section aria-label="Recent activity" className="mt-12">
      <h2 className="font-display text-[24px] font-semibold tracking-tight">
        Recent activity
      </h2>
      <p className="mt-1 text-[14px] text-faint">
        Every status change across the board, newest first.
      </p>
      <ol className="mt-6 divide-y divide-line border-y border-line">
        {events.map(({ issue, event }, idx) => (
          <li key={`${issue.id}-${event.at}-${idx}`}>
            <Link
              href={`/issues/${issue.id}`}
              className="group flex items-baseline justify-between gap-4 px-2 py-3.5 transition-colors hover:bg-cream"
            >
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium group-hover:text-signal">
                  {issue.title}
                </p>
                <p className="mt-0.5 truncate text-[13px] text-faint">
                  {event.note}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-[12px] uppercase tracking-[0.12em] text-faint sm:inline">
                  {STATUS_LABEL[event.status]}
                </span>
                <span className="text-[12px] tabular-nums text-faint">
                  {timeAgo(event.at)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
