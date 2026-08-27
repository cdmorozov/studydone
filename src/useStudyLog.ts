import { useEffect, useState } from "react";
import { Subject, Topic } from "./types";
import { loadSubjects, saveSubjects } from "./storage";

/**
 * The whole app state: the subjects, read from disk once and written back
 * after every change. `subjects` is null only while that first read is running.
 */
export function useStudyLog() {
  const [subjects, setSubjects] = useState<Subject[] | null>(null);

  useEffect(() => {
    loadSubjects().then(setSubjects);
  }, []);

  useEffect(() => {
    if (subjects) saveSubjects(subjects);
  }, [subjects]);

  function update(change: (subjects: Subject[]) => Subject[]) {
    setSubjects((subjects) => (subjects ? change(subjects) : subjects));
  }

  /** Applies a change to one subject and leaves the rest alone. */
  function updateSubject(id: string, change: (subject: Subject) => Subject) {
    update((subjects) =>
      subjects.map((subject) => (subject.id === id ? change(subject) : subject))
    );
  }

  function addSubject(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    update((subjects) => [...subjects, { id: crypto.randomUUID(), name: trimmed, topics: [] }]);
  }

  function renameSubject(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    updateSubject(id, (subject) => ({ ...subject, name: trimmed }));
  }

  /** Deleting a subject takes its topics with it. */
  function deleteSubject(id: string) {
    update((subjects) => subjects.filter((subject) => subject.id !== id));
  }

  function addTopic(subjectId: string, content: string, day: string) {
    const trimmed = content.trim();
    if (!trimmed) return;

    const topic: Topic = { id: crypto.randomUUID(), content: trimmed, date: day };
    updateSubject(subjectId, (subject) => ({ ...subject, topics: [...subject.topics, topic] }));
  }

  function editTopic(subjectId: string, topicId: string, content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;

    updateSubject(subjectId, (subject) => ({
      ...subject,
      topics: subject.topics.map((topic) =>
        topic.id === topicId ? { ...topic, content: trimmed } : topic
      ),
    }));
  }

  function deleteTopic(subjectId: string, topicId: string) {
    updateSubject(subjectId, (subject) => ({
      ...subject,
      topics: subject.topics.filter((topic) => topic.id !== topicId),
    }));
  }

  return {
    subjects,
    addSubject,
    renameSubject,
    deleteSubject,
    addTopic,
    editTopic,
    deleteTopic,
  };
}
