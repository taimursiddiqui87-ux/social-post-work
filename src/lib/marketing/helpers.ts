// Rotation helpers shared across all projects.
// Rotation cadence: every 2 days at 00:00 Pakistan time (UTC+5).
// Each rotation advances every caption to the next variant + every image
// card to the next palette. No cron, no LLM cost — purely deterministic
// from the system clock.

// Anchor = Monday 1970-01-05 00:00 PKT = Sun 1970-01-04 19:00 UTC.
// 3 days + 19 hours after the Unix epoch = 327,600,000 ms.
const ANCHOR_MS = 327_600_000;
const CYCLE_DAYS = 2;
const CYCLE_MS = CYCLE_DAYS * 86_400_000;

/** Returns a stable integer that increments every 2 days at 00:00 PKT. */
export function cycleIndex(offset = 0): number {
  return Math.floor((Date.now() - ANCHOR_MS) / CYCLE_MS) + offset;
}

/** Picks one item from `arr` based on the current 2-day cycle (+ optional offset). */
export function pickByCycle<T>(arr: T[], offset = 0): T {
  return arr[cycleIndex(offset) % arr.length];
}

/** Human-friendly label for a cycle offset relative to today. */
export function cycleLabel(offset: number): string {
  if (offset === 0) return "Now showing";
  if (offset === 1) return "In 2 days";
  if (offset === -1) return "2 days ago";
  const days = Math.abs(offset) * CYCLE_DAYS;
  return offset > 0 ? `In ${days} days` : `${days} days ago`;
}

/** Returns a "May 4 – 5" style 2-day range for the given cycle offset,
 *  rendered in Pakistan time so the dates match the rotation boundary. */
export function cycleDateRange(offset = 0): string {
  const idx = cycleIndex(offset);
  const startMs = ANCHOR_MS + idx * CYCLE_MS;
  const start = new Date(startMs);
  const end = new Date(startMs + (CYCLE_DAYS - 1) * 86_400_000);
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Karachi",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

/** Number of days per rotation cycle — exposed for UI labels. */
export const CYCLE_DAYS_LABEL = CYCLE_DAYS;
