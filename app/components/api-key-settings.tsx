"use client";

import { useState, useEffect } from "react";
import { useApiKey } from "@/app/lib/api-key-context";

export function ApiKeySettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { apiKey, setApiKey, clearApiKey, hasKey } = useApiKey();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (open) setInput(apiKey);
  }, [open, apiKey]);

  if (!open) return null;

  function handleSave() {
    const trimmed = input.trim();
    if (trimmed) {
      setApiKey(trimmed);
      onClose();
    }
  }

  function handleClear() {
    clearApiKey();
    setInput("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900">API Key Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your key is stored in your browser only. It is never saved on our server.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            OpenRouter API Key
          </label>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="sk-or-v1-..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400">
            Get a key at{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              openrouter.ai/keys
            </a>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            {hasKey && (
              <button
                onClick={handleClear}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Clear key
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!input.trim()}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
