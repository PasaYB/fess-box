"use client";

import { Plus } from "lucide-react";

const glassPanel =
  "relative isolate overflow-hidden rounded-full border border-white/50 bg-white/40 backdrop-blur-2xl backdrop-saturate-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.3),0_12px_40px_-12px_rgba(15,23,42,0.28)] supports-[backdrop-filter]:bg-white/30";

export default function Navbar() {
  return (
    <header className="shrink-0">
      <div
        className={`${glassPanel} flex items-center justify-between gap-3 px-4 py-2.5 md:rounded-none md:overflow-visible md:border-0 md:bg-transparent md:px-10 md:pb-4 md:pt-8 md:shadow-none md:backdrop-blur-none md:backdrop-saturate-100 md:supports-backdrop-filter:bg-transparent`}
      >
        <h1 className="text-[27px] font-bold leading-none tracking-[-0.03em] text-black md:text-[48px]">
          FessNotes
        </h1>

        <button
          type="button"
          aria-label="Buat catatan baru"
          className="flex items-center justify-center gap-3 rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:hidden"
        >
          <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>
    </header>
  );
}
