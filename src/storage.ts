import { Store } from "@tauri-apps/plugin-store";
import { Subject, Topic } from "./types";
import { dayOf } from "./day";

/** A plain JSON file in the app data dir, so the log survives updates and can be backed up. */
const FILE = "studydone.json";
const KEY = "subjects";
const LS_KEY = "studydone.subjects";

function runningInTauri(): boolean {
  return "__TAURI_INTERNALS__" in window;
}

let store: Promise<Store> | null = null;

function open() {
  store ??= Store.load(FILE);
  return store;
}

export async function loadSubjects(): Promise<Subject[]> {
  if (!runningInTauri()) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? migrateSubjects(JSON.parse(raw) as Subject[]) : [];
    } catch {
      return [];
    }
  }
  const stored = (await (await open()).get<Subject[]>(KEY)) ?? [];
  return migrateSubjects(stored);
}

/** Recompute the study-log day; old midnight-stamped rows from the first night move to the 27th. */
function migrateSubjects(subjects: Subject[]): Subject[] {
  return subjects.map((subject) => ({
    ...subject,
    topics: subject.topics.map(migrateTopic),
  }));
}

function migrateTopic(topic: Topic): Topic {
  if (topic.createdAt) {
    const instant = new Date(topic.createdAt);
    if (!Number.isNaN(instant.getTime())) {
      const date = dayOf(instant);
      return date === topic.date ? topic : { ...topic, date };
    }
  }
  // 0.1.0 used calendar midnight. First real use was after midnight on 2026-08-28.
  if (!topic.createdAt && topic.date === "2026-08-28") {
    return { ...topic, date: "2026-08-27" };
  }
  return topic;
}

export async function saveSubjects(subjects: Subject[]): Promise<void> {
  if (!runningInTauri()) {
    localStorage.setItem(LS_KEY, JSON.stringify(subjects));
    return;
  }
  const store = await open();
  await store.set(KEY, subjects);
  await store.save();
}
