"use client";

import { Plus } from "lucide-react";

type SidebarProps = {
  onCreate?: () => void;
};

export default function Sidebar({ onCreate }: SidebarProps) {
  return (
    <aside className="hidden h-full w-20 shrink-0 flex-col items-center border-r border-gray-100 bg-white py-6 md:flex">
      {/* <div className="text-sm font-semibold tracking-tight text-gray-900">
        Add
      </div> */}

      <button
        type="button"
        onClick={onCreate}
        aria-label="Buat menfess baru"
        className="mt-2 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        <Plus className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </aside>
  );
}