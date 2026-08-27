import { Store } from "@tauri-apps/plugin-store";
import { Subject } from "./types";

/** A plain JSON file in the app data dir, so the log survives updates and can be backed up. */
const FILE = "studydone.json";
const KEY = "subjects";

let store: Promise<Store> | null = null;

function open() {
  store ??= Store.load(FILE);
  return store;
}

export async function loadSubjects(): Promise<Subject[]> {
  return (await (await open()).get<Subject[]>(KEY)) ?? [];
}

export async function saveSubjects(subjects: Subject[]): Promise<void> {
  await (await open()).set(KEY, subjects);
}
