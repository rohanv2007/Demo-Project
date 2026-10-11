import { cn } from "@/lib/cn";

export function SkeletonCard() {
  return (
    <div
      className="rounded-[4px] border border-line bg-cream p-5"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="h-3 w-2/3 rounded-full bg-sand" />
        <div className="h-5 w-20 rounded-full bg-sand" />
      </div>
      <div className="mt-4 h-6 w-11/12 rounded-[3px] bg-sand" />
      <div className="mt-2 h-6 w-3/5 rounded-[3px] bg-sand" />
      <div className="mt-3 h-4 w-full rounded-[3px] bg-sand/70" />
      <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-4">
        <div className="h-8 w-20 rounded-[3px] bg-sand" />
        <div className="h-3 w-28 rounded-full bg-sand" />
      </div>
    </div>
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-4 rounded-[3px] bg-sand", className)}
      aria-hidden="true"
    />
  );
}
