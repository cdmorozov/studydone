
export type Topic = {
  id: string;
  content: string;
  /** The day you learned it, local time, "YYYY-MM-DD" — matches <input type="date">. */
  date: string
}

export type Subject = {
  id: string;
  name: string;
  topics: Topic[]
}
