import Link from "next/link";

export default function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-[4px] border border-dashed border-faint/60 bg-cream/60 px-6 py-14 text-center">
      <p className="font-display text-2xl font-semibold tracking-tight">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-soot">{body}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="lift mt-6 inline-block rounded-[3px] bg-ink px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
