import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES, boardStats, daysOpen, type Issue } from "@/lib/issues";
import { cn } from "@/lib/cn";
import Kicker from "./Kicker";

export default function StewardStats({ issues }: { issues: Issue[] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  const stats = boardStats(issues);
  const open = issues.filter((i) => i.status !== "fixed");

  const byCategory = CATEGORIES.map((c) => ({
    name: c,
    count: open.filter((i) => i.category === c).length,
  })).filter((c) => c.count > 0);
  const maxCat = Math.max(1, ...byCategory.map((c) => c.count));

  const oldest = [...open].sort((a, b) => daysOpen(b) - daysOpen(a)).slice(0, 3);

  const weekAgo = now === null ? 0 : now - 7 * 86_400_000;
  const fixedThisWeek =
    now === null
      ? 0
      : issues.filter((i) => {
          if (i.status !== "fixed") return false;
          const ev = [...i.timeline].reverse().find((t) => t.status === "fixed");
          return ev ? new Date(ev.at).getTime() >= weekAgo : false;
        }).length;

  // Median hours from "reported" to first steward response (acknowledged+).
  const firstResponseHrs = (() => {
    const ds: number[] = [];
    for (const i of issues) {
      const reported = i.timeline.find((t) => t.status === "reported");
      const first = i.timeline.find((t) => t.status !== "reported");
      if (reported && first)
        ds.push((+new Date(first.at) - +new Date(reported.at)) / 3_600_000);
    }
    if (ds.length === 0) return null;
    ds.sort((a, b) => a - b);
    const mid = ds[Math.floor(ds.length / 2)];
    return mid < 1
      ? `${Math.round(mid * 60)}m`
      : mid < 48
        ? `${Math.round(mid)}h`
        : `${(mid / 24).toFixed(1)}d`;
  })();

  return (
    <section aria-label="Steward analytics" className="mt-8">
      <Kicker>At a glance</Kicker>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Open by category */}
        <div className="rounded-[4px] border border-line bg-cream p-5 lg:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
            Open by category
          </p>
          <div className="mt-4 space-y-2.5">
            {byCategory.length === 0 && (
              <p className="text-[14px] text-soot">Queue is clear.</p>
            )}
            {byCategory.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-[13px] text-soot">
                  {c.name}
                </span>
                <div className="h-2 flex-1 rounded-full bg-sand">
                  <div
                    className="h-2 rounded-full bg-signal"
                    style={{ width: `${Math.max(6, (c.count / maxCat) * 100)}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[13px] font-semibold tabular-nums">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div className="rounded-[4px] border border-line bg-cream p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
            Throughput
          </p>
          <dl className="mt-4 space-y-3 text-[14px]">
            <div className="flex items-baseline justify-between">
              <dt className="text-soot">Fixed this week</dt>
              <dd className="font-display text-[22px] font-semibold tabular-nums">
                {fixedThisWeek}
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-soot">Avg. days to fix</dt>
              <dd className="font-display text-[22px] font-semibold tabular-nums">
                {stats.avgDaysToFix !== null ? `${stats.avgDaysToFix}d` : "–"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-soot">Still open</dt>
              <dd className="font-display text-[22px] font-semibold tabular-nums">
                {stats.open}
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-soot">Median first response</dt>
              <dd className="font-display text-[22px] font-semibold tabular-nums">
                {firstResponseHrs ?? "–"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Needs attention */}
        <div className="rounded-[4px] border border-signal/40 bg-cream p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember">
            Needs attention
          </p>
          {oldest.length === 0 ? (
            <p className="mt-4 text-[14px] text-soot">Nothing aging.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {oldest.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/issues/${i.id}`}
                    className="group block"
                  >
                    <p className="text-[14px] font-medium leading-snug group-hover:text-signal">
                      {i.title}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-[12px] font-semibold uppercase tracking-[0.1em]",
                        daysOpen(i) >= 7 ? "text-ember" : "text-faint",
                      )}
                    >
                      Open {daysOpen(i)}d · {i.upvotes} upvotes
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
