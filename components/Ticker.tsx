import Link from "next/link";
import type { Issue } from "@/lib/issues";

export default function Ticker({ fixed }: { fixed: Issue[] }) {
  if (fixed.length === 0) return null;
  const items = [...fixed, ...fixed]; // duplicate for a seamless loop
  return (
    <div className="overflow-hidden border-y border-ink bg-ink py-2.5 text-paper">
      <div className="marquee-track items-center gap-10 pr-10">
        {items.map((issue, i) => (
          <Link
            key={`${issue.id}-${i}`}
            href={`/issues/${issue.id}`}
            className="flex shrink-0 items-center gap-3 text-[12px] font-medium uppercase tracking-[0.14em] hover:text-signal"
            aria-hidden={i >= fixed.length}
            tabIndex={i >= fixed.length ? -1 : 0}
          >
            <span className="bg-moss px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-cream">
              Fixed
            </span>
            <span className="text-paper/85">{issue.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
