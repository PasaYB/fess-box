import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 p-0 md:p-6">
      <div className="relative flex h-full w-full max-w-360 overflow-hidden md:rounded-3xl bg-white">
        
        <Sidebar />

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="absolute inset-x-0 top-0 z-30 px-3 pt-3 md:static md:px-0 md:pt-0">
            <Navbar />
          </div>

          <main className="flex-1 overflow-y-auto px-3 pb-8 pt-20 md:px-10 md:pb-10 md:pt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
