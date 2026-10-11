"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export default function ShareButton({ path, title }: { path: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}${path}`;
    // Native share sheet on mobile — falls back to clipboard copy.
    if (navigator.share) {
      try {
        await navigator.share({ title: title ?? "FixMyCampus", url });
        return;
      } catch {
        /* user dismissed — stay quiet */
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-live="polite"
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-[3px] border px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors",
        copied
          ? "border-moss bg-moss text-cream"
          : "border-line bg-cream text-soot hover:border-ink hover:text-ink",
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6.5 9.5 9.5 6.5M7 4H4.5A1.5 1.5 0 0 0 3 5.5v6A1.5 1.5 0 0 0 4.5 13h6a1.5 1.5 0 0 0 1.5-1.5V9M9 3h4v4" />
      </svg>
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
