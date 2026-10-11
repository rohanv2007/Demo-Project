"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useIssues } from "@/hooks/useIssues";
import { STATUS_LABEL, formatDate, timeAgo, type Status } from "@/lib/issues";
import { cn } from "@/lib/cn";
import Kicker from "@/components/Kicker";
import StatusPill from "@/components/StatusPill";
import UpvoteButton from "@/components/UpvoteButton";
import IssueCard from "@/components/IssueCard";
import EmptyState from "@/components/EmptyState";

const URGENCY_STYLE: Record<string, string> = {
  low: "border-line text-soot",
  medium: "border-gold/60 text-gold",
  high: "border-signal/60 text-ember",
};

const TIMELINE_DOT: Record<Status, string> = {
  reported: "bg-ink",
  acknowledged: "bg-gold",
  "in-progress": "bg-signal",
  fixed: "bg-moss",
};

export default function IssueDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-soot">Loading report…</p>
        </div>
      }
    >
      <DetailInner />
    </Suspense>
  );
}

function DetailInner() {
  const params = useParams<{ id: string }>();
  const { issues, upvotedIds, ready, toggleUpvote } = useIssues();
  const issue = issues.find((i) => i.id === params.id);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-soot">Loading…</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <EmptyState
          title="That report doesn't exist."
          body="It may have been removed, or the link is wrong. The board has plenty more."
          actionHref="/issues"
          actionLabel="Back to the board"
        />
      </div>
    );
  }

  const similar = issues
    .filter((i) => i.id !== issue.id && i.category === issue.category)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 md:pt-14">
      <Link
        href="/issues"
        className="u-sweep text-[13px] font-semibold uppercase tracking-[0.14em] text-soot"
      >
        ← Back to the board
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <article>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={issue.status} />
            <span
              className={cn(
                "rounded-full border bg-cream px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                URGENCY_STYLE[issue.urgency],
              )}
            >
              {issue.urgency} priority
            </span>
          </div>
          <Kicker className="mt-6">
            {issue.category} · {issue.location}
          </Kicker>
          <h1 className="mt-3 font-display text-[34px] font-semibold leading-[1.1] tracking-tight md:text-[52px]">
            {issue.title}
          </h1>
          <p className="mt-4 text-[13px] uppercase tracking-[0.14em] text-faint">
            Reported by {issue.reporter} · {timeAgo(issue.createdAt)} ·{" "}
            {formatDate(issue.createdAt)}
          </p>

          <div className="mt-8 border-t border-line pt-8">
            {issue.description.split("\n").map((p, i) => (
              <p key={i} className="mb-4 text-[16px] leading-relaxed text-soot">
                {p}
              </p>
            ))}
          </div>

          {/* Timeline */}
          <h2 className="mt-12 font-display text-[26px] font-semibold tracking-tight">
            Public timeline
          </h2>
          <p className="mt-1 text-[14px] text-faint">
            Every status change, logged where everyone can see it.
          </p>
          <ol className="mt-6 space-y-0">
            {[...issue.timeline].reverse().map((t, i) => (
              <li key={`${t.at}-${i}`} className="relative flex gap-4 pb-8 last:pb-0">
                {i < issue.timeline.length - 1 && (
                  <span
                    className="absolute left-[5px] top-4 h-[calc(100%-12px)] w-px bg-line"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn("mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full", TIMELINE_DOT[t.status])}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em]">
                    {STATUS_LABEL[t.status]}
                    <span className="ml-2 font-normal normal-case tracking-normal text-faint">
                      {timeAgo(t.at)}
                    </span>
                  </p>
                  <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-soot">{t.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        {/* Sidebar */}
        <aside className="lg:pt-2">
          <div className="rounded-[4px] border border-line bg-cream p-6 lg:sticky lg:top-32">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Back this report
            </p>
            <div className="mt-4">
              <UpvoteButton
                size="lg"
                count={issue.upvotes}
                active={upvotedIds.includes(issue.id)}
                onToggle={() => toggleUpvote(issue.id)}
              />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-soot">
              Upvotes push an issue up the board — the loudest problems get
              fixed first.
            </p>
            <div className="cut-line my-6" />
            <dl className="space-y-3 text-[14px]">
              {[
                ["Location", issue.location],
                ["Category", issue.category],
                ["Reported by", issue.reporter],
                ["Report ID", issue.id.toUpperCase()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-faint">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-[26px] font-semibold tracking-tight">
            More in {issue.category}
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {similar.map((s) => (
              <IssueCard
                key={s.id}
                issue={s}
                upvoted={upvotedIds.includes(s.id)}
                onToggleUpvote={toggleUpvote}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
