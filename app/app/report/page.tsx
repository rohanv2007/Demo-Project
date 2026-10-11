"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES, CAMPUS_ZONES, addIssue, findSimilarIssues, loadIssues, type Category, type Issue, type Urgency } from "@/lib/issues";
import { cn } from "@/lib/cn";
import Kicker from "@/components/Kicker";
import StatusPill from "@/components/StatusPill";

const URGENCIES: { value: Urgency; label: string; hint: string }[] = [
  { value: "low", label: "Low", hint: "Annoying, but livable" },
  { value: "medium", label: "Medium", hint: "Disrupts daily life" },
  { value: "high", label: "High", hint: "Safety / urgent" },
];

const inputCls =
  "w-full rounded-[3px] border border-line bg-cream px-4 py-3 text-[15px] placeholder:text-faint/70 focus:border-ink focus:outline-none transition-colors";

const DRAFT_KEY = "fixmycampus.report-draft.v1";

interface Draft {
  title: string;
  category: Category;
  location: string;
  zone: string;
  description: string;
  urgency: Urgency;
  name: string;
  anonymous: boolean;
}

function loadDraft(): Partial<Draft> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<Draft>) : {};
  } catch {
    return {};
  }
}

/** Downscales an image file to a bounded JPEG data URL for localStorage. */
function fileToPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1200;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

export default function ReportPage() {
  const router = useRouter();
  const [draft] = useState<Partial<Draft>>(loadDraft);
  const [title, setTitle] = useState(draft.title ?? "");
  const [category, setCategory] = useState<Category>(
    draft.category ?? "Electrical",
  );
  const [location, setLocation] = useState(draft.location ?? "");
  const [zone, setZone] = useState(draft.zone ?? "");
  const [description, setDescription] = useState(draft.description ?? "");
  const [urgency, setUrgency] = useState<Urgency>(draft.urgency ?? "medium");
  const [name, setName] = useState(draft.name ?? "");
  const [anonymous, setAnonymous] = useState(draft.anonymous ?? false);
  const [errors, setErrors] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function handlePhotoFile(file: File | undefined) {
    if (!file) return;
    try {
      const dataUrl = await fileToPhoto(file);
      setPhoto(dataUrl);
      setPhotoError("");
    } catch {
      setPhotoError("That image could not be read — try another file.");
    }
  }
  const [restored, setRestored] = useState(
    Boolean(draft.title || draft.description),
  );

  // Autosave the draft so an interrupted report is never lost.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const d: Draft = {
        title,
        category,
        location,
        zone,
        description,
        urgency,
        name,
        anonymous,
      };
      try {
        if (title || description || location) {
          window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
        } else {
          window.localStorage.removeItem(DRAFT_KEY);
        }
      } catch {
        /* storage full — draft stays in memory */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [title, category, location, zone, description, urgency, name, anonymous]);

  // Prefill the zone when arriving from the map ("tap a building to report").
  useEffect(() => {
    const z = new URLSearchParams(window.location.search).get("zone");
    if (z && CAMPUS_ZONES.some((zone) => zone.name === z)) {
      setZone(z);
      setRestored(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function discardDraft() {
    setTitle("");
    setLocation("");
    setZone("");
    setDescription("");
    setName("");
    setAnonymous(false);
    setPhoto(null);
    setRestored(false);
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* noop */
    }
  }

  const similar: Issue[] =
    title.trim().length >= 4 ? findSimilarIssues(title, loadIssues(), 2) : [];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (title.trim().length < 8) errs.push("Give the issue a clear title (at least 8 characters).");
    if (!location.trim()) errs.push("Tell us where on campus this is.");
    if (description.trim().length < 20)
      errs.push("Describe it in a little more detail (at least 20 characters).");
    setErrors(errs);
    if (errs.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const { issue, photoDropped } = addIssue({
      title,
      category,
      location,
      description,
      urgency,
      reporter: anonymous ? "" : name,
      zone,
      photo: photo ?? undefined,
    });
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* noop */
    }
    router.push(`/issues/${issue.id}?fresh=1${photoDropped ? "&nophoto=1" : ""}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-12 md:pt-16">
      <Kicker>File a report</Kicker>
      <h1 className="mt-4 font-display text-[38px] font-semibold leading-[1.05] tracking-tight md:text-[56px]">
        What’s broken? <em className="text-signal">Put it on the board.</em>
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-soot">
        Thirty seconds, no account needed. Be specific — a good report names the
        exact room, block, or landmark so it can actually be found and fixed.
      </p>

      {errors.length > 0 && (
        <div className="mt-8 rounded-[3px] border border-signal/50 bg-signal/5 px-5 py-4" role="alert">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ember">
            Almost — a couple of fixes needed
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-soot">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {restored && (
        <div className="mt-8 flex items-center justify-between gap-4 rounded-[3px] border border-line bg-cream px-5 py-3.5">
          <p className="text-[14px] text-soot">
            Picked up where you left off — your unfinished draft was restored.
          </p>
          <button
            type="button"
            onClick={discardDraft}
            className="cursor-pointer shrink-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint hover:text-ember"
          >
            Discard
          </button>
        </div>
      )}

      <form onSubmit={submit} className="mt-10 space-y-8">
        <div>
          <label htmlFor="title" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Tube lights flickering in CSE Block, Room 204"
            className={inputCls}
            maxLength={90}
          />
          <div className="mt-1.5 flex items-center justify-between text-[12px]">
            <span className={cn(title.trim().length >= 12 ? "text-moss" : "text-faint")}>
              {title.trim().length >= 12
                ? "Clear and specific — good."
                : "Tip: name the place and the problem."}
            </span>
            <span className="tabular-nums text-faint">{title.length}/90</span>
          </div>
          {similar.length > 0 && (
            <div className="mt-3 rounded-[3px] border border-gold/50 bg-cream px-4 py-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-soot">
                Already on the board?
              </p>
              <ul className="mt-2 space-y-1.5">
                {similar.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
                    <Link
                      href={`/issues/${s.id}`}
                      className="u-sweep font-medium text-ink"
                    >
                      {s.title}
                    </Link>
                    <StatusPill status={s.status} />
                    <span className="text-faint">
                      {s.upvotes} upvotes — back it instead of filing again
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "cursor-pointer rounded-[3px] border px-4 py-2 text-[13px] font-medium transition-all",
                  category === c
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-cream text-soot hover:border-ink",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            Where on campus?
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Central Library, 2nd floor reading hall"
            className={inputCls}
            maxLength={80}
          />
        </div>

        <div>
          <label htmlFor="zone" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            Campus zone <span className="font-normal normal-case tracking-normal text-faint">(places the pin on the map)</span>
          </label>
          <select
            id="zone"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className={cn(inputCls, "cursor-pointer", !zone && "text-faint/70")}
          >
            <option value="">Select the nearest zone…</option>
            {CAMPUS_ZONES.map((z) => (
              <option key={z.name} value={z.name}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            What’s happening?
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What exactly is wrong, how long has it been like this, and who does it affect? The more concrete, the faster it gets fixed."
            rows={5}
            className={cn(inputCls, "resize-y leading-relaxed")}
            maxLength={1200}
          />
          <div className="mt-1.5 flex items-center justify-between text-[12px]">
            <span className={cn(description.trim().length >= 40 ? "text-moss" : "text-faint")}>
              {description.trim().length >= 40
                ? "Detailed enough for a steward to act on."
                : "Tip: add how long and who it affects."}
            </span>
            <span className="tabular-nums text-faint">{description.length}/1200</span>
          </div>
        </div>

        <div>
          <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            Photo <span className="font-normal normal-case tracking-normal text-faint">(optional — a picture gets fixed faster)</span>
          </span>
          {photo ? (
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt="Report photo preview"
                className="h-28 w-40 rounded-[3px] border border-line object-cover"
              />
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="cursor-pointer text-[12px] font-semibold uppercase tracking-[0.12em] text-faint hover:text-ember"
              >
                Remove
              </button>
            </div>
          ) : (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void handlePhotoFile(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-3 rounded-[3px] border border-dashed bg-cream px-4 py-8 text-center transition-colors",
                dragOver
                  ? "border-signal bg-signal/5"
                  : "border-faint/60 hover:border-ink",
              )}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5 text-faint"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
                <circle cx="10" cy="10" r="2.6" />
                <path d="M7 4.5 8.2 3h3.6L13 4.5" strokeLinecap="round" />
              </svg>
              <span className="text-[14px] text-soot">
                {dragOver ? (
                  "Drop the photo to attach it"
                ) : (
                  <>
                    Attach a photo <span className="text-faint">— JPG or PNG, drag & drop or click, stored on your device</span>
                  </>
                )}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  void handlePhotoFile(file);
                }}
              />
            </label>
          )}
          {photoError && (
            <p className="mt-2 text-[13px] font-medium text-ember" role="alert">
              {photoError}
            </p>
          )}
        </div>

        <div>
          <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            How urgent is it?
          </span>
          <div className="grid grid-cols-3 gap-2">
            {URGENCIES.map((u) => (
              <button
                key={u.value}
                type="button"
                onClick={() => setUrgency(u.value)}
                aria-pressed={urgency === u.value}
                className={cn(
                  "cursor-pointer rounded-[3px] border px-3 py-3 text-left transition-all",
                  urgency === u.value
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-cream hover:border-ink",
                )}
              >
                <span className="block text-[14px] font-semibold">{u.label}</span>
                <span className={cn("mt-0.5 block text-[12px]", urgency === u.value ? "text-cream/70" : "text-faint")}>
                  {u.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="name" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]">
            Your name <span className="font-normal normal-case tracking-normal text-faint">(optional)</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rohan V"
            disabled={anonymous}
            className={cn(inputCls, anonymous && "opacity-40")}
            maxLength={40}
          />
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[14px] text-soot">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 accent-[#c93e1c]"
            />
            Post anonymously — the issue matters, not who filed it
          </label>
        </div>

        <div className="border-t border-line pt-8">
          <button
            type="submit"
            className="lift w-full cursor-pointer rounded-[3px] bg-signal px-6 py-4 text-[14px] font-semibold uppercase tracking-[0.12em] text-cream md:w-auto md:px-10"
          >
            Publish to the board
          </button>
          <p className="mt-3 text-[13px] text-faint">
            Goes live immediately. Stewards are notified automatically.
          </p>
        </div>
      </form>
    </div>
  );
}
