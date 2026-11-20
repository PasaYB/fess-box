"use client";

import { useCallback, useState } from "react";
import type { Note } from "./NoteCard";
import NoteModal from "./NoteModal";
import NotesGrid from "./NotesGrid";

const notes: Note[] = [
  {
    id: "1",
    title:
      "Ide konten minggu ini: bikin carousel tentang kebiasaan pagi yang bikin produktif dan konsisten. Tambahkan checklist sederhana, tips waktu, dan ajakan untuk mulai besok.",
    date: "20 Nov 2026",
    color: "#FFD078",
  },
  {
    id: "2",
    title:
      "Rapat tim produk dipindah ke hari Kamis, jam 10.00. Jangan lupa bawa update roadmap terbaru, ringkasan feedback pengguna, dan daftar prioritas sprint berikutnya.",
    date: "18 Nov 2026",
    color: "#FF9878",
  },
  {
    id: "3",
    title:
      "Draft caption untuk peluncuran fitur baru. Nada santai, tetap jelas, dan langsung ke poin utama. Sertakan satu kalimat ajakan yang tidak terdengar memaksa.",
    date: "15 Nov 2026",
    color: "#E2EF8C",
  },
  {
    id: "4",
    title:
      "Belanja bulanan: kopi, oats, susu almond, buah, dan camilan sehat untuk stok kantor. Cek juga stok tisu, sabun, dan air mineral sebelum berangkat.",
    date: "12 Nov 2026",
    color: "#B58BEF",
  },
  {
    id: "5",
    title:
      "Referensi desain untuk halaman notes. Fokus ke warna pastel, tipografi tebal, dan ruang kosong. Hindari bayangan berlebihan supaya tampilan tetap bersih.",
    date: "09 Nov 2026",
    color: "#0FC2D9",
  },
  {
    id: "6",
    title:
      "Selesai lebih baik daripada sempurna. Mulai dari langkah kecil hari ini, lalu lanjutkan besok. Catat satu hal yang sudah berjalan baik agar tetap termotivasi.",
    date: "05 Nov 2026",
    color: "#FFD078",
  },
];

export default function NotesSection() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const closeNote = useCallback(() => setSelectedNote(null), []);

  return (
    <section>
      <div className="mt-8 md:mt-10">
        <NotesGrid notes={notes} onSelectNote={setSelectedNote} />
      </div>

      <NoteModal note={selectedNote} onClose={closeNote} />
    </section>
  );
}
