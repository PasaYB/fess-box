"use client";

import { Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMenfess } from "@/app/components/notes/MenfessProvider";

const glassPanel =
  "relative isolate overflow-hidden rounded-full border border-white/50 bg-white/40 backdrop-blur-2xl backdrop-saturate-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.3),0_12px_40px_-12px_rgba(15,23,42,0.28)] supports-[backdrop-filter]:bg-white/30";

export default function Navbar() {
  const { openCreateNote } = useMenfess();

  return (
    <header className="shrink-0">
      <div
        className={`${glassPanel} flex items-center justify-between gap-3 px-4 py-2.5 md:rounded-none md:overflow-visible md:border-0 md:bg-transparent md:px-10 md:pb-4 md:pt-8 md:shadow-none md:backdrop-blur-none md:backdrop-saturate-100 md:supports-backdrop-filter:bg-transparent`}
      >
        <h1 className="text-[27px] font-bold leading-none tracking-[-0.03em] text-black md:text-[48px]">
          FessNotes
        </h1>

        <div className="flex items-center gap-2">
          <Link href="/admin/login" title="Login admin" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 md:h-11">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            <span>Admin</span>
          </Link>

          <button
            type="button"
            onClick={openCreateNote}
            aria-label="Add new fess"
            className="flex items-center justify-center gap-3 rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:hidden"
          >
            <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </header>
  );
}
