"use server";

import { revalidatePath } from "next/cache";
import {
  DEFAULT_NOTE_COLOR,
  NOTE_COLORS,
} from "@/app/components/notes/note-colors";
import { prisma } from "@/src/lib/prisma";

const MAX_SENDER_NAME_LENGTH = 60;
const MAX_CONTENT_LENGTH = 2000;

export type CreateMenfessInput = {
  senderName?: string;
  content: string;
  color: string;
};

export type CreateMenfessResult =
  | { success: true }
  | { success: false; error: string };

export async function createMenfess(
  input: CreateMenfessInput,
): Promise<CreateMenfessResult> {
  const content = typeof input?.content === "string" ? input.content.trim() : "";

  if (!content) {
    return { success: false, error: "Content must be filled." };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return {
      success: false,
      error: `Content must be ${MAX_CONTENT_LENGTH} characters or fewer.`,
    };
  }

  const rawSenderName =
    typeof input.senderName === "string" ? input.senderName.trim() : "";
  const senderName =
    (rawSenderName || "Anonymous").slice(0, MAX_SENDER_NAME_LENGTH);

  const color =
    NOTE_COLORS.find((option) => option.value === input.color)?.value ??
    DEFAULT_NOTE_COLOR;

  try {
    await prisma.menfess.create({
      data: {
        senderName,
        content,
        status: "PENDING",
        color,
      },
    });
  } catch {
    return {
      success: false,
      error: "Failed to send your fess. Please try again.",
    };
  }

  revalidatePath("/");

  return { success: true };
}
