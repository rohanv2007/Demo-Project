"use client";

import Link from "next/link";
import { PinMark } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <PinMark className="h-8 w-8" />
              <span className="font-display text-2xl font-semibold tracking-tight">
                FixMyCampus
              </span>
            </div>
            <p className="mt-4 font-display text-xl italic leading-snug text-paper/80">
              “Sunlight is the best disinfectant — especially for a flickering
              tube light in Room 204.”
            </p>
          </div>
          <nav className="flex gap-8 text-[13px] font-medium uppercase tracking-[0.14em]" aria-label="Footer">
            <Link href="/issues" className="text-paper/70 transition-colors hover:text-paper">
              The Board
            </Link>
            <Link href="/map" className="text-paper/70 transition-colors hover:text-paper">
              Map
            </Link>
            <Link href="/report" className="text-paper/70 transition-colors hover:text-paper">
              Report
            </Link>
            <Link href="/steward" className="text-paper/70 transition-colors hover:text-paper">
              Stewards
            </Link>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-paper/15 pt-6 text-[13px] text-paper/55 md:flex-row md:items-center md:justify-between">
          <p>
            A demonstration of what campus transparency could look like — built
            for the students of Rajalakshmi Engineering College.
          </p>
          <div className="flex items-center gap-5">
            <p className="font-display italic">See it. Report it. Get it fixed.</p>
          <p className="text-paper/40">
            Press{" "}
            <kbd className="rounded border border-paper/25 px-1.5 py-0.5 font-mono text-[11px] text-paper/70">
              ?
            </kbd>{" "}
            anywhere for keyboard shortcuts
          </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
