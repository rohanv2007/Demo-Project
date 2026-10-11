import Link from "next/link";
import Kicker from "@/components/Kicker";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center md:py-32">
      <Kicker className="justify-center">Lost on campus</Kicker>
      <p className="mt-6 font-display text-[88px] font-semibold leading-none tracking-tight text-signal md:text-[120px]">
        404
      </p>
      <h1 className="mt-4 font-display text-[28px] font-semibold tracking-tight">
        This page doesn’t exist — but plenty of real problems do.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-soot">
        Head back to the board and put your energy toward something that
        actually needs fixing.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/issues"
          className="lift rounded-[3px] bg-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream"
        >
          Back to the board
        </Link>
        <Link
          href="/report"
          className="lift rounded-[3px] border border-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink"
        >
          Report an issue
        </Link>
      </div>
    </div>
  );
}
