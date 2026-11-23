#!/usr/bin/env node
import { hashAdminPassword } from "../src/lib/admin-security.mjs";

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const password = Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");

if (password.length < 12) {
  console.error("Password admin harus minimal 12 karakter.");
  process.exitCode = 1;
} else {
  console.log(await hashAdminPassword(password));
}
