
export type Topic = {
  id: string;
  content: string;
  /** Study-log day, "YYYY-MM-DD". Rolls over at 04:00 local time, not midnight. */
  date: string;
  /** When the topic was added, ISO-8601. Used to regroup if the day boundary changes. */
  createdAt?: string;
};

export type Subject = {
  id: string;
  name: string;
  topics: Topic[]
}
