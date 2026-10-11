"use client";

import { useEffect } from "react";
import { useIssues } from "@/hooks/useIssues";
import { timeAgo } from "@/lib/issues";

/**
 * Compact chrome-less board for embedding in other sites via iframe.
 * Hides the global header/footer with a body class; links open the full
 * site in a new tab.
 */
export default function EmbedPage() {
  const { issues, ready } = useIssues();

  useEffect(() => {
    document.body.classList.add("embed-mode");
    return () => document.body.classList.remove("embed-mode");
  }, []);

  const top = [...issues]
    .filter((i) => i.status !== "fixed")
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 6);

  const base =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-[20px] font-semibold tracking-tight">
          FixMyCampus <span className="text-faint">· live board</span>
        </p>
        <a
          href={`${base}/issues`}
          target="_blank"
          rel="noopener"
          className="text-[12px] font-semibold uppercase tracking-[0.12em] text-signal hover:underline"
        >
          Open full board →
        </a>
      </div>
      <div className="mt-4 divide-y divide-line rounded-[4px] border border-line bg-cream">
        {!ready ? (
          <p className="px-4 py-8 text-center text-[13px] text-faint">Loading…</p>
        ) : top.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-faint">
            No open reports yet — be the first to file one.
          </p>
        ) : (
          top.map((i) => (
            <a
              key={i.id}
              href={`${base}/issues/${i.id}`}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-paper"
            >
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium">{i.title}</p>
                <p className="mt-0.5 text-[12px] text-faint">
                  {i.location} · {timeAgo(i.createdAt)}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[12px] font-bold tabular-nums">
                ↑ {i.upvotes}
              </span>
            </a>
          ))
        )}
      </div>
      <p className="mt-3 text-center text-[12px] text-faint">
        Powered by FixMyCampus —{" "}
        <a
          href={`${base}/report`}
          target="_blank"
          rel="noopener"
          className="font-semibold text-signal hover:underline"
        >
          report an issue
        </a>
      </p>
    </div>
  );
}
