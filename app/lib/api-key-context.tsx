"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

const STORAGE_KEY = "design-scout-api-key";

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKeyState(stored);
  }, []);

  function setApiKey(key: string) {
    setApiKeyState(key);
    localStorage.setItem(STORAGE_KEY, key);
  }

  function clearApiKey() {
    setApiKeyState("");
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, hasKey: !!apiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error("useApiKey must be used within ApiKeyProvider");
  return ctx;
}
