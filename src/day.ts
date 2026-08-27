/** Today's date as "YYYY-MM-DD" in the local timezone. */
export function today(): string {
  return format(new Date());
}

/** `day` shifted by `delta` days (negative goes back), in local time. */
export function addDays(day: string, delta: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return format(new Date(year, month - 1, date + delta));
}

/** A heading for a day's group in the log. */
export function formatHeading(day: string): string {
  if (!isDay(day)) return "Today";
  if (day === today()) return "Today";
  if (day === addDays(today(), -1)) return "Yesterday";

  const parsed = parseDay(day);
  const showYear = parsed.getFullYear() !== new Date().getFullYear();
  return parsed.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: showYear ? "numeric" : undefined,
  });
}

/** Newest day first; within a day, last-added first. */
export function groupByDay<T extends { date: string }>(
  items: T[],
): { date: string; items: T[] }[] {
  const dates: string[] = [];
  const grouped = new Map<string, T[]>();

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const date = isDay(item.date) ? item.date : today();
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
