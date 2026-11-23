import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminSession, isValidAdminSessionToken } from "./admin-security.mjs";

export const ADMIN_SESSION_COOKIE = "fess_admin_session";
const SESSION_COOKIE_MAX_AGE = 8 * 60 * 60;

function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !passwordHash || !sessionSecret || sessionSecret.length < 32) {
    throw new Error("Admin login belum dikonfigurasi.");
  }
  return { username, passwordHash, sessionSecret };
}

export async function signInAdmin(
  username: string,
  password: string,
  verifyPassword: (password: string, hash: string) => Promise<boolean>,
): Promise<boolean> {
  const config = getAdminConfig();
  const usernameMatches = username === config.username;
  const passwordMatches = await verifyPassword(password, config.passwordHash);
  if (!usernameMatches || !passwordMatches) return false;

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSession(config.sessionSecret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });
  return true;
}

export async function isAdminAuthenticated() {
  const config = getAdminConfig();
  const cookieStore = await cookies();
  return isValidAdminSessionToken(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
    config.sessionSecret,
  );
}

export async function requireAdmin() {
  try {
    if (await isAdminAuthenticated()) return;
  } catch {
    redirect("/admin/login?setup=required");
  }
  redirect("/admin/login");
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
