"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createMenfess } from "@/app/actions/menfess";
import CreateNoteModal, { type NoteFormValues } from "./CreateNoteModal";

type MenfessContextValue = {
  openCreateNote: () => void;
};

const MenfessContext = createContext<MenfessContextValue | null>(null);

export function useMenfess() {
  const context = useContext(MenfessContext);

  if (!context) {
    throw new Error("useMenfess harus dipakai di dalam MenfessProvider");
  }

  return context;
}

type MenfessProviderProps = {
  children: ReactNode;
};

export default function MenfessProvider({ children }: MenfessProviderProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openCreateNote = useCallback(() => setIsCreateOpen(true), []);
  const closeCreateNote = useCallback(() => setIsCreateOpen(false), []);

  const handleCreateNote = useCallback(
    async (values: NoteFormValues) => {
      const result = await createMenfess(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      router.refresh();
    },
    [router],
  );

  const contextValue = useMemo(() => ({ openCreateNote }), [openCreateNote]);

  return (
    <MenfessContext.Provider value={contextValue}>
      {children}
      <CreateNoteModal
        open={isCreateOpen}
        onClose={closeCreateNote}
        onSubmit={handleCreateNote}
      />
    </MenfessContext.Provider>
  );
}
