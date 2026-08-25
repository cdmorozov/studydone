import { useState, useEffect, ChangeEvent } from "react";
import { Subject, Topic } from "./types";
import "./App.css";

type TopicListProps = {
  subject: Subject | undefined;
  addTopic: (subjectId: string, topic: Topic) => void;
}

function TopicList(props: TopicListProps) {
  const subject = props.subject;

  function handleAddTopic(formData: FormData) {
    const value = formData.get("text") as string;

    if (!value.trim() || !subject) return;

    const topic: Topic = {
      id: crypto.randomUUID(),
      content: value,
      date: new Date().toISOString(),
    }

    props.addTopic(subject.id, topic);
  }


  if (subject != undefined) {
    return (
      <div className="p-4">
        <h2 className="px-2 pb-2 text-base font-medium text-[#dcddde]">
          {subject.name}
        </h2>

        <ul className="flex flex-col gap-0.5">
          {subject.topics.map((topic) => {
            return (
              <li key={topic.id} className="px-2 py-1 text-sm text-[#b3b3b3]">
                {topic.content}
              </li>
            );
          })}
        </ul>

        <form action={handleAddTopic}>
          <input
            name="text"
            type="text"
            placeholder="learn something..."
            className={`
              w-full px-2 py-1
              bg-[#1e1e1e] text-sm text-[#dcddde] placeholder-[#6b6b6b]
              border border-[#333333]
              outline-none
              focus:border-[#525252]
            `}
          />
        </form>
      </div>
    );
  }
}

function App() {

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const selectedSubject = subjects.find((subject) => subject.id == selectedSubjectId);

  useEffect(() => {
    setSubjects([
      { id: crypto.randomUUID(), name: "Rust", topics: [] },
    ]);
  }, []);

  function addTopic(subjectId: string, topic: Topic) {
    setSubjects((subjects) =>
      subjects.map((subject) =>
        subject.id === subjectId
          ? { ...subject, topics: [...subject.topics, topic] }
          : subject
      )
    );
  }

  function handleAddSubject(formData: FormData) {
    const value = formData.get("text") as string;
    console.log(value);

    if (!value.trim()) return;

    setSubjects((subjects) => [
      ...subjects,
      {
        id: crypto.randomUUID(),
        name: value,
        topics: []
      }
    ])
  }


  return (
    <main className="flex h-screen bg-[#1e1e1e] text-[#dcddde]">
      <aside className="flex h-full w-64 flex-col bg-[#262626] border-r border-[#333333]">
        <h1 className="px-3 pt-3 pb-2 text-sm font-medium text-[#dcddde]">
          study<span className="text-[#a882ff]">done</span>
        </h1>

        <nav className="flex-1 overflow-y-auto px-2">
          <ul className="flex flex-col gap-0.5">
            {subjects.map((subject) => {
              return (
                <li key={subject.id}>
                  <button
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className={`
                      w-full px-2 py-1
                      text-left text-sm
                      transition-colors
                      hover:bg-[#333333] hover:text-[#dcddde]
                      ${selectedSubjectId === subject.id ? "bg-[#373737] text-[#dcddde]" : "text-[#b3b3b3]"}
                    `}
                  >
                    {subject.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <form action={handleAddSubject} className="p-2 border-t border-[#1e1e1e]">
          <input
            name="text"
            type="text"
            placeholder="Math/Rust/Python etc."
            className={`
              w-full px-2 py-1
              bg-[#1e1e1e] text-sm text-[#dcddde] placeholder-[#6b6b6b]
              border border-[#333333]
              outline-none
              focus:border-[#525252]
            `}
          />
        </form>
      </aside>

      {selectedSubjectId != null && <TopicList subject={selectedSubject} addTopic={ addTopic }  />}

      <section className="flex-1" />
    </main>
  );
}

export default App;

// Создать тему
// Создать топик
// Записать топик в тему
// Хранить темы.
//
// приложение.
// Старница 1: subjects list + input
// click on subject -> Страница 2: subject.topics list + input
//
