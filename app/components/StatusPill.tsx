import { STATUS_LABEL, type Status } from "@/lib/issues";
import { cn } from "@/lib/cn";

const DOT: Record<Status, string> = {
  reported: "bg-ink",
  acknowledged: "bg-gold",
  "in-progress": "bg-signal",
  fixed: "bg-moss",
};

export default function StatusPill({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-cream px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-soot",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT[status])} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}
