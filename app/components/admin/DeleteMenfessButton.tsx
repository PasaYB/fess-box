"use client";

import { Trash2 } from "lucide-react";
import { deleteMenfessAction } from "@/app/actions/admin";

type DeleteMenfessButtonProps = {
  id: number;
};

export default function DeleteMenfessButton({ id }: DeleteMenfessButtonProps) {
  return (
    <form
      action={deleteMenfessAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Hapus menfess ini secara permanen? Tindakan ini tidak bisa dibatalkan.",
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
      >
        <Trash2 aria-hidden="true" className="h-4 w-4" /> Hapus permanen
      </button>
    </form>
  );
}
