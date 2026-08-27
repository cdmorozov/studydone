import { useState } from "react";
import { useStudyLog } from "./useStudyLog";
import { today } from "./day";
import { EditableText } from "./components/EditableText";
import { ConfirmDelete } from "./components/ConfirmDelete";
import "./App.css";

const row = "flex items-center gap-2 rounded-md bg-button px-3 py-1.5 w-75 text-base";

function App() {
  const log = useStudyLog();
  const [editingId, setEditingId] = useState<string | null>(null);
  /** Which day's topics are showing, and which day new ones are logged under. */
  const [day, setDay] = useState(today());

  return (
    <main className="flex h-screen bg-bg text-text">
      <div className="flex-col pl-56 pt-8 w-2xl justify-start overflow-y-auto">
        <div className="flex items-center gap-3 w-75 mb-8">
          <input
            type="date"
            value={day}
            max={today()}
            onChange={(event) => setDay(event.target.value || today())}
            aria-label="day"
            className="rounded-md bg-button px-3 py-1.5 text-base text-text outline-none [color-scheme:dark]"
          />
          {day !== today() && (
            <button
              onClick={() => setDay(today())}
              className="text-sm text-text-faint hover:text-text-muted transition-colors cursor-pointer"
            >
              Today
            </button>
          )}
        </div>

        {(log.subjects ?? []).map((subject) => (
          <div key={subject.id} className="flex-col pb-8">
            <h3 className="group flex items-center gap-2 w-75 mb-2 text-2xl font-medium font-inter">
              <EditableText
                value={subject.name}
                editing={editingId === subject.id}
                onEdit={() => setEditingId(subject.id)}
                onCommit={(name) => {
                  log.renameSubject(subject.id, name);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
                className="flex-1 min-w-0 truncate"
              />

              {editingId !== subject.id && (
                <RowActions
                  onRename={() => setEditingId(subject.id)}
                  renameLabel={`rename ${subject.name}`}
                  deleteLabel={`delete ${subject.name} and its ${subject.topics.length} topics`}
                  onDelete={() => log.deleteSubject(subject.id)}
                />
              )}
            </h3>

            <ul className="flex flex-col gap-1.5">
              {subject.topics.filter((topic) => topic.date === day).map((topic) => (
                <li key={topic.id} className={`${row} group text-text-muted`}>
                  <span className="text-text-faint">•</span>

                  <EditableText
                    value={topic.content}
                    editing={editingId === topic.id}
                    onEdit={() => setEditingId(topic.id)}
                    onCommit={(content) => {
                      log.editTopic(subject.id, topic.id, content);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                    className="flex-1 min-w-0"
                  />

                  {editingId !== topic.id && (
                    <RowActions
                      deleteLabel={`delete "${topic.content}"`}
                      onDelete={() => log.deleteTopic(subject.id, topic.id)}
                    />
                  )}
                </li>
              ))}

              <AddRow
                placeholder="learn something..."
                label="Add topic"
                onAdd={(content) => log.addTopic(subject.id, content, day)}
              />
            </ul>
          </div>
        ))}

        <AddRow placeholder="name a subject..." label="Add subject" onAdd={log.addSubject} />
      </div>
    </main>
  );
}

/** The trailing "+" row, which turns into an input when you click it. */
function AddRow(props: { placeholder: string; label: string; onAdd: (value: string) => void }) {
  const [adding, setAdding] = useState(false);

  function handleAdd(formData: FormData) {
    props.onAdd(String(formData.get("value") ?? ""));
    setAdding(false);
  }

  return (
    <li className={`${row} list-none`}>
      <span className="text-text-faint">+</span>

      {adding ? (
        <form action={handleAdd} className="flex-1 min-w-0">
          <input
            autoFocus
            name="value"
            autoComplete="off"
            placeholder={props.placeholder}
            onBlur={(event) => event.currentTarget.form?.requestSubmit()}
            onKeyDown={(event) => event.key === "Escape" && setAdding(false)}
            className="w-full h-5 bg-transparent text-text placeholder-text-faint outline-none leading-none"
          />
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex-1 text-left text-text-faint hover:text-text-muted transition-colors cursor-pointer"
        >
          {props.label}
        </button>
      )}
    </li>
  );
}

/** Rename and delete, revealed on hover so the rows stay quiet until you reach for them. */
function RowActions(props: {
  onRename?: () => void;
  renameLabel?: string;
  deleteLabel: string;
  onDelete: () => void;
}) {
  return (
    <span className="hidden shrink-0 items-center gap-2 text-base text-text-faint group-hover:flex group-focus-within:flex">
      {props.onRename && (
        <button
          onClick={props.onRename}
          aria-label={props.renameLabel}
          className="cursor-pointer hover:text-text transition-colors"
        >
          <PencilIcon />
        </button>
      )}
      <ConfirmDelete label={props.deleteLabel} onConfirm={props.onDelete} className="leading-none" />
    </span>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20h4L20 8l-4-4L4 16z" strokeLinejoin="round" />
    </svg>
  );
}

export default App;
