/**
 * The real REC campus, traced from Rohan's own Campus Map Builder drawing.
 *
 * viewBox: 0 0 1200 800. Schematic accuracy — relative positions and sizes
 * match his layout. Renaming a building later is a one-line change here:
 * just edit the `name` field; ids stay stable.
 */

export type ZoneTone = "building" | "green" | "water";

export type CampusBuilding =
  | {
      id: string;
      name: string;
      kind: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      tone?: ZoneTone;
      /** Optional label position override (defaults to the shape's center). */
      lx?: number;
      ly?: number;
      /**
       * When true, the name renders OUTSIDE the box at (lx, ly) with a thin
       * leader line + dot pointing at the building — for boxes too small
       * to hold their name at a readable size.
       */
      outside?: boolean;
    }
  | {
      id: string;
      name: string;
      kind: "circle";
      cx: number;
      cy: number;
      r: number;
      tone?: ZoneTone;
      lx?: number;
      ly?: number;
      /** See above — outside label with leader line. */
      outside?: boolean;
    };

export interface CampusRoad {
  points: [number, number][];
  width: number;
}

export const CAMPUS_VIEWBOX = "0 0 1200 800";

/** The big ring road enclosing the central campus. */
export const CAMPUS_RING = { x: 275, y: 140, w: 650, h: 510, rx: 42, width: 26 };

export const CAMPUS_ROADS: CampusRoad[] = [
  // Connector north up to the top-row buildings
  { points: [[400, 88], [400, 140]], width: 14 },
  // West vertical — a single road running parallel west of the ring
  { points: [[180, 140], [180, 650]], width: 16 },
  // Road 10: short stub from the west road east to the ATM (outside the ring)
  { points: [[180, 580], [215, 580]], width: 14 },
  // Diagonal from the ring's bottom-left corner through Adhi Statue to Workshop Block
  { points: [[317, 608], [452, 468]], width: 14 },
  // Internal horizontal below the playground
  { points: [[275, 400], [925, 400]], width: 16 },
  // Internal vertical between Main Block and the playground
  { points: [[412, 140], [412, 400]], width: 14 },
  // Internal vertical between Workshop Block and HUT
  { points: [[680, 400], [680, 650]], width: 14 },
  // East connector out to the hostels
  { points: [[925, 400], [970, 400]], width: 14 },
  // South horizontal
  { points: [[350, 672], [925, 672]], width: 14 },
  // South connectors down to Rec Cafe / Academic Block
  { points: [[584, 650], [584, 672]], width: 12 },
  { points: [[730, 650], [730, 672]], width: 12 },
  // South vertical
  { points: [[820, 650], [820, 800]], width: 14 },
];

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  // — North strip —
  { id: "garden", name: "GARDEN", kind: "rect", x: 295, y: 30, w: 80, h: 85, tone: "green" },
  { id: "eb-block", name: "EB BLOCK", kind: "rect", x: 425, y: 48, w: 52, h: 42 },
  { id: "park", name: "PARK", kind: "rect", x: 487, y: 48, w: 52, h: 42, tone: "green" },
  { id: "j-block", name: "J BLOCK AND LIBRARY", kind: "rect", x: 549, y: 40, w: 125, h: 58 },
  { id: "coffee-day", name: "COFFEE DAY", kind: "rect", x: 684, y: 52, w: 48, h: 36 },
  { id: "outdoor-auditorium", name: "OUTDOOR AUDITORIUM", kind: "rect", x: 742, y: 35, w: 145, h: 68 },
  { id: "munch-mode", name: "MUNCH MODE", kind: "rect", x: 897, y: 50, w: 68, h: 40 },
  // — Inside the ring —
  { id: "tech-lounge", name: "TECH LOUNGE", kind: "rect", x: 305, y: 180, w: 62, h: 30, outside: true, lx: 336, ly: 158 },
  { id: "main-block", name: "MAIN BLOCK", kind: "rect", x: 305, y: 250, w: 78, h: 155 },
  { id: "fountain", name: "FOUNTAIN", kind: "circle", cx: 283, cy: 298, r: 14, tone: "water", outside: true, lx: 275, ly: 334 },
  { id: "play-ground", name: "PLAY GROUND", kind: "rect", x: 435, y: 175, w: 365, h: 205, tone: "green", ly: 364 },
  { id: "swimming-pool", name: "SWIMMING POOL", kind: "rect", x: 460, y: 190, w: 118, h: 48, tone: "water" },
  { id: "gym", name: "GYM", kind: "rect", x: 598, y: 190, w: 118, h: 62 },
  { id: "rec-mart", name: "REC MART", kind: "rect", x: 545, y: 425, w: 48, h: 58 },
  { id: "workshop-block", name: "WORKSHOP BLOCK", kind: "rect", x: 450, y: 425, w: 78, h: 190 },
  { id: "hut", name: "HUT", kind: "rect", x: 705, y: 428, w: 158, h: 70 },
  { id: "workshop-1", name: "WORKSHOP 1", kind: "rect", x: 705, y: 508, w: 158, h: 32 },
  { id: "workshop-2", name: "WORKSHOP 2", kind: "rect", x: 705, y: 548, w: 158, h: 32 },
  { id: "aero-dept", name: "AERO DEPT", kind: "rect", x: 705, y: 588, w: 158, h: 40 },
  { id: "adhi-statue", name: "ADHI STATUE", kind: "circle", cx: 382, cy: 538, r: 13, outside: true, lx: 335, ly: 498 },
  { id: "atm", name: "ATM", kind: "rect", x: 215, y: 562, w: 32, h: 34 },
  { id: "aircraft", name: "AIRCRAFT", kind: "rect", x: 336, y: 560, w: 52, h: 22, outside: true, lx: 314, ly: 571 },
  { id: "dominos", name: "DOMINOS", kind: "rect", x: 336, y: 586, w: 52, h: 22 },
  { id: "black-buck", name: "BLACK BUCK", kind: "rect", x: 336, y: 612, w: 52, h: 24, outside: true, lx: 425, ly: 624 },
  // — East hostels —
  { id: "girls-hostel-1", name: "GIRLS HOSTEL 1", kind: "rect", x: 970, y: 180, w: 55, h: 80 },
  { id: "girls-hostel-2", name: "GIRLS HOSTEL 2", kind: "rect", x: 970, y: 275, w: 55, h: 88 },
  { id: "girls-hostel-3", name: "GIRLS HOSTEL 3", kind: "rect", x: 970, y: 378, w: 55, h: 88 },
  { id: "canteen", name: "CANTEEN", kind: "rect", x: 970, y: 481, w: 55, h: 78 },
  { id: "boys-hostel", name: "BOYS HOSTEL", kind: "rect", x: 970, y: 574, w: 55, h: 98 },
  // — South —
  { id: "rec-cafe", name: "REC CAFE", kind: "rect", x: 545, y: 695, w: 78, h: 48 },
  { id: "court-yard", name: "COURT YARD", kind: "rect", x: 545, y: 750, w: 72, h: 26, tone: "green" },
  { id: "academic-block", name: "ACADEMIC BLOCK", kind: "rect", x: 645, y: 690, w: 170, h: 72 },
  { id: "idea-factory", name: "IDEA FACTORY", kind: "rect", x: 350, y: 695, w: 85, h: 95 },
  { id: "tifac", name: "TIFAC", kind: "rect", x: 450, y: 695, w: 85, h: 95 },
  { id: "wukon", name: "WUKON", kind: "rect", x: 850, y: 695, w: 38, h: 32 },
  { id: "yipee", name: "YIPPEE", kind: "rect", x: 850, y: 735, w: 38, h: 32, outside: true, lx: 869, ly: 779 },
];

export function buildingCenter(b: CampusBuilding): { x: number; y: number } {
  return b.kind === "rect"
    ? { x: b.x + b.w / 2, y: b.y + b.h / 2 }
    : { x: b.cx, y: b.cy };
}

export function buildingBounds(b: CampusBuilding): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  return b.kind === "rect"
    ? { x: b.x, y: b.y, w: b.w, h: b.h }
    : { x: b.cx - b.r, y: b.cy - b.r, w: b.r * 2, h: b.r * 2 };
}
