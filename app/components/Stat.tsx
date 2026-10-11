"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Big editorial number that counts up from 0 when it scrolls into view.
 * Respects reduced-motion (jumps straight to the value). Non-numeric
 * values (like "–") render as-is.
 */
export default function Stat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState<string>("0");
  const target = value.replace(/[^0-9]/g, "");
  const suffix = value.replace(/[0-9]/g, "");
  const numeric = /^\d+$/.test(target);

  useEffect(() => {
    if (!numeric || !ref.current) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const end = parseInt(target, 10);
    if (reduce || end === 0) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        const t0 = performance.now();
        const dur = 900;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(`${Math.round(eased * end)}${suffix}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, numeric, target, suffix]);

  return (
    <div ref={ref}>
      <p
        className={`font-display text-[52px] font-semibold leading-none tracking-tight tabular-nums md:text-[64px] ${
          accent ? "text-signal" : "text-ink"
        }`}
      >
        {numeric ? display : value}
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
        {label}
      </p>
    </div>
  );
}
