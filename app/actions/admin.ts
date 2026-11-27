"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdminPassword } from "@/src/lib/admin-security.mjs";
import { isModerationStatus } from "@/src/lib/moderation.mjs";
import { requireAdmin, signInAdmin, signOutAdmin } from "@/src/lib/admin-auth";
import { prisma } from "@/src/lib/prisma";

export async function adminLoginAction(
  _previousState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  let authenticated = false;
  try {
    authenticated = await signInAdmin(username, password, verifyAdminPassword);
  } catch {
    return { error: "setup" };
  }

  if (authenticated) redirect("/admin");
  return { error: "invalid" };
}

export async function adminLogoutAction() {
  await signOutAdmin();
  redirect("/admin/login");
}

export async function updateMenfessStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = formData.get("status");
  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    typeof status !== "string" ||
    !isModerationStatus(status)
  ) {
    redirect("/admin?error=invalid");
  }

  await prisma.menfess.update({ where: { id }, data: { status: status as string } });
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=1");
}

export async function deleteMenfessAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    redirect("/admin?tab=rejected&error=invalid");
  }

  // deleteMany is used so a missing row does not throw; count tells us whether
  // anything was actually removed.
  const { count } = await prisma.menfess.deleteMany({ where: { id } });
  if (count === 0) {
    redirect("/admin?tab=rejected&error=notfound");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?tab=rejected&deleted=1");
}
