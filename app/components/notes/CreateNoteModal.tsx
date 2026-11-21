"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Check, X } from "lucide-react";
import { DEFAULT_NOTE_COLOR, NOTE_COLORS } from "./note-colors";

const CLOSE_ANIMATION_MS = 180;

export type NoteFormValues = {
  senderName?: string;
  content: string;
  color: string;
};

type CreateNoteModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => Promise<void>;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export default function CreateNoteModal({
  open,
  onClose,
  onSubmit,
}: CreateNoteModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isSubmittingRef = useRef(false);

  const [senderName, setSenderName] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<string>(DEFAULT_NOTE_COLOR);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    isSubmittingRef.current = false;
    setSenderName("");
    setContent("");
    setColor(DEFAULT_NOTE_COLOR);
    setError(null);
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    if (isSubmittingRef.current || closeTimerRef.current !== null) return;

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setIsClosing(false);
      resetForm();
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusTimer = window.setTimeout(() => contentRef.current?.focus(), 0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [open, handleClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) return;

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Content must be filled.");
      contentRef.current?.focus();
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        senderName: senderName.trim() || undefined,
        content: trimmedContent,
        color,
      });

      isSubmittingRef.current = false;
      setIsSubmitting(false);
      handleClose();
    } catch (submitError) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to send your fess. Please try again.",
      );
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Tutup formulir menfess"
        onClick={handleClose}
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm ${
          isClosing ? "note-modal-backdrop-out" : "note-modal-backdrop-in"
        }`}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-note-title"
        className={`relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.45)] sm:p-8 ${
          isClosing ? "note-modal-card-out" : "note-modal-card-in"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="create-note-title"
              className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
            >
              Add your Fess
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Write and Send.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Tutup formulir menfess"
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="menfess-sender-name"
              className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-800"
            >
              Sender
              <span className="text-[11px] font-medium text-gray-400">
                Optional
              </span>
            </label>
            <input
              id="menfess-sender-name"
              type="text"
              name="senderName"
              value={senderName}
              onChange={(event) => setSenderName(event.target.value)}
              placeholder="Anonymous"
              autoComplete="off"
              maxLength={60}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="menfess-content"
              className="block text-sm font-semibold text-gray-800"
            >
              Content
            </label>
            <textarea
              ref={contentRef}
              id="menfess-content"
              name="content"
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Roses are red Violets are blue.."
              rows={5}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "menfess-content-error" : undefined}
              className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200 focus:border-black focus:ring-black/10"
              }`}
            />
            {error && (
              <p
                id="menfess-content-error"
                role="alert"
                className="text-xs font-medium text-red-600"
              >
                {error}
              </p>
            )}
          </div>

          <fieldset className="space-y-2.5">
            <legend className="text-sm font-semibold text-gray-800">
              Color
            </legend>
            <div className="flex flex-wrap gap-3">
              {NOTE_COLORS.map((option) => {
                const isSelected = color === option.value;

                return (
                  <label
                    key={option.value}
                    title={option.label}
                    className="relative cursor-pointer rounded-full"
                  >
                    <input
                      type="radio"
                      name="color"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setColor(option.value)}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 peer-hover:scale-110 peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-2 ${
                        isSelected ? "ring-2 ring-black ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: option.value }}
                    >
                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="h-4 w-4 text-black/70"
                          strokeWidth={2.5}
                        />
                      )}
                    </span>
                    <span className="sr-only">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
