import { Store } from "@tauri-apps/plugin-store";
import { Subject } from "./types";

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
      return raw ? (JSON.parse(raw) as Subject[]) : [];
    } catch {
      return [];
    }
  }
  return (await (await open()).get<Subject[]>(KEY)) ?? [];
}

export async function saveSubjects(subjects: Subject[]): Promise<void> {
  if (!runningInTauri()) {
    localStorage.setItem(LS_KEY, JSON.stringify(subjects));
    return;
  }
  await (await open()).set(KEY, subjects);
}
