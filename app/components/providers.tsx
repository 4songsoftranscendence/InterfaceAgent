"use client";

import { ApiKeyProvider } from "@/app/lib/api-key-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApiKeyProvider>{children}</ApiKeyProvider>;
}
