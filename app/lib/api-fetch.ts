export function apiFetch(
  url: string,
  options: RequestInit = {},
  apiKey?: string
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (apiKey) {
    headers.set("X-OpenRouter-Key", apiKey);
  }
  return fetch(url, { ...options, headers });
}
