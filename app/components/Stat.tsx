export default function Stat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p
        className={`font-display text-[52px] font-semibold leading-none tracking-tight tabular-nums md:text-[64px] ${
          accent ? "text-signal" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
        {label}
      </p>
    </div>
  );
}
