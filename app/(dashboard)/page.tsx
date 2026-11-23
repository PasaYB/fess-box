import { Suspense } from "react";
import { connection } from "next/server";
import NotesSection from "@/app/components/notes/NotesSection";
import type { Note } from "@/app/components/notes/NoteCard";
import { prisma } from "@/src/lib/prisma";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

async function NotesFromDatabase() {
  await connection();

  const menfesses = await prisma.menfess.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  const notes: Note[] = menfesses.map((menfess) => ({
    id: String(menfess.id),
    senderName: menfess.senderName ?? "Anonymous",
    title: menfess.content,
    date: dateFormatter.format(menfess.createdAt),
    color: menfess.color,
  }));

  return <NotesSection notes={notes} />;
}

function NotesFallback() {
  return (
    <div className="mt-8 grid animate-pulse grid-cols-2 gap-5 md:mt-10 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-47.5 rounded-2xl bg-gray-100"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<NotesFallback />}>
      <NotesFromDatabase />
    </Suspense>
  );
}
