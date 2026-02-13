import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs/promises";
import * as path from "path";
import { getCachedCrawl, setCachedCrawl, cleanExpiredCache } from "../crawl-cache";
import type { CrawlResult } from "../../types/index";

const TEST_CACHE_DIR = "./output/.crawl-cache";
const TEST_SCREENSHOT_DIR = "./output/screenshots";

function makeCrawlResult(url: string): CrawlResult {
  return {
    url,
    pageTitle: "Test Page",
    metaDescription: "A test page",
    screenshots: [
      {
        filepath: path.join(TEST_SCREENSHOT_DIR, "test-screenshot.png"),
        base64: "iVBORw0KGgoAAAANSUhEUg==", // tiny valid base64
        viewport: "desktop-1440x900",
        section: "full",
        scrollDepth: 50,
      },
    ],
    fonts: ["Inter", "Roboto"],
    colors: ["rgb(0, 0, 0)", "rgb(255, 255, 255)"],
    techStack: ["Next.js"],
    crawledAt: new Date().toISOString(),
  };
}

describe("crawl-cache", () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_CACHE_DIR, { recursive: true });
    await fs.mkdir(TEST_SCREENSHOT_DIR, { recursive: true });
  });

  afterEach(async () => {
    // Clean up cache files
    try {
      const files = await fs.readdir(TEST_CACHE_DIR);
      for (const f of files) {
        await fs.unlink(path.join(TEST_CACHE_DIR, f)).catch(() => {});
      }
    } catch { /* dir may not exist */ }
    // Clean up test screenshot
    await fs.unlink(path.join(TEST_SCREENSHOT_DIR, "test-screenshot.png")).catch(() => {});
  });

  it("returns null for uncached URL", async () => {
    const result = await getCachedCrawl("https://never-cached.com");
    expect(result).toBeNull();
  });

  it("stores and retrieves a crawl result", async () => {
    const url = "https://example.com";
    const crawl = makeCrawlResult(url);

    // Write the screenshot file so cache hit can re-read it
    await fs.writeFile(
      crawl.screenshots[0].filepath,
      Buffer.from(crawl.screenshots[0].base64, "base64")
    );

    await setCachedCrawl(url, crawl);
    const cached = await getCachedCrawl(url);

    expect(cached).not.toBeNull();
    expect(cached!.url).toBe(url);
    expect(cached!.pageTitle).toBe("Test Page");
    expect(cached!.fonts).toEqual(["Inter", "Roboto"]);
    expect(cached!.screenshots).toHaveLength(1);
    expect(cached!.screenshots[0].section).toBe("full");
    expect(cached!.screenshots[0].base64).toBeTruthy();
  });

  it("returns null after TTL expires", async () => {
    const url = "https://expired.com";
    const crawl = makeCrawlResult(url);

    await fs.writeFile(
      crawl.screenshots[0].filepath,
      Buffer.from(crawl.screenshots[0].base64, "base64")
    );

    await setCachedCrawl(url, crawl);

    // Use a 0ms TTL to force expiration
    const cached = await getCachedCrawl(url, 0);
    expect(cached).toBeNull();
  });

  it("returns null when screenshot files are missing", async () => {
    const url = "https://missing-screenshots.com";
    const crawl = makeCrawlResult(url);
    // Don't write the screenshot file

    await setCachedCrawl(url, crawl);
    const cached = await getCachedCrawl(url);

    expect(cached).toBeNull();
  });

  it("does not store base64 in cache file", async () => {
    const url = "https://no-base64.com";
    const crawl = makeCrawlResult(url);

    await setCachedCrawl(url, crawl);

    // Read the raw cache file
    const files = await fs.readdir(TEST_CACHE_DIR);
    const cacheFile = files.find((f) => f.endsWith(".json"));
    expect(cacheFile).toBeDefined();

    const raw = await fs.readFile(path.join(TEST_CACHE_DIR, cacheFile!), "utf-8");
    const parsed = JSON.parse(raw);

    // Screenshots in cache should NOT have base64
    for (const s of parsed.screenshots) {
      expect(s.base64).toBeUndefined();
    }
  });

  it("preserves metadata fields through cache round-trip", async () => {
    const url = "https://metadata.com";
    const crawl = makeCrawlResult(url);

    await fs.writeFile(
      crawl.screenshots[0].filepath,
      Buffer.from(crawl.screenshots[0].base64, "base64")
    );

    await setCachedCrawl(url, crawl);
    const cached = await getCachedCrawl(url);

    expect(cached!.metaDescription).toBe("A test page");
    expect(cached!.techStack).toEqual(["Next.js"]);
    expect(cached!.colors).toEqual(["rgb(0, 0, 0)", "rgb(255, 255, 255)"]);
    expect(cached!.screenshots[0].viewport).toBe("desktop-1440x900");
    expect(cached!.screenshots[0].scrollDepth).toBe(50);
  });
});

describe("cleanExpiredCache", () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_CACHE_DIR, { recursive: true });
  });

  afterEach(async () => {
    try {
      const files = await fs.readdir(TEST_CACHE_DIR);
      for (const f of files) {
        await fs.unlink(path.join(TEST_CACHE_DIR, f)).catch(() => {});
      }
    } catch { /* dir may not exist */ }
  });

  it("removes expired entries", async () => {
    const crawl = makeCrawlResult("https://old.com");
    await setCachedCrawl("https://old.com", crawl);

    // Clean with 0ms TTL — everything is expired
    const removed = await cleanExpiredCache(0);
    expect(removed).toBe(1);

    // Verify file is gone
    const files = await fs.readdir(TEST_CACHE_DIR);
    expect(files.filter((f) => f.endsWith(".json"))).toHaveLength(0);
  });

  it("keeps fresh entries", async () => {
    const crawl = makeCrawlResult("https://fresh.com");
    await setCachedCrawl("https://fresh.com", crawl);

    // Clean with large TTL — nothing expired
    const removed = await cleanExpiredCache(999_999_999);
    expect(removed).toBe(0);

    const files = await fs.readdir(TEST_CACHE_DIR);
    expect(files.filter((f) => f.endsWith(".json"))).toHaveLength(1);
  });

  it("returns 0 when cache dir does not exist", async () => {
    // Remove the cache dir
    try {
      const files = await fs.readdir(TEST_CACHE_DIR);
      for (const f of files) await fs.unlink(path.join(TEST_CACHE_DIR, f));
      await fs.rmdir(TEST_CACHE_DIR);
    } catch { /* ok */ }

    const removed = await cleanExpiredCache();
    expect(removed).toBe(0);
  });
});
