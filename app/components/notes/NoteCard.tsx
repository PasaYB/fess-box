export interface Note {
  id: string;
  title: string;
  date: string;
  color: string;
}

type NoteCardProps = {
  note: Note;
  onSelect?: (note: Note) => void;
};

export default function NoteCard({ note, onSelect }: NoteCardProps) {
  const { title, date, color } = note;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(note)}
      aria-haspopup="dialog"
      aria-label={`Buka catatan: ${title}`}
      className="relative flex h-47.5 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-5 text-left transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 motion-reduce:transition-none"
      style={{ backgroundColor: color }}
    >
      <span className="line-clamp-5 text-[14px] font-medium leading-[1.4] text-[#1F1F1F]">
        {title}
      </span>

      <span className="flex items-center justify-between gap-3">
        <time className="text-[11px] font-medium text-black/55">{date}</time>

        {/* ADMIN ONLY
        <button
          type="button"
          aria-label={`Edit note: ${title}`}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <Pencil aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
        </button> */}
      </span>
    </button>
  );
}
