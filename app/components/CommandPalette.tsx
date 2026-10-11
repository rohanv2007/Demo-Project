"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useIssues } from "@/hooks/useIssues";
import { cn } from "@/lib/cn";
import StatusPill from "./StatusPill";
const PAGES = [
  { href: "/issues", label: "The Board", hint: "Browse every report" },
  { href: "/map", label: "Campus Map", hint: "Reports by location" },
  { href: "/report", label: "File a Report", hint: "30 seconds, no account" },
  { href: "/steward", label: "Steward Console", hint: "For the fixers" },
];

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { issues } = useIssues();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open ]);

  const q = query.trim().toLowerCase();
  const matchedIssues = useMemo(() => {
    if (!q) return [];
    return issues
      .filter((i) =>
        `${i.title} ${i.location} ${i.category}`.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [issues, q]);

  const matchedPages = PAGES.filter(
    (p) =>
      !q ||
      p.label.toLowerCase().includes(q) ||
      p.hint.toLowerCase().includes(q),
  );

  const total = matchedPages.length + matchedIssues.length;

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (total === 0 ? 0 : (a + 1) % total));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (total === 0 ? 0 : (a - 1 + total) % total));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const all = [...matchedPages.map((p) => p.href), ...matchedIssues.map((i) => `/issues/${i.id}`)];
      if (all[active]) go(all[active]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Quick navigation"
    >
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-[6px] border border-ink bg-cream shadow-[0_24px_60px_-24px_rgba(29,23,16,0.5)]">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m13.5 13.5 4 4" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page or report…"
            className="w-full bg-transparent py-4 text-[15px] placeholder:text-faint/70 focus:outline-none"
            aria-label="Quick navigation search"
          />
          <kbd className="shrink-0 rounded-[3px] border border-line px-1.5 py-0.5 text-[11px] font-semibold text-faint">
            ESC
          </kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {total === 0 && (
            <p className="px-4 py-8 text-center text-[14px] text-faint">
              Nothing found for “{query}”.
            </p>
          )}
          {matchedPages.length > 0 && (
            <div>
              <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
                Pages
              </p>
              {matchedPages.map((p, i) => (
                <button
                  key={p.href}
                  onClick={() => go(p.href)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-[3px] px-3 py-2.5 text-left",
                    active === i ? "bg-sand" : "bg-transparent",
                  )}
                >
                  <span className="text-[14px] font-semibold">{p.label}</span>
                  <span className="text-[12px] text-faint">{p.hint}</span>
                </button>
              ))}
            </div>
          )}
          {matchedIssues.length > 0 && (
            <div className={matchedPages.length > 0 ? "mt-2" : ""}>
              <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
                Reports
              </p>
              {matchedIssues.map((issue, j) => {
                const idx = matchedPages.length + j;
                return (
                  <button
                    key={issue.id}
                    onClick={() => go(`/issues/${issue.id}`)}
                    onMouseEnter={() => setActive(idx)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-[3px] px-3 py-2.5 text-left",
                      active === idx ? "bg-sand" : "bg-transparent",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium">
                        {issue.title}
                      </span>
                      <span className="block truncate text-[12px] text-faint">
                        {issue.location}
                      </span>
                    </span>
                    <StatusPill status={issue.status} className="shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 border-t border-line px-5 py-2.5 text-[11px] text-faint">
          <span>
            <kbd className="rounded border border-line px-1">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded border border-line px-1">↵</kbd> open
          </span>
          <span>
            <kbd className="rounded border border-line px-1">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
