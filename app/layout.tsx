import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/components/providers";
import { Header } from "@/app/components/header";

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
        <Providers>
          <Header />
          <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
