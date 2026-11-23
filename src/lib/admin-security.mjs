import { createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const SCRYPT_KEY_LENGTH = 64;
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export async function hashAdminPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, SCRYPT_KEY_LENGTH);
  return `scrypt:${salt.toString("base64url")}:${Buffer.from(key).toString("base64url")}`;
}

export async function verifyAdminPassword(password, storedHash) {
  if (typeof password !== "string" || typeof storedHash !== "string") return false;
  const [algorithm, saltText, keyText, extra] = storedHash.split(":");
  if (algorithm !== "scrypt" || !saltText || !keyText || extra !== undefined) return false;

  try {
    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(keyText, "base64url");
    if (salt.length !== 16 || expected.length !== SCRYPT_KEY_LENGTH) return false;
    const actual = Buffer.from(await scrypt(password, salt, SCRYPT_KEY_LENGTH));
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function sign(expiresAt, secret) {
  return createHmac("sha256", secret).update(expiresAt).digest("base64url");
}

export function createAdminSessionToken(expiresAt, secret) {
  const payload = String(expiresAt);
  return `${payload}.${sign(payload, secret)}`;
}

export function createAdminSession(secret, now = Date.now()) {
  return createAdminSessionToken(now + SESSION_MAX_AGE_MS, secret);
}

export function isValidAdminSessionToken(token, secret, now = Date.now()) {
  if (typeof token !== "string" || typeof secret !== "string" || !secret) return false;
  const match = /^(\d{13})\.([A-Za-z0-9_-]+)$/.exec(token);
  if (!match) return false;

  const [, expiresAt, providedSignature] = match;
  if (Number(expiresAt) <= now) return false;

  const expected = Buffer.from(sign(expiresAt, secret), "base64url");
  const provided = Buffer.from(providedSignature, "base64url");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
