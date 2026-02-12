"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ApiKeySettings } from "./api-key-settings";
import { useApiKey } from "@/app/lib/api-key-context";

const NAV_ITEMS = [
  { href: "/", label: "Scout" },
  { href: "/prompts", label: "Prompts" },
  { href: "/how-it-works", label: "How It Works" },
];

export function Header() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { hasKey } = useApiKey();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <a href="/" className="text-xl font-bold tracking-tight">
            Design Scout
          </a>
          <nav className="flex items-center gap-4">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="API Key Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {hasKey && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500" />
            )}
          </button>
          <span className="text-sm text-gray-400">v0.3</span>
        </div>
      </div>
      <ApiKeySettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}
