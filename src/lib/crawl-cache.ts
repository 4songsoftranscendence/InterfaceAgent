// ============================================
// File-based Crawl Cache
// ============================================
// Caches CrawlResult metadata (no base64) to disk.
// On cache hit, re-reads screenshot files from their original paths.
// SHA256(url) → JSON file in ./output/.crawl-cache/
// TTL: 1 hour (configurable).

import * as fs from "fs/promises";
import * as path from "path";
import { createHash } from "crypto";
import type { CrawlResult, Screenshot } from "../types/index";

const CACHE_DIR = "./output/.crawl-cache";
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

/** Cached metadata — screenshots stored without base64 */
interface CachedCrawl {
  url: string;
  pageTitle: string;
  metaDescription?: string;
  fonts: string[];
  colors: string[];
  techStack?: string[];
  crawledAt: string;
  cachedAt: number; // Date.now() when cached
  screenshots: {
    filepath: string;
    viewport: string;
    section: string;
    scrollDepth?: number;
    label?: string;
  }[];
}

function cacheKey(url: string): string {
  return createHash("sha256").update(url).digest("hex");
}

function cachePath(url: string): string {
  return path.join(CACHE_DIR, `${cacheKey(url)}.json`);
}

/**
 * Retrieve a cached crawl result if it exists and hasn't expired.
 * Re-reads screenshot files from disk to reconstruct base64 data.
 */
export async function getCachedCrawl(
  url: string,
  ttlMs = DEFAULT_TTL_MS
): Promise<CrawlResult | null> {
  try {
    const filePath = cachePath(url);
    const raw = await fs.readFile(filePath, "utf-8");
    const cached: CachedCrawl = JSON.parse(raw);

    // Check TTL
    if (Date.now() - cached.cachedAt > ttlMs) {
      await fs.unlink(filePath).catch(() => {});
      return null;
    }

    // Re-read screenshot files from disk
    const screenshots: Screenshot[] = [];
    for (const s of cached.screenshots) {
      try {
        const buffer = await fs.readFile(s.filepath);
        screenshots.push({
          filepath: s.filepath,
          base64: buffer.toString("base64"),
          viewport: s.viewport,
          section: s.section,
          scrollDepth: s.scrollDepth,
          label: s.label,
        });
      } catch {
        // Screenshot file missing — skip it (partial cache hit is still useful)
      }
    }

    if (screenshots.length === 0) {
      // No screenshots recoverable — treat as cache miss
      await fs.unlink(filePath).catch(() => {});
      return null;
    }

    return {
      url: cached.url,
      pageTitle: cached.pageTitle,
      metaDescription: cached.metaDescription,
      screenshots,
      fonts: cached.fonts,
      colors: cached.colors,
      techStack: cached.techStack,
      crawledAt: cached.crawledAt,
    };
  } catch {
    return null;
  }
}

/**
 * Store a crawl result in the cache (metadata only, no base64).
 */
export async function setCachedCrawl(
  url: string,
  result: CrawlResult
): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });

    const cached: CachedCrawl = {
      url: result.url,
      pageTitle: result.pageTitle,
      metaDescription: result.metaDescription,
      fonts: result.fonts,
      colors: result.colors,
      techStack: result.techStack,
      crawledAt: result.crawledAt,
      cachedAt: Date.now(),
      screenshots: result.screenshots.map((s) => ({
        filepath: s.filepath,
        viewport: s.viewport,
        section: s.section,
        scrollDepth: s.scrollDepth,
        label: s.label,
      })),
    };

    await fs.writeFile(cachePath(url), JSON.stringify(cached), "utf-8");
  } catch {
    // Cache write failure is non-fatal — just skip
  }
}

/**
 * Remove all expired cache entries.
 */
export async function cleanExpiredCache(
  ttlMs = DEFAULT_TTL_MS
): Promise<number> {
  let removed = 0;
  try {
    const files = await fs.readdir(CACHE_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const filePath = path.join(CACHE_DIR, file);
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const cached: CachedCrawl = JSON.parse(raw);
        if (Date.now() - cached.cachedAt > ttlMs) {
          await fs.unlink(filePath);
          removed++;
        }
      } catch {
        // Corrupt file — remove it
        await fs.unlink(filePath).catch(() => {});
        removed++;
      }
    }
  } catch {
    // Cache dir doesn't exist — nothing to clean
  }
  return removed;
}
