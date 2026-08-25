
export type Topic = {
  id: string;
  content: string;
  date: string
}

export type Subject = {
  id: string;
  name: string;
  topics: Topic[]
}
