"use client";

import { useCallback, useState } from "react";
import type { Note } from "./NoteCard";
import NoteModal from "./NoteModal";
import NotesGrid from "./NotesGrid";

type NotesSectionProps = {
  notes: Note[];
};

export default function NotesSection({ notes }: NotesSectionProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const closeNote = useCallback(() => setSelectedNote(null), []);

  return (
    <section>
      {notes.length > 0 ? (
        <div className="mt-8 md:mt-10">
          <NotesGrid notes={notes} onSelectNote={setSelectedNote} />
        </div>
      ) : (
        <div className="mt-8 flex min-h-60 flex-col items-center justify-center rounded-3xl px-6 py-16 text-center md:mt-10">
          <p className="text-base font-semibold text-gray-900">No fess yet</p>
        </div>
      )}

      <NoteModal note={selectedNote} onClose={closeNote} />
    </section>
  );
}
