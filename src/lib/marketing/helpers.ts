// Week-based rotation helpers shared across all projects.
// Rotation boundary: every Monday 00:00 Pakistan time (UTC+5),
// i.e. Sunday 19:00 UTC. Content auto-advances each Monday morning
// without any cron or LLM cost.

// Anchor = first Monday 00:00 PKT after the Unix epoch.
// Epoch was Thu 1970-01-01 00:00 UTC = Thu 05:00 PKT.
// First Monday after that = Mon 1970-01-05 00:00 PKT = Sun 1970-01-04 19:00 UTC.
// 3 days 19 hours after epoch = 327,600,000 ms.
const ANCHOR_MS = 327_600_000;
const WEEK_MS = 7 * 86_400_000;

/** Returns a stable integer that increments every Monday at 00:00 PKT. */
export function weekIndex(offset = 0): number {
  return Math.floor((Date.now() - ANCHOR_MS) / WEEK_MS) + offset;
}

/** Picks one item from `arr` based on the current week (+ optional offset). */
export function pickByWeek<T>(arr: T[], offset = 0): T {
  return arr[weekIndex(offset) % arr.length];
}

/** Human-friendly label for a week offset relative to today. */
export function weekLabel(offset: number): string {
  if (offset === 0) return "This week";
  if (offset === 1) return "Next week";
  if (offset === -1) return "Last week";
  if (offset > 1) return `In ${offset} weeks`;
  return `${Math.abs(offset)} weeks ago`;
}

/** Returns a "May 4 – 10" style date range for the given offset week,
 *  rendered in Pakistan time so the dates match the rotation boundary. */
export function weekDateRange(offset = 0): string {
  const wkIdx = weekIndex(offset);
  const startMs = ANCHOR_MS + wkIdx * WEEK_MS;
  const start = new Date(startMs);
  const end = new Date(startMs + 6 * 86_400_000);
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Karachi",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}
