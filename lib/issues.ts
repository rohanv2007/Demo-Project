import {
  CAMPUS_BUILDINGS,
  buildingCenter,
} from "./campus-map";

export type Status = "reported" | "acknowledged" | "in-progress" | "fixed";

export type Category =
  | "Electrical"
  | "Plumbing"
  | "Furniture"
  | "Cleanliness"
  | "Network & IT"
  | "Safety";

export type Urgency = "low" | "medium" | "high";

export interface TimelineEvent {
  status: Status;
  note: string;
  at: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  at: string;
  steward?: boolean;
}

export interface MapPoint {
  x: number;
  y: number;
}

export interface Issue {
  id: string;
  title: string;
  category: Category;
  location: string;
  description: string;
  urgency: Urgency;
  reporter: string;
  createdAt: string;
  upvotes: number;
  status: Status;
  timeline: TimelineEvent[];
  comments: Comment[];
  map: MapPoint;
  photo?: string;
}

export const CATEGORIES: Category[] = [
  "Electrical",
  "Plumbing",
  "Furniture",
  "Cleanliness",
  "Network & IT",
  "Safety",
];

export const STATUSES: { value: Status; label: string }[] = [
  { value: "reported", label: "Reported" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "in-progress", label: "In progress" },
  { value: "fixed", label: "Fixed" },
];

export const STATUS_LABEL: Record<Status, string> = {
  reported: "Reported",
  acknowledged: "Acknowledged",
  "in-progress": "In progress",
  fixed: "Fixed",
};

/** Named campus zones — the real REC buildings, traced from Rohan's map. */
export interface CampusZone {
  name: string;
  x: number;
  y: number;
}

export const CAMPUS_ZONES: CampusZone[] = CAMPUS_BUILDINGS.map((b) => ({
  name: b.name,
  ...buildingCenter(b),
}));

export function zoneForLocation(location: string): CampusZone {
  const l = location.toLowerCase();
  const exact = CAMPUS_ZONES.find((z) => l.includes(z.name.toLowerCase()));
  if (exact) return exact;
  const hit = CAMPUS_ZONES.find((z) =>
    z.name
      .toLowerCase()
      .split(/[\s-]+/)
      .filter((w) => w.length > 3)
      .some((w) => l.includes(w)),
  );
  return hit ?? CAMPUS_ZONES[0];
}


/* ---------- persistence ---------- */

/**
 * Storage key version. Bumped to v3 when all demo seed data was removed —
 * any older cached board (v2 seed) is discarded and the board starts empty.
 */
const ISSUES_KEY = "fixmycampus.issues.v3";
const UPVOTED_KEY = "fixmycampus.upvoted.v1";
const MINE_KEY = "fixmycampus.my-issues.v1";
const STEWARD_KEY = "fixmycampus.steward.v1";

/** Wipe every FixMyCampus key from localStorage — issues, upvotes, my-issues. Steward session is kept. */
export function resetAllData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ISSUES_KEY);
  window.localStorage.removeItem(UPVOTED_KEY);
  window.localStorage.removeItem(MINE_KEY);
}

export function isStewardSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(STEWARD_KEY) === "1";
  } catch {
    return false;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Backfills fields that older stored payloads may lack. */
function normalizeIssue(i: Issue): Issue {
  const anyIssue = i as unknown as Record<string, unknown>;
  const map =
    anyIssue.map && typeof anyIssue.map === "object"
      ? (anyIssue.map as MapPoint)
      : (() => {
          const z = zoneForLocation(i.location ?? "");
          return { x: z.x, y: z.y };
        })();
  return {
    ...i,
    comments: Array.isArray(anyIssue.comments) ? (anyIssue.comments as Comment[]) : [],
    map,
  };
}

export function loadIssues(): Issue[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ISSUES_KEY);
    if (!raw) {
      window.localStorage.setItem(ISSUES_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("bad shape");
    return (parsed as Issue[]).map(normalizeIssue);
  } catch {
    return [];
  }
}

export function saveIssues(issues: Issue[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
}

export function loadUpvoted(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(UPVOTED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function loadMyIssueIds(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(MINE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveMyIssueIds(ids: string[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(MINE_KEY, JSON.stringify(ids));
}

function saveUpvoted(ids: string[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(UPVOTED_KEY, JSON.stringify(ids));
}

export function toggleUpvote(issues: Issue[], id: string): { issues: Issue[]; upvoted: string[] } {
  const upvoted = loadUpvoted();
  const has = upvoted.includes(id);
  const nextUpvoted = has ? upvoted.filter((x) => x !== id) : [...upvoted, id];
  const nextIssues = issues.map((i) =>
    i.id === id ? { ...i, upvotes: Math.max(0, i.upvotes + (has ? -1 : 1)) } : i,
  );
  saveIssues(nextIssues);
  saveUpvoted(nextUpvoted);
  return { issues: nextIssues, upvoted: nextUpvoted };
}

export interface NewIssueInput {
  title: string;
  category: Category;
  location: string;
  description: string;
  urgency: Urgency;
  reporter: string;
  zone: string;
  photo?: string;
}

function persistIssues(issues: Issue[]): void {
  saveIssues(issues);
  // Verify the write actually landed (private-mode browsers can silently drop it).
  const check = window.localStorage.getItem(ISSUES_KEY);
  if (!check) throw new Error("storage-unavailable");
}

export function addIssue(input: NewIssueInput): { issue: Issue; photoDropped: boolean } {
  const issues = loadIssues();
  const now = new Date().toISOString();
  const z =
    CAMPUS_ZONES.find((zone) => zone.name === input.zone) ??
    zoneForLocation(input.location);
  const jitter = () => (Math.random() - 0.5) * 56;
  const issue: Issue = {
    id: `iss-${Date.now().toString(36)}`,
    title: input.title.trim(),
    category: input.category,
    location: input.location.trim(),
    description: input.description.trim(),
    urgency: input.urgency,
    reporter: input.reporter.trim() || "Anonymous",
    createdAt: now,
    upvotes: 1,
    status: "reported",
    comments: [],
    photo: input.photo,
    map: {
      x: Math.round(Math.min(1160, Math.max(40, z.x + jitter()))),
      y: Math.round(Math.min(760, Math.max(40, z.y + jitter()))),
    },
    timeline: [{ status: "reported", note: `Report filed by ${input.reporter.trim() || "Anonymous"}.`, at: now }],
  };
  const next = [issue, ...issues];
  try {
    persistIssues(next);
  } catch {
    // Photo likely blew the storage quota — retry without it rather than losing the report.
    const slim: Issue = { ...issue, photo: undefined };
    persistIssues([slim, ...issues]);
    const upvoted = [...loadUpvoted(), slim.id];
    saveUpvoted(upvoted);
    saveMyIssueIds([...loadMyIssueIds(), slim.id]);
    return { issue: slim, photoDropped: true };
  }
  saveUpvoted([...loadUpvoted(), issue.id]);
  saveMyIssueIds([...loadMyIssueIds(), issue.id]);
  return { issue, photoDropped: false };
}

export function updateIssueStatus(id: string, status: Status, note: string): Issue[] {
  const issues = loadIssues();
  const now = new Date().toISOString();
  const next = issues.map((i) =>
    i.id === id
      ? {
          ...i,
          status,
          timeline: [...i.timeline, { status, note: note.trim() || STATUS_LABEL[status], at: now }],
        }
      : i,
  );
  saveIssues(next);
  return next;
}

export function addComment(
  issueId: string,
  author: string,
  text: string,
  steward = false,
): Issue[] {
  const issues = loadIssues();
  const now = new Date().toISOString();
  const next = issues.map((i) =>
    i.id === issueId
      ? {
          ...i,
          comments: [
            ...(i.comments ?? []),
            {
              id: `cmt-${Date.now().toString(36)}`,
              author: author.trim() || "Anonymous",
              text: text.trim(),
              steward,
              at: now,
            },
          ],
        }
      : i,
  );
  saveIssues(next);
  return next;
}

/* ---------- derived ---------- */

export interface BoardStats {
  total: number;
  fixed: number;
  open: number;
  avgDaysToFix: number | null;
}

export function boardStats(issues: Issue[]): BoardStats {
  const fixed = issues.filter((i) => i.status === "fixed");
  const durations = fixed
    .map((i) => {
      const start = new Date(i.createdAt).getTime();
      const endEvent = [...i.timeline].reverse().find((t) => t.status === "fixed");
      if (!endEvent) return null;
      const end = new Date(endEvent.at).getTime();
      return (end - start) / 86_400_000;
    })
    .filter((d): d is number => d !== null && d >= 0);
  return {
    total: issues.length,
    fixed: fixed.length,
    open: issues.length - fixed.length,
    avgDaysToFix: durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null,
  };
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ---------- engagement ---------- */

/** Whole days an issue has been (or was) open. */
export function daysOpen(issue: Issue): number {
  const start = new Date(issue.createdAt).getTime();
  const endEvent =
    issue.status === "fixed"
      ? [...issue.timeline].reverse().find((t) => t.status === "fixed")
      : undefined;
  const end = endEvent ? new Date(endEvent.at).getTime() : Date.now();
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

const STOP_WORDS = new Set([
  "the", "a", "an", "in", "on", "of", "to", "for", "and", "is", "are",
  "it", "this", "that", "with", "at", "by", "from", "as", "be", "has",
  "have", "was", "were", "or", "not", "but", "they", "their", "them",
  "we", "you", "your", "our", "its", "my", "an",
]);

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w)),
  );
}

/**
 * Finds existing issues that look like duplicates of a draft title,
 * using cosine similarity over keyword tokens. Used on the report form
 * to nudge reporters toward upvoting instead of re-filing.
 */
export function findSimilarIssues(query: string, issues: Issue[], limit = 2): Issue[] {
  const q = tokens(query);
  if (q.size === 0) return [];
  return issues
    .map((i) => {
      const t = tokens(`${i.title} ${i.location} ${i.category}`);
      if (t.size === 0) return { i, score: 0 };
      const inter = [...q].filter((w) => t.has(w)).length;
      return { i, score: inter / Math.sqrt(q.size * t.size) };
    })
    .filter((x) => x.score > 0.22)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.i);
}

export interface StrengthBreakdown {
  score: number;
  photo: number;
  detail: number;
  backing: number;
  corroborated: number;
  fresh: number;
}

/**
 * Transparent report-strength score (0–100): how actionable a report is.
 * Photo evidence, descriptive detail, community backing, nearby corroborating
 * reports, and recency each contribute up to 20 points. The breakdown is
 * shown in the UI so the number is explainable, never a black box.
 */
export function reportStrength(issue: Issue, all: Issue[]): StrengthBreakdown {
  const photo = issue.photo ? 20 : 0;
  const words = issue.description.trim().split(/\s+/).length;
  const detail = Math.min(20, Math.round((words / 60) * 20));
  const backing = Math.min(20, Math.round(Math.log10(1 + issue.upvotes) * 20));
  const nearby = all.filter(
    (o) =>
      o.id !== issue.id &&
      o.category === issue.category &&
      Math.hypot(o.map.x - issue.map.x, o.map.y - issue.map.y) < 160,
  ).length;
  const corroborated = Math.min(20, nearby * 10);
  const daysOld = (Date.now() - +new Date(issue.createdAt)) / 86_400_000;
  const fresh = daysOld <= 3 ? 20 : daysOld <= 14 ? 12 : daysOld <= 60 ? 6 : 2;
  const score = photo + detail + backing + corroborated + fresh;
  return { score, photo, detail, backing, corroborated, fresh };
}
