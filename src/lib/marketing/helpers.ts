// Week-based rotation helpers shared across all projects.
// Same logic as the original marketing-posts.ts — keeps content rotating
// week-over-week without any cron or LLM cost.

/** Returns a stable integer that increments every 7 days from the Unix epoch. */
export function weekIndex(offset = 0): number {
  return Math.floor(Date.now() / (7 * 86_400_000)) + offset;
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

/** Returns a "May 4 – 10" style date range for the given offset week. */
export function weekDateRange(offset = 0): string {
  const wkIdx = weekIndex(offset);
  const startMs = wkIdx * 7 * 86_400_000;
  const start = new Date(startMs);
  const end = new Date(startMs + 6 * 86_400_000);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}
