"use client";

import { useIssues } from "@/hooks/useIssues";
import Kicker from "@/components/Kicker";
import CampusMap from "@/components/CampusMap";

export default function MapPage() {
  const { issues, upvotedIds, ready, toggleUpvote } = useIssues();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 md:pt-16">
      <Kicker>Campus map</Kicker>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[38px] font-semibold tracking-tight md:text-[56px]">
          Where things <em className="text-signal">stand.</em>
        </h1>
        <p className="pb-2 text-[13px] uppercase tracking-[0.16em] text-faint">
          {ready ? `${issues.filter((i) => i.status !== "fixed").length} open pins` : "Loading…"}
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-soot">
        Every report, pinned where it happened. Spotted something near you?
        Tap a building to file a report there — or check whether it is already
        on the board first.
      </p>

      <div className="mt-8">
        <CampusMap
          issues={issues}
          upvotedIds={upvotedIds}
          onToggleUpvote={toggleUpvote}
        />
      </div>
    </div>
  );
}
