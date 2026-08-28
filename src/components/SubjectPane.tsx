import { useEffect, useRef, useState } from "react";
import { Subject } from "../types";
import { formatHeading, groupByDay, today } from "../day";
import { EditableText } from "./EditableText";
import { ConfirmDelete } from "./ConfirmDelete";
import { Composer } from "./Composer";
import { IconPencil, IconSidebar } from "./icons";

type Log = {
  renameSubject: (id: string, name: string) => void;
  deleteSubject: (id: string) => void;
  addTopic: (subjectId: string, content: string) => void;
  editTopic: (subjectId: string, topicId: string, content: string) => void;
  deleteTopic: (subjectId: string, topicId: string) => void;
};

type Props = {
  subject: Subject;
  log: Log;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onOpenSidebar: () => void;
};

export function SubjectPane({
  subject,
  log,
  editingId,
  setEditingId,
  onOpenSidebar,
}: Props) {
  const composerRef = useRef<HTMLInputElement>(null);
  const [now, setNow] = useState(today);

  useEffect(() => {
    composerRef.current?.focus();
  }, [subject.id]);

  useEffect(() => {
    const sync = () => setNow(today());
    const id = setInterval(sync, 30_000);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const groups = groupByDay(subject.topics);
  const topicCount = subject.topics.length;

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl">
          <div className="sticky top-0 z-10 bg-bg px-6 pt-8 pb-1 md:px-10">
            <header className="group mb-6 flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={onOpenSidebar}
                aria-label="Open subjects"
                className="-ml-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-faint transition-colors hover:bg-hover hover:text-text md:hidden"
              >
                <IconSidebar />
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-medium tracking-tight">
                  <EditableText
                    value={subject.name}
                    editing={editingId === subject.id}
                    onEdit={() => setEditingId(subject.id)}
                    onCommit={(name) => {
                      log.renameSubject(subject.id, name);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                    className="min-w-0 truncate"
                  />
                </h1>
                <p className="mt-1 text-[13px] text-faint">
                  {topicCount === 0
                    ? "No topics yet"
                    : `${topicCount} ${topicCount === 1 ? "topic" : "topics"}`}
                </p>
              </div>

              <div
                className={`flex h-8 min-w-[52px] shrink-0 items-center justify-end gap-0.5 ${
                  editingId === subject.id
                    ? "invisible"
                    : "opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setEditingId(subject.id)}
                  aria-label={`rename ${subject.name}`}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-faint transition-colors hover:bg-hover hover:text-text"
                >
                  <IconPencil />
                </button>
                <ConfirmDelete
                  label={`delete ${subject.name} and its ${topicCount} topics`}
                  onConfirm={() => log.deleteSubject(subject.id)}
                />
              </div>
            </header>

            <Composer
              onAdd={(content) => log.addTopic(subject.id, content)}
              inputRef={composerRef}
            />
          </div>

          <div className="px-6 pb-16 md:px-10">
            {groups.length === 0 ? (
              <p className="mt-8 text-[13px] text-faint">
                Nothing logged yet. Type above and press Enter.
              </p>
            ) : (
              <div className="mt-8 flex flex-col gap-8">
                {groups.map((group) => (
                  <section key={group.date}>
                    <h2 className="mb-1 text-[12px] text-muted">{formatHeading(group.date, now)}</h2>
                    <ul className="flex flex-col">
                      {group.items.map((topic) => (
                        <li
                          key={topic.id}
                          className="group flex min-h-11 items-center gap-2 rounded-md py-1.5 text-[15px] leading-snug text-text hover:bg-hover md:min-h-0"
                        >
                          <EditableText
                            value={topic.content}
                            editing={editingId === topic.id}
                            onEdit={() => setEditingId(topic.id)}
                            onCommit={(content) => {
                              log.editTopic(subject.id, topic.id, content);
                              setEditingId(null);
                            }}
                            onCancel={() => setEditingId(null)}
                            className="min-w-0 flex-1 px-2 whitespace-normal"
                          />
                          <div
                            className={`flex h-6 min-w-6 shrink-0 items-center justify-end ${
                              editingId === topic.id
                                ? "invisible w-6"
                                : "opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                            }`}
                          >
                            <ConfirmDelete
                              label={`delete "${topic.content}"`}
                              onConfirm={() => log.deleteTopic(subject.id, topic.id)}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
