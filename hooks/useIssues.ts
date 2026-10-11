"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadIssues,
  loadMyIssueIds,
  loadUpvoted,
  toggleUpvote as storeToggleUpvote,
  type Issue,
} from "@/lib/issues";

/**
 * Client-side issue store backed by localStorage. Starts empty — every
 * report on the board was filed by a real user. Re-reads storage on mount
 * (SSR-safe).
 */
export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [myIssueIds, setMyIssueIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIssues(loadIssues());
    setUpvotedIds(loadUpvoted());
    setMyIssueIds(loadMyIssueIds());
    setReady(true);

    // Stay in sync when another tab changes the data (e.g. steward console
    // open alongside the board).
    function onStorage(e: StorageEvent) {
      if (
        e.key === "fixmycampus.issues.v3" ||
        e.key === "fixmycampus.upvoted.v1" ||
        e.key === "fixmycampus.my-issues.v1"
      ) {
        setIssues(loadIssues());
        setUpvotedIds(loadUpvoted());
        setMyIssueIds(loadMyIssueIds());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleUpvote = useCallback((id: string) => {
    setIssues((prev) => {
      const { issues: next, upvoted } = storeToggleUpvote(prev, id);
      setUpvotedIds(upvoted);
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    setIssues(loadIssues());
    setUpvotedIds(loadUpvoted());
    setMyIssueIds(loadMyIssueIds());
  }, []);

  return { issues, upvotedIds, myIssueIds, ready, toggleUpvote, refresh };
}
