import assert from "node:assert/strict";
import test from "node:test";
import {
  createAdminSessionToken,
  hashAdminPassword,
  isValidAdminSessionToken,
  verifyAdminPassword,
} from "../src/lib/admin-security.mjs";
import { isModerationStatus } from "../src/lib/moderation.mjs";

const secret = "test-session-secret-with-more-than-32-characters";

test("password hashes verify without retaining the plaintext", async () => {
  const hash = await hashAdminPassword("classroom-passphrase-123");
  assert.equal(hash.includes("$"), false);
  assert.equal(hash.includes(":"), true);
  assert.notEqual(hash, "classroom-passphrase-123");
  assert.equal(await verifyAdminPassword("classroom-passphrase-123", hash), true);
  assert.equal(await verifyAdminPassword("wrong-passphrase", hash), false);
});

test("valid session token is accepted before its expiry", () => {
  const token = createAdminSessionToken(2_000_000_000_000, secret);
  assert.equal(isValidAdminSessionToken(token, secret, 1_999), true);
});

test("expired session token is rejected", () => {
  const token = createAdminSessionToken(2_000_000_000_000, secret);
  assert.equal(isValidAdminSessionToken(token, secret, 2_000_000_000_000), false);
});

test("tampered token and wrong secret are rejected", () => {
  const token = createAdminSessionToken(2_000_000_000_000, secret);
  assert.equal(isValidAdminSessionToken(`${token}x`, secret, 1_000), false);
  assert.equal(isValidAdminSessionToken(token, `${secret}-wrong`, 1_000), false);
});

test("malformed tokens are rejected without throwing", () => {
  for (const token of ["", "abc", "e30.invalid", "%%% .%%%"] ) {
    assert.equal(isValidAdminSessionToken(token, secret, 1_000), false);
  }
});

test("only the three moderation states are accepted", () => {
  assert.equal(isModerationStatus("PENDING"), true);
  assert.equal(isModerationStatus("APPROVED"), true);
  assert.equal(isModerationStatus("REJECTED"), true);
  assert.equal(isModerationStatus("OTHER"), false);
  assert.equal(isModerationStatus(undefined), false);
});
