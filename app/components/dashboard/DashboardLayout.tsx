import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MenfessProvider from "@/app/components/notes/MenfessProvider";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <MenfessProvider>
      <Sidebar />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="absolute inset-x-0 top-0 z-30 px-3 pt-3 md:static md:px-0 md:pt-0">
          <Navbar />
        </div>

        <main className="flex-1 overflow-y-auto px-3 pb-8 pt-20 md:px-10 md:pb-10 md:pt-0">
          {children}
        </main>
      </div>
    </MenfessProvider>
  );
}
