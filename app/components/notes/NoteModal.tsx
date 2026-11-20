"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Note } from "./NoteCard";

const CLOSE_ANIMATION_MS = 180;

type NoteModalProps = {
  note: Note | null;
  onClose: () => void;
};

export default function NoteModal({ note, onClose }: NoteModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (closeTimerRef.current !== null) return;

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setIsClosing(false);
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  useEffect(() => {
    if (!note) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [note, handleClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Tutup catatan"
        onClick={handleClose}
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm ${
          isClosing ? "note-modal-backdrop-out" : "note-modal-backdrop-in"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Detail catatan"
        className={`relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl p-6 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.45)] sm:p-8 ${
          isClosing ? "note-modal-card-out" : "note-modal-card-in"
        }`}
        style={{ backgroundColor: note.color }}
      >
        <div className="flex items-start justify-between gap-5">
          <p className="whitespace-pre-wrap text-[15px] font-medium leading-normal text-[#1F1F1F] sm:text-base">
            {note.title}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Tutup catatan"
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>

        <time className="mt-10 block text-[11px] font-medium text-black/55 sm:text-xs">
          {note.date}
        </time>
      </div>
    </div>
  );
}
