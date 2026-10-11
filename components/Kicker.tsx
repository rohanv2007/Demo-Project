export default function Kicker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint ${className}`}
    >
      <span className="inline-block h-[7px] w-[7px] bg-signal" aria-hidden="true" />
      {children}
    </p>
  );
}
