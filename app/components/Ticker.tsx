import Link from "next/link";
import type { Issue } from "@/lib/issues";

export default function Ticker({ fixed }: { fixed: Issue[] }) {
  if (fixed.length === 0) return null;
  const items = fixed.slice(0, 4);
  return (
    <section aria-label="Recently fixed" className="border-y border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:gap-8">
        <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-paper/60">
          Recently fixed
        </p>
        <ul className="flex flex-1 flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-x-8">
          {items.map((issue) => (
            <li key={issue.id} className="min-w-0">
              <Link
                href={`/issues/${issue.id}`}
                className="group flex items-baseline gap-2.5 text-[13px]"
              >
                <span className="shrink-0 bg-moss px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cream">
                  Fixed
                </span>
                <span className="truncate text-paper/85 transition-colors group-hover:text-paper">
                  {issue.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
