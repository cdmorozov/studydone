/** Today's date as "YYYY-MM-DD" in the local timezone, not UTC — matches <input type="date">. */
export function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${date}`;
}
