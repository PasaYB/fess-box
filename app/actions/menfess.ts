"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  DEFAULT_NOTE_COLOR,
  NOTE_COLORS,
} from "@/app/components/notes/note-colors";
import { checkRateLimit, getClientIp } from "@/src/lib/rate-limit.mjs";
import { prisma } from "@/src/lib/prisma";

const MAX_SENDER_NAME_LENGTH = 60;
const MAX_CONTENT_LENGTH = 2000;

// Batas anti-spam (per IP). Ubah angkanya sesuai kebutuhan.
const PER_MINUTE = { limit: 3, windowMs: 60 * 1000 };
const PER_HOUR = { limit: 20, windowMs: 60 * 60 * 1000 };
// Kalau antrean PENDING sudah segini banyak, kiriman baru ditolak sementara.
const MAX_PENDING_QUEUE = 500;

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

  const ip = getClientIp(await headers());
  const minuteCheck = checkRateLimit(`minute:${ip}`, PER_MINUTE);
  const hourCheck = checkRateLimit(`hour:${ip}`, PER_HOUR);
  if (!minuteCheck.allowed || !hourCheck.allowed) {
    const wait = Math.max(
      minuteCheck.retryAfterSeconds,
      hourCheck.retryAfterSeconds,
    );
    return {
      success: false,
      error: `Too many submissions. Please try again in ${wait} seconds.`,
    };
  }

  try {
    const pendingCount = await prisma.menfess.count({
      where: { status: "PENDING" },
    });
    if (pendingCount >= MAX_PENDING_QUEUE) {
      return {
        success: false,
        error: "The queue is full right now. Please try again later.",
      };
    }
  } catch {
    return {
      success: false,
      error: "Failed to send your fess. Please try again.",
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