import { daysOpen, type Issue } from "./issues";

function cell(v: string | number): string {
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

/** Serializes issues to CSV for download (board + steward exports). */
export function issuesToCsv(issues: Issue[]): string {
  const header = [
    "id",
    "title",
    "category",
    "location",
    "urgency",
    "reporter",
    "created_at",
    "upvotes",
    "status",
    "days_open",
  ];
  const rows = issues.map((i) =>
    [
      i.id,
      i.title,
      i.category,
      i.location,
      i.urgency,
      i.reporter,
      i.createdAt,
      i.upvotes,
      i.status,
      daysOpen(i),
    ]
      .map(cell)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
