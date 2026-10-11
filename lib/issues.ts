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

const SEED: Issue[] = [
  {
    id: "iss-wifi-library",
    title: "Wi-Fi dead zone on the library's second floor",
    category: "Network & IT",
    location: "Central Library, 2nd Floor",
    description:
      "The entire second-floor reading hall has had no usable Wi-Fi for four days. Pages barely load and the login portal loops forever. With CAT 2 exams starting 22 October, the reading hall is packed every evening and nobody can pull up NPTEL videos or course material. The ground floor works fine, so this looks like a dead access point, not a campus-wide outage.",
    urgency: "high",
    reporter: "Divya S",
    createdAt: "2026-10-09T09:14:00+05:30",
    upvotes: 61,
    status: "reported",
    timeline: [
      { status: "reported", note: "Report filed by Divya S.", at: "2026-10-09T09:14:00+05:30" },
    ],
  },
  {
    id: "iss-streetlight-busbay",
    title: "Streetlight out on the walkway to the bus bay",
    category: "Safety",
    location: "Walkway to the bus bay",
    description:
      "The middle lamp on the walkway to the bus bay has been dark for a week. After 6:30 PM the stretch is pitch black, and with buses leaving till late evening, a lot of students — especially first-years — walk it alone. This is a safety issue, not a cosmetic one.",
    urgency: "high",
    reporter: "Anonymous",
    createdAt: "2026-10-07T19:42:00+05:30",
    upvotes: 54,
    status: "acknowledged",
    timeline: [
      { status: "reported", note: "Report filed anonymously.", at: "2026-10-07T19:42:00+05:30" },
      {
        status: "acknowledged",
        note: "Estate office confirmed the fitting is faulty; replacement requisition raised.",
        at: "2026-10-08T11:05:00+05:30",
      },
    ],
  },
  {
    id: "iss-tubelight-204",
    title: "Tube lights flickering non-stop in CSE Block, Room 204",
    category: "Electrical",
    location: "CSE Block, Room 204",
    description:
      "Two of the four tube lights in Room 204 have been flickering since last week. It's genuinely hard to sit through a full lecture — a few of us have started getting headaches by the afternoon. The room hosts back-to-back classes every day, so this affects close to 200 students a week.",
    urgency: "high",
    reporter: "Arun K",
    createdAt: "2026-10-08T10:02:00+05:30",
    upvotes: 48,
    status: "in-progress",
    timeline: [
      { status: "reported", note: "Report filed by Arun K.", at: "2026-10-08T10:02:00+05:30" },
      {
        status: "acknowledged",
        note: "Electrician assigned. Spare tubes requisitioned from stores.",
        at: "2026-10-09T09:30:00+05:30",
      },
      {
        status: "in-progress",
        note: "Replacement tubes have arrived; fitting scheduled between class hours.",
        at: "2026-10-10T15:20:00+05:30",
      },
    ],
  },
  {
    id: "iss-cn-lab-pcs",
    title: "Six systems in the CN lab won't boot past BIOS",
    category: "Network & IT",
    location: "CN Lab, CSE Block (Ground Floor)",
    description:
      "Systems 14 through 19 in the Computer Networks lab get stuck at the BIOS screen and never reach the OS. Lab sessions now run with students doubled up on the working machines, which makes the practicals nearly impossible to follow. Reported to the lab in-charge twice already with no movement.",
    urgency: "high",
    reporter: "Karthik M",
    createdAt: "2026-10-08T14:26:00+05:30",
    upvotes: 44,
    status: "in-progress",
    timeline: [
      { status: "reported", note: "Report filed by Karthik M.", at: "2026-10-08T14:26:00+05:30" },
      {
        status: "acknowledged",
        note: "Systems team confirms CMOS battery failures on all six units.",
        at: "2026-10-09T12:10:00+05:30",
      },
      {
        status: "in-progress",
        note: "Replacement batteries ordered; technician visit scheduled.",
        at: "2026-10-10T10:45:00+05:30",
      },
    ],
  },
  {
    id: "iss-cooler-foodcourt",
    title: "Drinking water cooler leaking near the food court",
    category: "Plumbing",
    location: "Food court entrance",
    description:
      "The water cooler right at the food court entrance has been leaking from its base for days. There's a permanent puddle around it now — slippery, and right where the lunch crowd queues. Someone's going to slip if this sits through another week.",
    urgency: "medium",
    reporter: "Meera R",
    createdAt: "2026-10-05T13:18:00+05:30",
    upvotes: 35,
    status: "acknowledged",
    timeline: [
      { status: "reported", note: "Report filed by Meera R.", at: "2026-10-05T13:18:00+05:30" },
      {
        status: "acknowledged",
        note: "Plumber inspected; inlet valve needs replacement.",
        at: "2026-10-06T10:22:00+05:30",
      },
    ],
  },
  {
    id: "iss-mosquito-canteen",
    title: "Stagnant water breeding mosquitoes behind the canteen",
    category: "Cleanliness",
    location: "Canteen backyard",
    description:
      "Water collects behind the canteen after every rain and just sits there. The mosquito problem in the evening has gotten noticeably worse over the last two weeks. The seating area behind the canteen is basically unusable after 5 PM now.",
    urgency: "medium",
    reporter: "Anonymous",
    createdAt: "2026-10-03T17:55:00+05:30",
    upvotes: 27,
    status: "reported",
    timeline: [
      { status: "reported", note: "Report filed anonymously.", at: "2026-10-03T17:55:00+05:30" },
    ],
  },
  {
    id: "iss-desk-112",
    title: "Broken desks in Tutorial Room 112",
    category: "Furniture",
    location: "EEE Block, Room 112",
    description:
      "Four desks in Room 112 have cracked writing surfaces and wobbly legs. Two of them are genuinely unsafe to lean on. The room is used for tutorial batches of 30, so a seventh of the class is perched on broken furniture every session.",
    urgency: "medium",
    reporter: "Priya D",
    createdAt: "2026-10-02T11:36:00+05:30",
    upvotes: 22,
    status: "in-progress",
    timeline: [
      { status: "reported", note: "Report filed by Priya D.", at: "2026-10-02T11:36:00+05:30" },
      {
        status: "acknowledged",
        note: "Carpentry team confirmed four desks need full replacement.",
        at: "2026-10-04T09:15:00+05:30",
      },
      {
        status: "in-progress",
        note: "New desks sanctioned; delivery expected this week.",
        at: "2026-10-09T16:40:00+05:30",
      },
    ],
  },
  {
    id: "iss-dustbin-admin",
    title: "Dustbins overflowing behind the admin block",
    category: "Cleanliness",
    location: "Behind Admin Block",
    description:
      "The bins behind the admin block haven't been cleared in days — waste is spilling onto the walkway. It's the first thing visitors see when they come for admissions enquiries. Not a great look for the college.",
    urgency: "low",
    reporter: "Ravi T",
    createdAt: "2026-10-10T08:50:00+05:30",
    upvotes: 12,
    status: "reported",
    timeline: [
      { status: "reported", note: "Report filed by Ravi T.", at: "2026-10-10T08:50:00+05:30" },
    ],
  },
  {
    id: "iss-bench-oat",
    title: "Benches broken in the open-air theatre",
    category: "Furniture",
    location: "Open-air theatre",
    description:
      "Three of the concrete benches in the open-air theatre have cracked through. They're still being used because there's nowhere else to sit during club events, but the cracks are widening every week.",
    urgency: "low",
    reporter: "Vikram S",
    createdAt: "2026-10-06T18:12:00+05:30",
    upvotes: 9,
    status: "reported",
    timeline: [
      { status: "reported", note: "Report filed by Vikram S.", at: "2026-10-06T18:12:00+05:30" },
    ],
  },
  {
    id: "iss-fan-wobble",
    title: "Ceiling fan wobbling dangerously in ME tutorial room",
    category: "Safety",
    location: "ME Block, Tutorial Room 3",
    description:
      "The ceiling fan in Tutorial Room 3 wobbles visibly at full speed — you can see the whole mounting shake. Everyone just avoids sitting under it, which tells you everything about how safe it feels.",
    urgency: "high",
    reporter: "Sanjay P",
    createdAt: "2026-09-21T10:30:00+05:30",
    upvotes: 41,
    status: "fixed",
    timeline: [
      { status: "reported", note: "Report filed by Sanjay P.", at: "2026-09-21T10:30:00+05:30" },
      {
        status: "acknowledged",
        note: "Marked urgent. Electrician dispatched the same day.",
        at: "2026-09-21T14:05:00+05:30",
      },
      {
        status: "in-progress",
        note: "Fan taken down; mounting found to be loose.",
        at: "2026-09-22T09:40:00+05:30",
      },
      {
        status: "fixed",
        note: "New fan installed and mounting re-anchored. Verified steady at all speeds.",
        at: "2026-09-25T11:15:00+05:30",
      },
    ],
  },
  {
    id: "iss-tap-hostel",
    title: "Tap running non-stop in Boys Hostel B-block washroom",
    category: "Plumbing",
    location: "Boys Hostel B-block, 2nd Floor washroom",
    description:
      "One tap in the second-floor washroom has been running continuously — day and night — for over a week. That's thousands of litres down the drain while the hostel talks about water conservation every summer.",
    urgency: "medium",
    reporter: "Anonymous",
    createdAt: "2026-09-26T21:08:00+05:30",
    upvotes: 29,
    status: "fixed",
    timeline: [
      { status: "reported", note: "Report filed anonymously.", at: "2026-09-26T21:08:00+05:30" },
      {
        status: "acknowledged",
        note: "Warden's office confirmed the faulty tap.",
        at: "2026-09-28T10:00:00+05:30",
      },
      {
        status: "in-progress",
        note: "Washer assembly replaced.",
        at: "2026-10-02T12:30:00+05:30",
      },
      {
        status: "fixed",
        note: "Tap sealed and tested. No more leakage.",
        at: "2026-10-03T09:20:00+05:30",
      },
    ],
  },
  {
    id: "iss-projector-ece",
    title: "Projector dead in the ECE seminar hall",
    category: "Electrical",
    location: "ECE Block, Seminar Hall",
    description:
      "The seminar hall projector shows nothing but a blinking amber light. Guest lectures and project reviews have all moved to a tiny portable screen for the last two weeks.",
    urgency: "medium",
    reporter: "Lakshmi N",
    createdAt: "2026-09-29T15:44:00+05:30",
    upvotes: 18,
    status: "fixed",
    timeline: [
      { status: "reported", note: "Report filed by Lakshmi N.", at: "2026-09-29T15:44:00+05:30" },
      {
        status: "acknowledged",
        note: "AV team diagnosed a blown lamp.",
        at: "2026-09-30T11:25:00+05:30",
      },
      {
        status: "in-progress",
        note: "Replacement lamp procured.",
        at: "2026-10-02T14:10:00+05:30",
      },
      {
        status: "fixed",
        note: "Lamp replaced; projector tested with a full lecture.",
        at: "2026-10-04T10:05:00+05:30",
      },
    ],
  },
];

/* ---------- persistence ---------- */

const ISSUES_KEY = "fixmycampus.issues.v1";
const UPVOTED_KEY = "fixmycampus.upvoted.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function loadIssues(): Issue[] {
  if (!isBrowser()) return deepClone(SEED);
  try {
    const raw = window.localStorage.getItem(ISSUES_KEY);
    if (!raw) {
      window.localStorage.setItem(ISSUES_KEY, JSON.stringify(SEED));
      return deepClone(SEED);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("bad shape");
    return parsed;
  } catch {
    return deepClone(SEED);
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
}

export function addIssue(input: NewIssueInput): Issue {
  const issues = loadIssues();
  const now = new Date().toISOString();
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
    timeline: [{ status: "reported", note: `Report filed by ${input.reporter.trim() || "Anonymous"}.`, at: now }],
  };
  const next = [issue, ...issues];
  saveIssues(next);
  const upvoted = [...loadUpvoted(), issue.id];
  saveUpvoted(upvoted);
  return issue;
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
