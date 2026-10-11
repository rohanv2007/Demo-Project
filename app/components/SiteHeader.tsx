"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CommandPalette, { useCommandPalette } from "./CommandPalette";

export function PinMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#c93e1c" />
      <path
        d="M32 10c-8.8 0-15 6.4-15 14.6C17 35.4 32 54 32 54s15-18.6 15-29.4C47 16.4 40.8 10 32 10z"
        fill="#FCF9F1"
      />
      <circle cx="32" cy="24.6" r="6.2" fill="#c93e1c" />
    </svg>
  );
}

const LINKS = [
  { href: "/issues", label: "The Board" },
  { href: "/map", label: "Map" },
  { href: "/report", label: "Report" },
  { href: "/steward", label: "Stewards" },
];

function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          data-active={pathname === l.href || pathname.startsWith(l.href + "/")}
          className="u-sweep text-[13px] font-medium uppercase tracking-[0.14em] text-soot hover:text-ink"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="thin-scroll flex gap-6 overflow-x-auto border-t border-line/70 px-5 py-2.5 md:hidden"
      aria-label="Primary mobile"
    >
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          data-active={pathname === l.href || pathname.startsWith(l.href + "/")}
          className="u-sweep shrink-0 text-[12px] font-medium uppercase tracking-[0.14em] text-soot"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export default function SiteHeader() {
  const { open, setOpen } = useCommandPalette();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="FixMyCampus home">
          <PinMark />
          <span className="font-display text-[22px] font-semibold tracking-tight">
            FixMyCampus
          </span>
        </Link>
        <Suspense>
          <DesktopNav />
        </Suspense>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={() => setOpen(true)}
            className="hidden cursor-pointer items-center gap-2 rounded-[3px] border border-line bg-cream px-3 py-2 text-[12px] text-faint transition-colors hover:border-ink hover:text-ink md:inline-flex"
            aria-label="Quick navigation (Control K)"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m13.5 13.5 4 4" strokeLinecap="round" />
            </svg>
            <span className="hidden lg:inline">Jump to…</span>
            <kbd className="rounded border border-line px-1 text-[10px] font-semibold">
              ⌘K
            </kbd>
          </button>
          <Link
            href="/report"
            className="lift shrink-0 whitespace-nowrap rounded-[3px] bg-ink px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-cream md:px-4 md:py-2.5 md:text-[13px]"
          >
            Report an issue
          </Link>
        </div>
      </div>
      <Suspense>
        <MobileNav />
      </Suspense>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
