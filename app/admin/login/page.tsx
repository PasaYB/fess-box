import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-md items-center justify-center py-10">
      <section className="w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.3)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4CC] text-gray-900">
          <LockKeyhole aria-hidden="true" className="h-5 w-5" />
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">Admin login</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">Masuk untuk meninjau menfess sebelum ditampilkan.</p>
        <AdminLoginForm />
        <Link href="/" className="mt-6 inline-flex text-sm font-medium text-gray-500 underline-offset-4 hover:text-black hover:underline">Kembali ke FessNotes</Link>
      </section>
    </div>
  );
}
