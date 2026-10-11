"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useIssues } from "@/hooks/useIssues";
import { boardStats } from "@/lib/issues";
import Kicker from "@/components/Kicker";
import Stat from "@/components/Stat";
import Ticker from "@/components/Ticker";
import IssueCard from "@/components/IssueCard";
import StatusPill from "@/components/StatusPill";
import UpvoteButton from "@/components/UpvoteButton";
import OnboardingTour from "@/components/OnboardingTour";

const STEPS = [
  {
    n: "01",
    title: "Spot it",
    body: "The flickering tube light, the leaking tap, the dead Wi-Fi zone. If it bugs you every day, it bugs a hundred others too.",
  },
  {
    n: "02",
    title: "Report it in 30 seconds",
    body: "One form. No account, no login, no chain of emails. Anonymous if you prefer — the issue matters, not who filed it.",
  },
  {
    n: "03",
    title: "Rally the campus",
    body: "Fellow students upvote what hits them hardest. The board sorts itself by what the campus actually cares about.",
  },
  {
    n: "04",
    title: "Watch it get fixed",
    body: "Every status change is logged on a public timeline — acknowledged, in progress, fixed. Sunlight, applied.",
  },
];

export default function Home() {
  const { issues, upvotedIds, myIssueIds, ready, toggleUpvote } = useIssues();
  const stats = boardStats(issues);
  const fixed = issues.filter((i) => i.status === "fixed");
  const fresh = issues
    .filter((i) => i.status !== "fixed")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div>
      <OnboardingTour />
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:pb-20 md:pt-20">
        <Kicker>A public fix-list · Rajalakshmi Engineering College</Kicker>
        <h1 className="mt-6 max-w-4xl font-display text-[44px] font-semibold leading-[1.04] tracking-tight md:text-[76px]">
          See it. <em className="text-signal">Report it.</em>
          <br />
          Get it fixed.
        </h1>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-soot md:text-[18px]">
          Broken tube lights, leaking taps, dead Wi-Fi zones — post what you
          spot on campus, rally upvotes from fellow students, and watch each
          issue move from reported to fixed. Out in the open, where ignoring it
          is no longer an option.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/report"
            className="lift rounded-[3px] bg-signal px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream"
          >
            Report an issue
          </Link>
          <Link
            href="/issues"
            className="lift rounded-[3px] border border-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink"
          >
            Browse the board
          </Link>
        </div>

        {/* Stats band */}
        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4">
          <Stat value={ready ? String(stats.total) : "–"} label="Reports filed" />
          <Stat value={ready ? String(stats.fixed) : "–"} label="Fixed this term" accent />
          <Stat
            value={ready ? (stats.avgDaysToFix !== null ? `${stats.avgDaysToFix}d` : "–") : "–"}
            label="Avg. days to fix"
          />
          <Stat value={ready ? String(stats.open) : "–"} label="Open right now" />
        </div>
      </section>

      {/* ---------- Fixed ticker ---------- */}
      <Ticker fixed={fixed} />

      {/* ---------- Loudest on campus ---------- */}
      {(() => {
        const loudest = issues
          .filter((i) => i.status !== "fixed")
          .sort((a, b) => b.upvotes - a.upvotes)[0];
        if (!loudest) return null;
        return (
          <section className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
            <div className="lift rounded-[4px] border border-ink bg-cream p-6 md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Kicker>Loudest on campus right now</Kicker>
                <StatusPill status={loudest.status} />
              </div>
              <Link href={`/issues/${loudest.id}`} className="group mt-4 block">
                <h2 className="max-w-3xl font-display text-[30px] font-semibold leading-[1.12] tracking-tight group-hover:text-signal md:text-[46px]">
                  {loudest.title}
                </h2>
              </Link>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-soot md:text-[16px]">
                {loudest.description.split(".")[0]}.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <UpvoteButton
                  size="lg"
                  count={loudest.upvotes}
                  active={upvotedIds.includes(loudest.id)}
                  onToggle={() => toggleUpvote(loudest.id)}
                />
                <span className="text-[13px] uppercase tracking-[0.14em] text-faint">
                  {loudest.location} · {loudest.reporter}
                </span>
                <Link
                  href={`/issues/${loudest.id}`}
                  className="u-sweep ml-auto text-[13px] font-semibold uppercase tracking-[0.14em] text-soot"
                >
                  Read the full report →
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ---------- How it works ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Kicker>How it works</Kicker>
        <h2 className="mt-4 max-w-2xl font-display text-[32px] font-semibold leading-tight tracking-tight md:text-[44px]">
          Four steps between <em className="text-signal">“someone should…”</em>{" "}
          and <em>done</em>.
        </h2>
        <div className="mt-10 border-t border-line">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="step-row grid gap-2 border-b border-line px-2 py-7 md:grid-cols-[80px_220px_1fr] md:gap-8 md:px-4"
            >
              <p className="font-display text-[15px] italic text-faint">{s.n}</p>
              <h3 className="font-display text-[24px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="max-w-xl text-[15px] leading-relaxed text-soot">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- This week ---------- */}
      <WeekSection issues={issues} />

      {/* ---------- Fresh on the board ---------- */}
      <section className="mx-auto max-w-6xl px-5 pb-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>Fresh on the board</Kicker>
            <h2 className="mt-4 font-display text-[32px] font-semibold tracking-tight md:text-[40px]">
              Latest reports
            </h2>
          </div>
          <Link
            href="/issues"
            className="u-sweep hidden shrink-0 text-[13px] font-semibold uppercase tracking-[0.14em] text-soot md:inline-block"
          >
            View the full board →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {fresh.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              upvoted={upvotedIds.includes(issue.id)}
              onToggleUpvote={toggleUpvote}
              mine={myIssueIds.includes(issue.id)}
            />
          ))}
        </div>
        {fresh.length === 0 && (
          <div className="mt-8 rounded-[4px] border border-dashed border-faint/60 bg-cream/60 px-6 py-12 text-center">
            <p className="font-display text-[20px] font-semibold tracking-tight">
              The board is empty — for now.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-soot">
              Nothing has been reported yet. Spot something broken on campus?
              Be the first to put it on the board.
            </p>
            <Link
              href="/report"
              className="lift mt-6 inline-block rounded-[3px] bg-signal px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream"
            >
              File the first report
            </Link>
          </div>
        )}
        <Link
          href="/issues"
          className="u-sweep mt-8 inline-block text-[13px] font-semibold uppercase tracking-[0.14em] text-soot md:hidden"
        >
          View the full board →
        </Link>
      </section>

      {/* ---------- Manifesto ---------- */}
      <section className="mt-20 bg-sand/60">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <Kicker>Why this exists</Kicker>
          <blockquote className="mt-6 max-w-4xl font-display text-[28px] font-medium italic leading-[1.35] tracking-tight md:text-[44px]">
            “Every campus has a list of things everyone complains about and
            nobody files. This board turns hallway grumbling into a queue that
            can actually be worked through.”
          </blockquote>
          <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
            The FixMyCampus thesis
          </p>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="rounded-[4px] border border-ink bg-cream px-6 py-12 text-center md:py-16">
          <Kicker className="justify-center">Your turn</Kicker>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-[30px] font-semibold leading-tight tracking-tight md:text-[44px]">
            Something broken on campus right now?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-soot">
            Put it on the board. Thirty seconds, no account needed — and the
            whole campus can back you up.
          </p>
          <Link
            href="/report"
            className="lift mt-8 inline-block rounded-[3px] bg-signal px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream"
          >
            File a report
          </Link>
        </div>
      </section>
      <ContributorsStrip issues={issues} />
    </div>
  );
}

function WeekSection({ issues }: { issues: import("@/lib/issues").Issue[] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  if (now === null) return null;
  const weekAgo = now - 7 * 86_400_000;
  const fresh = issues
    .filter((i) => +new Date(i.createdAt) >= weekAgo)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const fixedThisWeek = issues.filter((i) => {
    if (i.status !== "fixed") return false;
    const ev = [...i.timeline].reverse().find((t) => t.status === "fixed");
    return ev ? +new Date(ev.at) >= weekAgo : false;
  });
  if (fresh.length === 0 && fixedThisWeek.length === 0) return null;

  return (
    <section className="border-y border-line bg-cream/60">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <Kicker>This week</Kicker>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <p className="flex items-baseline gap-3">
              <span className="font-display text-[44px] font-semibold tabular-nums">
                {fresh.length}
              </span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-faint">
                new reports
              </span>
            </p>
            <ul className="mt-4 space-y-2">
              {fresh.slice(0, 3).map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/issues/${i.id}`}
                    className="u-sweep text-[14px] font-medium"
                  >
                    {i.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-baseline gap-3">
              <span className="font-display text-[44px] font-semibold tabular-nums text-moss">
                {fixedThisWeek.length}
              </span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-faint">
                fixed
              </span>
            </p>
            <ul className="mt-4 space-y-2">
              {fixedThisWeek.slice(0, 3).map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/issues/${i.id}`}
                    className="u-sweep text-[14px] font-medium"
                  >
                    {i.title}
                  </Link>
                </li>
              ))}
              {fixedThisWeek.length === 0 && (
                <li className="text-[14px] text-faint">
                  Nothing closed yet — the queue is being worked.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContributorsStrip({ issues }: { issues: import("@/lib/issues").Issue[] }) {
  const leaders = (() => {
    const counts = new Map<string, { reports: number; upvotes: number }>();
    for (const i of issues) {
      if (i.reporter === "Anonymous") continue;
      const c = counts.get(i.reporter) ?? { reports: 0, upvotes: 0 };
      c.reports += 1;
      c.upvotes += i.upvotes;
      counts.set(i.reporter, c);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1].reports - a[1].reports || b[1].upvotes - a[1].upvotes)
      .slice(0, 5);
  })();
  if (leaders.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 md:pb-28" aria-label="Top contributors">
      <Kicker>Top contributors</Kicker>
      <h2 className="mt-4 max-w-2xl font-display text-[28px] font-semibold tracking-tight md:text-[36px]">
        The students keeping the board honest.
      </h2>
      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {leaders.map(([name, s], idx) => (
          <li
            key={name}
            className="rounded-[4px] border border-line bg-cream p-5"
          >
            <p className="font-display text-[13px] font-semibold tabular-nums text-faint">
              {String(idx + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 truncate font-display text-[17px] font-semibold tracking-tight">
              {name}
            </p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-faint">
              {s.reports} report{s.reports === 1 ? "" : "s"} · {s.upvotes} upvotes
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
