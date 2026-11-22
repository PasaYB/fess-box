import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Check, Clock3, LogOut, X } from "lucide-react";
import { adminLogoutAction, updateMenfessStatusAction } from "@/app/actions/admin";
import { requireAdmin } from "@/src/lib/admin-auth";
import { prisma } from "@/src/lib/prisma";

const formatDate = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

type AdminPageProps = {
  searchParams: Promise<{ tab?: string; updated?: string; saved?: string; error?: string }>;
};

export default function AdminPage(props: AdminPageProps) {
  return (
    <Suspense fallback={<div className="mx-auto mt-12 h-72 max-w-5xl animate-pulse rounded-3xl bg-gray-100" />}>
      <AdminDashboard searchParams={props.searchParams} />
    </Suspense>
  );
}

async function AdminDashboard({ searchParams }: AdminPageProps) {
  await connection();
  await requireAdmin();
  const params = await searchParams;
  if (params.updated === "1") redirect("/admin?tab=pending&saved=1");

  const tab = params.tab === "approved" || params.tab === "rejected" ? params.tab : "pending";
  const status = tab === "approved" ? "APPROVED" : tab === "rejected" ? "REJECTED" : "PENDING";
  const [pendingCount, approvedCount, rejectedCount, menfesses] = await Promise.all([
    prisma.menfess.count({ where: { status: "PENDING" } }),
    prisma.menfess.count({ where: { status: "APPROVED" } }),
    prisma.menfess.count({ where: { status: "REJECTED" } }),
    prisma.menfess.findMany({ where: { status }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl py-2 md:py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">FessNotes / Admin</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Moderasi menfess</h2>
          <p className="mt-2 text-sm text-gray-500">Tinjau kiriman sebelum muncul di halaman publik.</p>
        </div>
        <form action={adminLogoutAction}>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30">
            <LogOut aria-hidden="true" className="h-4 w-4" /> Keluar
          </button>
        </form>
      </div>

      {params.error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Aksi tidak valid. Muat ulang halaman dan coba lagi.</p>}
      {params.saved === "1" && <p role="status" className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">Status menfess berhasil diperbarui.</p>}

      <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4"><p className="text-xs font-medium text-amber-800">Menunggu</p><p className="mt-1 text-2xl font-bold text-gray-900">{pendingCount}</p></div>
        <div className="rounded-2xl border border-green-100 bg-green-50 p-4"><p className="text-xs font-medium text-green-800">Disetujui</p><p className="mt-1 text-2xl font-bold text-gray-900">{approvedCount}</p></div>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4"><p className="text-xs font-medium text-red-800">Ditolak</p><p className="mt-1 text-2xl font-bold text-gray-900">{rejectedCount}</p></div>
      </div>

      <nav aria-label="Filter status menfess" className="mt-7 flex gap-2 overflow-x-auto border-b border-gray-100 pb-3">
        <Link href="/admin?tab=pending" aria-current={tab === "pending" ? "page" : undefined} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${tab === "pending" ? "bg-black text-white" : "text-gray-600 transition hover:bg-gray-100"}`}>Menunggu ({pendingCount})</Link>
        <Link href="/admin?tab=approved" aria-current={tab === "approved" ? "page" : undefined} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${tab === "approved" ? "bg-black text-white" : "text-gray-600 transition hover:bg-gray-100"}`}>Disetujui ({approvedCount})</Link>
        <Link href="/admin?tab=rejected" aria-current={tab === "rejected" ? "page" : undefined} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${tab === "rejected" ? "bg-black text-white" : "text-gray-600 transition hover:bg-gray-100"}`}>Ditolak ({rejectedCount})</Link>
      </nav>

      <div className="mt-5 space-y-4">
        {menfesses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
            <Clock3 aria-hidden="true" className="mx-auto h-7 w-7 text-gray-400" />
            <p className="mt-3 font-semibold text-gray-900">{tab === "pending" ? "Belum ada kiriman menunggu" : "Belum ada menfess di status ini"}</p>
            <p className="mt-1 text-sm text-gray-500">Kiriman baru akan muncul di antrean untuk ditinjau.</p>
          </div>
        ) : menfesses.map((item) => (
          <article key={item.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.3)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ backgroundColor: item.color }} />
                <span>Dari <strong className="font-semibold text-gray-700">{item.senderName ?? "Anonim"}</strong></span>
                <span aria-hidden="true">·</span>
                <time dateTime={item.createdAt.toISOString()}>{formatDate.format(item.createdAt)}</time>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "APPROVED" ? "bg-green-50 text-green-700" : item.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>
                {item.status === "APPROVED" ? "Disetujui" : item.status === "REJECTED" ? "Ditolak" : "Menunggu"}
              </span>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-gray-800">{item.content}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.status !== "APPROVED" && (
                <form action={updateMenfessStatusAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"><Check aria-hidden="true" className="h-4 w-4" /> Setujui</button>
                </form>
              )}
              {item.status !== "REJECTED" && (
                <form action={updateMenfessStatusAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="status" value="REJECTED" />
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"><X aria-hidden="true" className="h-4 w-4" /> Tolak</button>
                </form>
              )}
              {item.status !== "PENDING" && (
                <form action={updateMenfessStatusAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="status" value="PENDING" />
                  <button type="submit" className="rounded-full px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100">Kembalikan ke antrean</button>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
