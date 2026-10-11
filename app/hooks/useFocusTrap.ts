"use client";

import { useEffect, useRef } from "react";

/**
 * Traps keyboard focus inside a modal dialog while it is open and restores
 * focus to the previously focused element on close. Returns a ref to attach
 * to the dialog element.
 */
export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const prev = document.activeElement as HTMLElement | null;

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusables = el!.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    // Move focus into the dialog on open
    const t = window.setTimeout(() => {
      const first = el.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea',
      );
      (first ?? el).focus();
    }, 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      prev?.focus?.();
    };
  }, [active]);

  return ref;
}
