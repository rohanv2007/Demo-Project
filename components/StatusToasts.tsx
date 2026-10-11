"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadIssues, loadMyIssueIds, STATUS_LABEL, type Status } from "@/lib/issues";

interface Toast {
  id: number;
  issueId: string;
  title: string;
  status: Status;
  milestone?: number;
}

let toastSeq = 0;

const MILESTONES = [10, 25, 50, 100];

/**
 * Watches for status changes on the visitor's own reports (including changes
 * made in another tab, e.g. the steward console during a demo) and surfaces
 * a small toast. Auto-dismisses; never interrupts.
 */
export default function StatusToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prevRef = useRef<Map<string, Status>>(new Map());
  const votesRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    function snapshot() {
      const mine = new Set(loadMyIssueIds());
      const map = new Map<string, Status>();
      for (const i of loadIssues()) if (mine.has(i.id)) map.set(i.id, i.status);
      return { mine, map };
    }
    prevRef.current = snapshot().map;
    votesRef.current = new Map(
      loadIssues()
        .filter((i) => new Set(loadMyIssueIds()).has(i.id))
        .map((i) => [i.id, i.upvotes] as [string, number]),
    );

    function check() {
      const { map } = snapshot();
      const prev = prevRef.current;
      const prevVotes = votesRef.current;
      const fresh: Toast[] = [];
      for (const [id, status] of map) {
        const was = prev.get(id);
        if (was && was !== status) {
          const issue = loadIssues().find((i) => i.id === id);
          if (issue)
            fresh.push({ id: ++toastSeq, issueId: id, title: issue.title, status });
        }
        // Upvote milestones on your own reports
        const issue = loadIssues().find((i) => i.id === id);
        if (issue) {
          const wasVotes = prevVotes.get(id) ?? 0;
          const crossed = MILESTONES.find((m) => wasVotes < m && issue.upvotes >= m);
          if (crossed)
            fresh.push({
              id: ++toastSeq,
              issueId: id,
              title: issue.title,
              status: issue.status,
              milestone: crossed,
            });
          prevVotes.set(id, issue.upvotes);
        }
      }
      prevRef.current = map;
      if (fresh.length > 0) {
        setToasts((t) => [...t, ...fresh].slice(-3));
        for (const f of fresh)
          window.setTimeout(
            () => setToasts((t) => t.filter((x) => x.id !== f.id)),
            7000,
          );
      }
    }

    function onStorage(e: StorageEvent) {
      if (e.key === "fixmycampus.issues.v3") check();
    }
    window.addEventListener("storage", onStorage);
    // Also poll lightly in case the change came from this tab's steward flow
    const timer = window.setInterval(check, 4000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5" aria-live="polite">
      {toasts.map((t) => (
        <Link
          key={t.id}
          href={`/issues/${t.issueId}`}
          onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
          className="block rounded-[4px] border border-line bg-ink px-4 py-3.5 text-cream shadow-[0_10px_30px_rgba(20,16,10,0.3)] transition-transform hover:-translate-y-0.5"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/70">
            {t.milestone
              ? `Your report hit ${t.milestone} upvotes`
              : `Your report · ${STATUS_LABEL[t.status]}`}
          </p>
          <p className="mt-1 line-clamp-2 text-[14px] font-medium leading-snug">
            {t.title}
          </p>
        </Link>
      ))}
    </div>
  );
}
