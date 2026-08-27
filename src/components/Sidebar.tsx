import { useState, type FormEvent } from "react";
import { Subject } from "../types";
import { ConfirmDelete } from "./ConfirmDelete";

type Props = {
  subjects: Subject[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  open: boolean;
  onClose: () => void;
};

export function Sidebar({
  subjects,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
  open,
  onClose,
}: Props) {
  const [adding, setAdding] = useState(false);

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const value = String(new FormData(form).get("name") ?? "");
    onAdd(value);
    form.reset();
    setAdding(false);
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-56 shrink-0 flex-col border-r border-border bg-sidebar transition-transform md:static md:visible md:translate-x-0 ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="px-4 pt-5 pb-4 text-[13px] font-medium tracking-wide text-faint">
          StudyDone
        </div>

        <nav aria-label="Subjects" className="min-h-0 flex-1 overflow-y-auto px-2">
          <ul className="flex flex-col gap-0.5">
            {subjects.map((subject) => {
              const selected = subject.id === selectedId;
              return (
                <li key={subject.id} className="group relative">
                  <button
                    type="button"
                    aria-current={selected ? "true" : undefined}
                    onClick={() => {
                      onSelect(subject.id);
                      onClose();
                    }}
                    className={`flex min-h-11 w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-[13px] transition-colors md:min-h-0 ${
                      selected ? "bg-active text-text" : "text-muted hover:bg-hover hover:text-text"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">{subject.name}</span>
                    {subject.topics.length > 0 && (
                      <span className="ml-2 shrink-0 tabular-nums text-[11px] text-faint group-hover:opacity-0">
                        {subject.topics.length}
                      </span>
                    )}
                  </button>

                  <span className="absolute top-1/2 right-1.5 z-10 -translate-y-1/2 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                    <ConfirmDelete
                      label={`delete ${subject.name} and its ${subject.topics.length} topics`}
                      onConfirm={() => onDelete(subject.id)}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2">
          {adding ? (
            <form onSubmit={handleAdd}>
              <input
                autoFocus
                name="name"
                aria-label="Subject name"
                autoComplete="off"
                placeholder="Subject name"
                onBlur={(event) => {
                  const value = event.currentTarget.value.trim();
                  if (value) event.currentTarget.form?.requestSubmit();
                  else setAdding(false);
                }}
                onKeyDown={(event) => event.key === "Escape" && setAdding(false)}
                className="w-full rounded-md border-none bg-hover px-2 py-1.5 text-[13px] text-text outline-none placeholder:text-faint focus-visible:ring-1 focus-visible:ring-muted"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-left text-[13px] text-faint transition-colors hover:bg-hover hover:text-muted"
            >
              + Add subject
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
