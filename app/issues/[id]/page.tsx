"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useIssues } from "@/hooks/useIssues";
import { STATUS_LABEL, daysOpen, formatDate, timeAgo, type Status } from "@/lib/issues";
import { cn } from "@/lib/cn";
import Kicker from "@/components/Kicker";
import StatusPill from "@/components/StatusPill";
import UpvoteButton from "@/components/UpvoteButton";
import IssueCard from "@/components/IssueCard";
import EmptyState from "@/components/EmptyState";
import CommentsSection from "@/components/CommentsSection";
import ShareButton from "@/components/ShareButton";

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
  const searchParams = useSearchParams();
  const [showFresh, setShowFresh] = useState(searchParams.get("fresh") === "1");
  const noPhoto = searchParams.get("nophoto") === "1";
  const { issues, upvotedIds, myIssueIds, ready, toggleUpvote, refresh } = useIssues();
  const issue = issues.find((i) => i.id === params.id);
  const openDays = issue ? daysOpen(issue) : 0;

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

  const nearby = issues
    .filter((i) => {
      if (i.id === issue.id || !i.map || !issue.map) return false;
      const dx = i.map.x - issue.map.x;
      const dy = i.map.y - issue.map.y;
      return Math.hypot(dx, dy) <= 170;
    })
    .sort((a, b) => {
      const da = Math.hypot(a.map.x - issue.map!.x, a.map.y - issue.map!.y);
      const db = Math.hypot(b.map.x - issue.map!.x, b.map.y - issue.map!.y);
      return da - db;
    })
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 md:pt-14">
      {showFresh && (
        <div
          className="mb-8 flex items-start justify-between gap-4 rounded-[4px] border border-moss/50 bg-moss/10 px-5 py-4"
          role="status"
        >
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-moss">
              Your report is live
            </p>
            <p className="mt-1 text-[14px] text-soot">
              It is on the board and on the map. Share the link to rally upvotes —
              the louder it gets, the faster it moves.
              {noPhoto && (
                <span className="mt-1 block text-ember">
                  Note: the photo could not be kept — this browser’s storage is
                  full. The report itself is safe.
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowFresh(false)}
            className="cursor-pointer shrink-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint hover:text-ink"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
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
            {myIssueIds.includes(issue.id) && (
              <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-cream">
                Your report
              </span>
            )}
          </p>

          {issue.status === "fixed" &&
            (() => {
              const ev = [...issue.timeline]
                .reverse()
                .find((t) => t.status === "fixed");
              return (
                <div className="mt-8 flex items-start gap-4 rounded-[4px] border border-moss/40 bg-moss/10 px-5 py-4">
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss text-cream"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 8.5 3.2 3.2L13 5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-moss">
                      Fixed{ev ? ` · ${formatDate(ev.at)}` : ""}
                    </p>
                    {ev?.note && (
                      <p className="mt-1 text-[14px] leading-relaxed text-soot">
                        {ev.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

          <div className="mt-8 border-t border-line pt-8">
            {issue.photo && (
              <figure className="mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.photo}
                  alt={`Photo attached to report: ${issue.title}`}
                  className="w-full rounded-[4px] border border-line object-cover"
                />
                <figcaption className="mt-2 text-[12px] uppercase tracking-[0.14em] text-faint">
                  Attached by {issue.reporter}
                </figcaption>
              </figure>
            )}
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

          <CommentsSection
            issueId={issue.id}
            initial={issue.comments}
            onChanged={refresh}
          />
        </article>

        {/* Sidebar */}
        <aside className="lg:pt-2">
          <div className="rounded-[4px] border border-line bg-cream p-6 lg:sticky lg:top-32">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Back this report
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <UpvoteButton
                size="lg"
                count={issue.upvotes}
                active={upvotedIds.includes(issue.id)}
                onToggle={() => toggleUpvote(issue.id)}
              />
              <ShareButton path={`/issues/${issue.id}`} title={issue.title} />
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
                [
                  issue.status === "fixed" ? "Days to fix" : "Days open",
                  `${openDays}d`,
                ],
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
                mine={myIssueIds.includes(s.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Nearby on the map */}
      {nearby.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-[26px] font-semibold tracking-tight">
              Nearby on the map
            </h2>
            <Link
              href="/map"
              className="u-sweep hidden shrink-0 text-[13px] font-semibold uppercase tracking-[0.14em] text-soot md:inline-block"
            >
              Open the map →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {nearby.map((s) => (
              <IssueCard
                key={s.id}
                issue={s}
                upvoted={upvotedIds.includes(s.id)}
                onToggleUpvote={toggleUpvote}
                mine={myIssueIds.includes(s.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
