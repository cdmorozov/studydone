import { useEffect, useState } from "react";
import { useStudyLog } from "./useStudyLog";
import { Sidebar } from "./components/Sidebar";
import { SubjectPane } from "./components/SubjectPane";
import { IconSidebar } from "./components/icons";
import "./App.css";

const SELECTED_KEY = "studydone.subject";

function readSelected(): string | null {
  try {
    return localStorage.getItem(SELECTED_KEY);
  } catch {
    return null;
  }
}

function App() {
  const log = useStudyLog();
  const [selectedId, setSelectedId] = useState<string | null>(readSelected);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const subjects = log.subjects;

  useEffect(() => {
    if (!subjects?.length) {
      if (subjects?.length === 0) setSelectedId(null);
      return;
    }
    if (!selectedId || !subjects.some((subject) => subject.id === selectedId)) {
      setSelectedId(subjects[0].id);
    }
  }, [subjects, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    try {
      localStorage.setItem(SELECTED_KEY, selectedId);
    } catch {
      /* ignore quota / private mode */
    }
  }, [selectedId]);

  const selected = subjects?.find((subject) => subject.id === selectedId) ?? null;

  return (
    <div className="flex h-dvh overflow-hidden bg-bg font-sans text-text">
      <Sidebar
        subjects={subjects ?? []}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAdd={(name) => {
          const id = log.addSubject(name);
          if (id) setSelectedId(id);
        }}
        onDelete={log.deleteSubject}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {log.error && (
        <p
          aria-live="polite"
          className="absolute top-3 right-3 z-40 rounded-md bg-hover px-3 py-1.5 text-sm text-muted"
        >
          {log.error}
        </p>
      )}

      {subjects === null && (
        <p className="flex flex-1 items-center justify-center text-sm text-faint">Loading…</p>
      )}

      {subjects !== null && selected && (
        <SubjectPane
          subject={selected}
          log={log}
          editingId={editingId}
          setEditingId={setEditingId}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      )}

      {subjects !== null && !selected && (
        <main className="flex min-w-0 flex-1 flex-col items-center justify-center px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open subjects"
            className="mb-6 flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-faint transition-colors hover:bg-hover hover:text-text md:hidden"
          >
            <IconSidebar />
          </button>
          <p className="text-sm text-muted">Add a subject to start logging.</p>
          <p className="mt-1 text-[13px] text-faint">Math, History, anything you’re studying.</p>
        </main>
      )}
    </div>
  );
}

export default App;
