import NoteCard, { type Note } from "./NoteCard";

type NotesGridProps = {
  notes: Note[];
  onSelectNote?: (note: Note) => void;
};

export default function NotesGrid({
  notes,
  onSelectNote,
}: NotesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onSelect={onSelectNote} />
      ))}
    </div>
  );
}
