"use client";

import { useState } from "react";
import Link from "next/link";
import { useIssues } from "@/hooks/useIssues";
import {
  STATUSES,
  STATUS_LABEL,
  updateIssueStatus,
  type Issue,
  type Status,
} from "@/lib/issues";
import { cn } from "@/lib/cn";
import Kicker from "@/components/Kicker";
import StatusPill from "@/components/StatusPill";

const DEMO_PASSCODE = "fixit2026";
const GATE_KEY = "fixmycampus.steward.v1";

function StewardRow({ issue, onUpdated }: { issue: Issue; onUpdated: () => void }) {
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
    <div className="rounded-[4px] border border-line bg-cream p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/issues/${issue.id}`}
            className="font-display text-[19px] font-semibold leading-snug tracking-tight hover:text-signal"
          >
            {issue.title}
          </Link>
          <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-faint">
            {issue.location} · {issue.upvotes} upvotes · {issue.reporter}
          </p>
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
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Enter passcode"
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-[15px] focus:border-ink focus:outline-none"
            autoComplete="off"
          />
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
  const ordered = [...open].sort((a, b) => b.upvotes - a.upvotes);

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
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-soot">
        Highest-upvoted first — that’s the campus telling you what hurts most.
        Add a short note with every status change; it goes straight onto the
        public timeline.
      </p>

      <div className="mt-8 space-y-4">
        {ordered.map((issue) => (
          <StewardRow key={issue.id} issue={issue} onUpdated={refresh} />
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
    </div>
  );
}
