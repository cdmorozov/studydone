/**
 * Hour when the log rolls to a new day.
 * Studying at 00:30 still belongs to yesterday — not the calendar date.
 */
const DAY_STARTS_AT_HOUR = 4;

/** Today's study-log date as "YYYY-MM-DD" in the local timezone. */
export function today(): string {
  return dayOf(new Date());
}

/** Study-log date for an instant: before 04:00 counts as the previous calendar day. */
export function dayOf(instant: Date): string {
  const shifted = new Date(instant.getFullYear(), instant.getMonth(), instant.getDate());
  if (instant.getHours() < DAY_STARTS_AT_HOUR) {
    shifted.setDate(shifted.getDate() - 1);
  }
  return format(shifted);
}

/** `day` shifted by `delta` days (negative goes back), in local time. */
export function addDays(day: string, delta: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return format(new Date(year, month - 1, date + delta));
}

/** A heading for a day's group in the log. */
export function formatHeading(day: string, now: string = today()): string {
  if (!isDay(day)) return "Today";
  if (day === now) return "Today";
  if (day === addDays(now, -1)) return "Yesterday";

  const parsed = parseDay(day);
  const showYear = parsed.getFullYear() !== parseDay(now).getFullYear();
  return parsed.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: showYear ? "numeric" : undefined,
  });
}

/** Newest day first; within a day, last-added first. */
export function groupByDay<T extends { date: string; createdAt?: string }>(
  items: T[],
): { date: string; items: T[] }[] {
  const dates: string[] = [];
  const grouped = new Map<string, T[]>();

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const date = dayFor(item);
    const bucket = grouped.get(date);
    if (bucket) {
      bucket.push(item);
    } else {
      grouped.set(date, [item]);
      dates.push(date);
    }
  }

  dates.sort((a, b) => b.localeCompare(a));
  return dates.map((date) => ({ date, items: grouped.get(date)! }));
}

function dayFor(item: { date: string; createdAt?: string }): string {
  if (item.createdAt) {
    const instant = new Date(item.createdAt);
    if (!Number.isNaN(instant.getTime())) return dayOf(instant);
  }
  return isDay(item.date) ? item.date : today();
}

function isDay(day: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(day);
}

function parseDay(day: string): Date {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date);
}

function format(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
