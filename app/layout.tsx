import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Menfess",
  description: "Website menfess",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-gray-100 text-gray-900 antialiased">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}