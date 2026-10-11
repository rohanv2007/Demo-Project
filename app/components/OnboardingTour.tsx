"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const TOUR_KEY = "fixmycampus.tour.v1";

const STEPS = [
  {
    kicker: "Welcome",
    title: "This is your campus fix-list.",
    body: "Every broken thing on campus — tube lights, taps, Wi-Fi dead zones — gets reported here, in the open, where it can actually be worked through.",
    cta: { href: "/issues", label: "Browse the board" },
  },
  {
    kicker: "Step 1 of 3",
    title: "Spot something broken?",
    body: "File a report in 30 seconds. No account, no login, no chain of emails. Anonymous if you prefer — the issue matters, not who filed it.",
    cta: { href: "/report", label: "File a report" },
  },
  {
    kicker: "Step 2 of 3",
    title: "Back what matters to you.",
    body: "Upvote the issues that hit you hardest. The board sorts itself by what the campus actually cares about — and every fix is logged publicly.",
    cta: { href: "/map", label: "See the map" },
  },
];

export default function OnboardingTour() {
  const [step, setStep] = useState<number | null>(null);
  const trapRef = useFocusTrap(step !== null);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(TOUR_KEY)) setStep(0);
    } catch {
      /* private mode — skip tour */
    }
  }, []);

  useEffect(() => {
    if (step === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [step]);

  function dismiss() {
    try {
      window.localStorage.setItem(TOUR_KEY, "1");
    } catch {
      /* ignore */
    }
    setStep(null);
  }

  if (step === null) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/45 p-5 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Quick tour"
      onClick={dismiss}
    >
      <div
        ref={trapRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-[6px] border border-line bg-cream p-7 shadow-[0_18px_50px_rgba(20,16,10,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-signal">
          {s.kicker}
        </p>
        <h2 className="mt-3 font-display text-[26px] font-semibold leading-tight tracking-tight">
          {s.title}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-soot">{s.body}</p>

        <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all",
                i === step ? "w-7 bg-signal" : "w-3 bg-line",
              )}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={dismiss}
            className="cursor-pointer text-[13px] font-semibold text-faint underline-offset-4 hover:text-ink hover:underline"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="cursor-pointer rounded-[3px] border border-line bg-paper px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-soot transition-colors hover:border-ink"
              >
                Back
              </button>
            )}
            {last ? (
              <Link
                href={s.cta.href}
                onClick={dismiss}
                className="rounded-[3px] bg-ink px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-soot"
              >
                {s.cta.label}
              </Link>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className="cursor-pointer rounded-[3px] bg-ink px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-soot"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
