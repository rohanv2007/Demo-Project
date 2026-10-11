import { STATUSES, STATUS_LABEL, type Status } from "@/lib/issues";
import { cn } from "@/lib/cn";

/**
 * Visual 4-stage pipeline answering "what's happening with my issue right
 * now?" — completed stages are solid, the current stage pulses gently
 * (collapses to static under reduced motion), upcoming stages are hollow.
 */
export default function StatusStepper({ status }: { status: Status }) {
  const currentIdx = STATUSES.findIndex((s) => s.value === status);

  return (
    <ol
      className="mt-6 flex items-center"
      aria-label={`Progress: ${STATUS_LABEL[status]}`}
    >
      {STATUSES.map((s, i) => {
        const done = i < currentIdx;
        const current = i === currentIdx;
        return (
          <li key={s.value} className={cn("flex items-center", i < STATUSES.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-[13px] font-bold tabular-nums",
                  done && "border-moss bg-moss text-cream",
                  current && "border-signal bg-signal text-cream",
                  !done && !current && "border-line bg-paper text-faint",
                )}
                aria-hidden="true"
              >
                {done ? (
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m3.5 8.5 3.5 3.5 5.5-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px]",
                  current ? "text-ink" : done ? "text-moss" : "text-faint",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STATUSES.length - 1 && (
              <span
                className={cn(
                  "mx-1 mb-7 h-0.5 flex-1 rounded sm:mx-2",
                  i < currentIdx ? "bg-moss" : "bg-line",
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
