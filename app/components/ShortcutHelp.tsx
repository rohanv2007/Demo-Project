"use client";

import { useEffect, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["⌘", "K"], label: "Quick navigation palette" },
  { keys: ["/"], label: "Jump to board search" },
  { keys: ["?"], label: "Open this shortcut reference" },
  { keys: ["Esc"], label: "Close dialogs and palettes" },
  { keys: ["Space"], label: "Flip flashcard-style panels where offered" },
];

export default function ShortcutHelp() {
  const [open, setOpen] = useState(false);
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (e.key === "?" && !typing) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/45 p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={() => setOpen(false)}
    >
      <div
        ref={trapRef}
        tabIndex={-1}
        className="w-full max-w-sm rounded-[6px] border border-line bg-cream p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[20px] font-semibold tracking-tight">
            Keyboard shortcuts
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-[3px] border border-line px-2.5 py-1 text-[12px] font-semibold text-soot hover:border-ink"
            aria-label="Close"
          >
            Esc
          </button>
        </div>
        <ul className="mt-5 space-y-3">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-[14px] text-soot">{s.label}</span>
              <span className="flex shrink-0 gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="rounded-[3px] border border-line bg-paper px-2 py-1 text-[11px] font-semibold text-ink"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
