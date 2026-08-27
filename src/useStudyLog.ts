import { useEffect, useState } from "react";
import { Subject, Topic } from "./types";
import { loadSubjects, saveSubjects } from "./storage";
import { today } from "./day";

/**
 * The whole app state: the subjects, read from disk once and written back
 * after every change. `subjects` is null only while that first read is running.
 */
export function useStudyLog() {
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects()
      .then(setSubjects)
      .catch(() => setError("Couldn't load your study log."));
  }, []);

  useEffect(() => {
    if (subjects) {
      saveSubjects(subjects).catch(() => setError("Couldn't save — your last change may be lost."));
    }
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

  function addSubject(name: string): string | undefined {
    const trimmed = name.trim();
    if (!trimmed) return;

    const id = crypto.randomUUID();
    update((subjects) => [...subjects, { id, name: trimmed, topics: [] }]);
    return id;
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

  function addTopic(subjectId: string, content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;

    const topic: Topic = { id: crypto.randomUUID(), content: trimmed, date: today() };
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
    error,
    addSubject,
    renameSubject,
    deleteSubject,
    addTopic,
    editTopic,
    deleteTopic,
  };
}
