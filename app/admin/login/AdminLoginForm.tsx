"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/app/actions/admin";

type LoginState = { error?: string };

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(adminLoginAction, {});

  return (
    <form action={action} className="mt-6 space-y-4">
      {state.error === "setup" ? (
        <p role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Login admin belum dikonfigurasi. Atur <code>ADMIN_USERNAME</code>, <code>ADMIN_PASSWORD_HASH</code>, dan <code>ADMIN_SESSION_SECRET</code> pada environment aplikasi.
        </p>
      ) : state.error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">Username atau password salah.</p>
      ) : null}
      <label className="block space-y-2 text-sm font-semibold text-gray-800">
        Username
        <input name="username" type="text" required autoComplete="username" className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-normal outline-none transition focus:border-black focus:ring-2 focus:ring-black/10" />
      </label>
      <label className="block space-y-2 text-sm font-semibold text-gray-800">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-normal outline-none transition focus:border-black focus:ring-2 focus:ring-black/10" />
      </label>
      <button type="submit" disabled={pending} className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">{pending ? "Memeriksa..." : "Masuk"}</button>
    </form>
  );
}
