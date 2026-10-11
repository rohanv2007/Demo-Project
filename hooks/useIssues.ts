"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadIssues,
  loadUpvoted,
  toggleUpvote as storeToggleUpvote,
  type Issue,
} from "@/lib/issues";

/**
 * Client-side issue store backed by localStorage, seeded with realistic
 * campus reports on first run. Re-reads storage on mount (SSR-safe).
 */
export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIssues(loadIssues());
    setUpvotedIds(loadUpvoted());
    setReady(true);
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
  }, []);

  return { issues, upvotedIds, ready, toggleUpvote, refresh };
}
