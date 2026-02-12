import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Scout",
  description: "AI Design Research Agent — Crawl websites, analyze UI/UX, generate design briefs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <a href="/" className="text-xl font-bold tracking-tight">
              Design Scout
            </a>
            <span className="text-sm text-gray-400">v0.2</span>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
