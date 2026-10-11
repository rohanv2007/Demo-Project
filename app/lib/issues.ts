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

/** Named campus zones used by the schematic map and the report form. */
export interface CampusZone {
  name: string;
  x: number;
  y: number;
}

export const CAMPUS_ZONES: CampusZone[] = [
  { name: "Central Library", x: 500, y: 340 },
  { name: "CSE Block", x: 250, y: 300 },
  { name: "EEE Block", x: 250, y: 480 },
  { name: "ME Block", x: 140, y: 560 },
  { name: "ECE Block", x: 400, y: 190 },
  { name: "Admin Block", x: 710, y: 450 },
  { name: "Boys Hostel", x: 860, y: 240 },
  { name: "Food Court", x: 620, y: 520 },
  { name: "Canteen", x: 690, y: 590 },
  { name: "Bus Bay", x: 860, y: 600 },
  { name: "Open-air Theatre", x: 450, y: 560 },
  { name: "Sports Ground", x: 620, y: 120 },
];

export function zoneForLocation(location: string): CampusZone {
  const l = location.toLowerCase();
  const hit = CAMPUS_ZONES.find((z) =>
    l.includes(z.name.toLowerCase().replace(" block", "").replace("central ", "")),
  );
  return hit ?? CAMPUS_ZONES[0];
}

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
    comments: [
      {
        id: "cmt-wifi-1",
        author: "Karthik M",
        text: "Same on the third-floor reading room — the login portal just loops there too. It is not only the second floor.",
        at: "2026-10-09T18:22:00+05:30",
      },
      {
        id: "cmt-wifi-2",
        author: "Divya S",
        text: "Bumping this — CAT 2 starts 22 October and the reading hall is full every evening. These access points need a look this week.",
        at: "2026-10-10T08:05:00+05:30",
      },
      {
        id: "cmt-wifi-3",
        author: "Estate Office",
        text: "Acknowledged — the network team is replacing two access points on the second floor tomorrow morning. Will confirm once the portal stops looping.",
        at: "2026-10-10T14:40:00+05:30",
        steward: true,
      },
    ],
    map: { x: 500, y: 340 },
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
    comments: [
      {
        id: "cmt-lamp-1",
        author: "Meera R",
        text: "Walked this stretch at 7 PM yesterday — completely dark in the middle. A few first-years have started taking the longer route around the admin block instead.",
        at: "2026-10-08T20:14:00+05:30",
      },
    ],
    map: { x: 810, y: 585 },
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
    comments: [
      {
        id: "cmt-tube-1",
        author: "Arun K",
        text: "Update from today: the electrician was in during the lunch hour measuring the fittings. Looks like this is actually moving.",
        at: "2026-10-10T13:40:00+05:30",
      },
    ],
    map: { x: 250, y: 300 },
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
    comments: [],
    map: { x: 310, y: 345 },
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
    comments: [],
    map: { x: 620, y: 520 },
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
    comments: [],
    map: { x: 700, y: 595 },
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
    comments: [],
    map: { x: 250, y: 480 },
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
    comments: [],
    map: { x: 735, y: 470 },
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
    comments: [],
    map: { x: 450, y: 560 },
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
    comments: [],
    map: { x: 140, y: 560 },
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
    comments: [],
    map: { x: 860, y: 240 },
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
    comments: [],
    map: { x: 400, y: 190 },
  },
  {
    id: "iss-cctv-parking",
    title: "CCTV blind spot near the bus bay parking",
    category: "Safety",
    location: "Bus Bay parking area",
    description:
      "The row of two-wheelers near the bus bay sits in a complete CCTV blind spot — two cameras cover the bay itself, but the parking stretch behind the shelter is dark after 6 PM. Two mirrors went missing last month. A camera re-aim or one additional unit would close the gap.",
    urgency: "high",
    reporter: "Anonymous",
    createdAt: "2026-10-08T19:40:00+05:30",
    upvotes: 44,
    status: "acknowledged",
    timeline: [
      { status: "reported", note: "Report filed.", at: "2026-10-08T19:40:00+05:30" },
      {
        status: "acknowledged",
        note: "Security office confirmed the blind spot; site survey scheduled.",
        at: "2026-10-09T10:15:00+05:30",
      },
    ],
    comments: [
      {
        id: "cmt-cctv-1",
        author: "Ravi K",
        text: "My bike's mirror was one of the two. +1, this needs a camera urgently.",
        at: "2026-10-08T21:02:00+05:30",
      },
    ],
    map: { x: 860, y: 600 },
  },
  {
    id: "iss-ro-cse",
    title: "RO water purifier dry in the CSE block",
    category: "Plumbing",
    location: "CSE Block, Ground Floor",
    description:
      "The RO unit on the CSE ground floor has been dispensing nothing but air for a week. The maintenance sticker says the filters were due in August. Students are walking to the EEE block for drinking water between classes.",
    urgency: "medium",
    reporter: "Meera J",
    createdAt: "2026-10-07T11:20:00+05:30",
    upvotes: 27,
    status: "in-progress",
    timeline: [
      { status: "reported", note: "Report filed by Meera J.", at: "2026-10-07T11:20:00+05:30" },
      {
        status: "acknowledged",
        note: "Vendor AMC ticket raised.",
        at: "2026-10-07T16:45:00+05:30",
      },
      {
        status: "in-progress",
        note: "Filter cartridges ordered; technician visit booked for Monday.",
        at: "2026-10-09T09:30:00+05:30",
      },
    ],
    comments: [],
    map: { x: 250, y: 300 },
  },
  {
    id: "iss-chairs-me",
    title: "Drawing hall chairs with missing backrests",
    category: "Furniture",
    location: "ME Block, Drawing Hall 2",
    description:
      "Six stools in Drawing Hall 2 are missing backrests entirely — the bolts sheared off months ago. Four-hour drawing sessions on a backless stool are genuinely painful. The store room reportedly has spares.",
    urgency: "medium",
    reporter: "Arjun P",
    createdAt: "2026-10-05T14:05:00+05:30",
    upvotes: 21,
    status: "reported",
    timeline: [
      { status: "reported", note: "Report filed by Arjun P.", at: "2026-10-05T14:05:00+05:30" },
    ],
    comments: [],
    map: { x: 140, y: 560 },
  },
  {
    id: "iss-lab-printers",
    title: "Only one working printer for the whole Central Library",
    category: "Network & IT",
    location: "Central Library, Reprographics Room",
    description:
      "Three printers are installed in the reprographics room but only one works — the other two have been showing 'toner error' since September. Before CAT 2, the queue stretches out the door every evening.",
    urgency: "medium",
    reporter: "Sneha R",
    createdAt: "2026-10-04T17:55:00+05:30",
    upvotes: 33,
    status: "reported",
    timeline: [
      { status: "reported", note: "Report filed by Sneha R.", at: "2026-10-04T17:55:00+05:30" },
    ],
    comments: [
      {
        id: "cmt-print-1",
        author: "Divya S",
        text: "Waited 40 minutes yesterday. The working one jams if you print more than 10 pages.",
        at: "2026-10-05T08:12:00+05:30",
      },
    ],
    map: { x: 500, y: 340 },
  },
  {
    id: "iss-sports-floodlight",
    title: "Floodlight out on the sports ground's east corner",
    category: "Electrical",
    location: "Sports Ground, East Corner",
    description:
      "One of the four floodlights on the sports ground is completely out, leaving the east corner pitch-black after sunset. Evening football practice has moved to half the ground. Likely a fused lamp — the other three are fine.",
    urgency: "low",
    reporter: "Karthik M",
    createdAt: "2026-10-03T18:30:00+05:30",
    upvotes: 15,
    status: "fixed",
    timeline: [
      { status: "reported", note: "Report filed by Karthik M.", at: "2026-10-03T18:30:00+05:30" },
      {
        status: "acknowledged",
        note: "Electrical section confirmed a fused 400W lamp.",
        at: "2026-10-04T09:00:00+05:30",
      },
      {
        status: "in-progress",
        note: "Lamp replaced during daytime maintenance window.",
        at: "2026-10-06T13:20:00+05:30",
      },
      {
        status: "fixed",
        note: "Tested at night; full ground lit evenly.",
        at: "2026-10-06T20:10:00+05:30",
      },
    ],
    comments: [],
    map: { x: 620, y: 120 },
  },
  {
    id: "iss-hostel-washing",
    title: "Washing machines down to one in the boys hostel",
    category: "Cleanliness",
    location: "Boys Hostel, Laundry Room",
    description:
      "Four washing machines serve the whole hostel; three are out of order (two won't spin, one's door latch is broken). The remaining one runs from 6 AM to midnight with a waiting list on the door.",
    urgency: "medium",
    reporter: "Sanjay T",
    createdAt: "2026-10-02T20:15:00+05:30",
    upvotes: 38,
    status: "acknowledged",
    timeline: [
      { status: "reported", note: "Report filed by Sanjay T.", at: "2026-10-02T20:15:00+05:30" },
      {
        status: "acknowledged",
        note: "Warden's office logged a complaint with the facility vendor.",
        at: "2026-10-03T11:40:00+05:30",
      },
    ],
    comments: [
      {
        id: "cmt-wash-1",
        author: "Steward",
        steward: true,
        text: "Vendor visit confirmed for this weekend. We'll update the timeline once the machines are serviced.",
        at: "2026-10-04T10:00:00+05:30",
      },
    ],
    map: { x: 860, y: 240 },
  },
];

/* ---------- persistence ---------- */

const ISSUES_KEY = "fixmycampus.issues.v2";
const UPVOTED_KEY = "fixmycampus.upvoted.v1";
const MINE_KEY = "fixmycampus.my-issues.v1";
const STEWARD_KEY = "fixmycampus.steward.v1";

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

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
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
  if (!isBrowser()) return deepClone(SEED).map(normalizeIssue);
  try {
    const raw = window.localStorage.getItem(ISSUES_KEY);
    if (!raw) {
      window.localStorage.setItem(ISSUES_KEY, JSON.stringify(SEED));
      return deepClone(SEED).map(normalizeIssue);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("bad shape");
    return (parsed as Issue[]).map(normalizeIssue);
  } catch {
    return deepClone(SEED).map(normalizeIssue);
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
      x: Math.round(Math.min(960, Math.max(40, z.x + jitter()))),
      y: Math.round(Math.min(660, Math.max(40, z.y + jitter()))),
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
