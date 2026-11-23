import type { Metadata } from "next";
import "./globals.css";

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
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 p-0 md:p-6">
          <div className="relative flex h-full w-full max-w-360 overflow-hidden bg-white md:rounded-3xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}