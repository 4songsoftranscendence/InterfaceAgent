// ============================================
// DESIGN SCOUT — Website Crawler
// ============================================
// Uses Playwright to visit sites, capture screenshots, and extract metadata.
// No Browserbase account needed — runs locally.

import { chromium, type Browser, type Page } from "playwright";
import * as fs from "fs/promises";
import * as path from "path";
import type { CrawlResult, Screenshot } from "../types/index";
import { getCachedCrawl, setCachedCrawl } from "../lib/crawl-cache";

interface CrawlOptions {
  width?: number;
  height?: number;
  outputDir?: string;
  sections?: ("full" | "above-fold" | "hero" | "footer" | "mobile" | "tablet")[];
}

const DEFAULT_OPTIONS: CrawlOptions = {
  width: 1440,
  height: 900,
  outputDir: "./output/screenshots",
  sections: ["full", "above-fold", "mobile", "tablet"],
};

export async function crawlSite(
  url: string,
  opts: CrawlOptions = {}
): Promise<CrawlResult> {
  // Check cache first
  const cached = await getCachedCrawl(url);
  if (cached) {
    console.log(`🔍 Cache hit for: ${url} (${cached.screenshots.length} screenshots)`);
    return cached;
  }

  const options = { ...DEFAULT_OPTIONS, ...opts };
  const outputDir = options.outputDir!;
  await fs.mkdir(outputDir, { recursive: true });

  let browser: Browser | null = null;

  try {
    console.log(`🔍 Crawling: ${url}`);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: options.width!, height: options.height! },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    // Navigate and wait for network idle
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    // Extra wait for lazy-loaded content / animations
    await page.waitForTimeout(2000);

    // Extract metadata
    const pageTitle = await page.title();
    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute("content")
      .catch(() => undefined);

    // Extract fonts and colors from computed styles
    const { fonts, colors } = await extractDesignTokens(page);

    // Detect tech stack from page source
    const techStack = await detectTechStack(page);

    // Take screenshots based on requested sections
    const screenshots: Screenshot[] = [];
    const slug = new URL(url).hostname.replace(/\./g, "-");

    for (const section of options.sections!) {
      const screenshot = await captureSection(
        page,
        section,
        slug,
        outputDir,
        options
      );
      if (screenshot) screenshots.push(screenshot);
    }

    console.log(
      `   ✅ Captured ${screenshots.length} screenshots from ${url}`
    );

    const result: CrawlResult = {
      url,
      pageTitle,
      metaDescription: metaDescription ?? undefined,
      screenshots,
      fonts,
      colors,
      techStack,
      crawledAt: new Date().toISOString(),
    };

    // Store in cache for future runs (non-blocking, non-fatal)
    await setCachedCrawl(url, result).catch(() => {});

    return result;
  } catch (error) {
    console.error(`   ❌ Failed to crawl ${url}:`, error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

async function captureSection(
  page: Page,
  section: string,
  slug: string,
  outputDir: string,
  options: CrawlOptions
): Promise<Screenshot | null> {
  const filename = `${slug}-${section}-${Date.now()}.png`;
  const filepath = path.join(outputDir, filename);

  try {
    switch (section) {
      case "full": {
        await page.screenshot({ path: filepath, fullPage: true });
        break;
      }
      case "above-fold": {
        await page.screenshot({
          path: filepath,
          clip: {
            x: 0,
            y: 0,
            width: options.width!,
            height: options.height!,
          },
        });
        break;
      }
      case "hero": {
        // Try to find common hero selectors
        const heroSelectors = [
          "header + section",
          "header + div",
          '[class*="hero"]',
          '[class*="Hero"]',
          '[id*="hero"]',
          "main > section:first-child",
          "main > div:first-child",
        ];
        for (const selector of heroSelectors) {
          const el = page.locator(selector).first();
          if ((await el.count()) > 0) {
            await el.screenshot({ path: filepath });
            break;
          }
        }
        break;
      }
      case "footer": {
        const footer = page.locator("footer").first();
        if ((await footer.count()) > 0) {
          await footer.screenshot({ path: filepath });
        }
        break;
      }
      case "tablet": {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: filepath });
        await page.setViewportSize({
          width: options.width!,
          height: options.height!,
        });
        await page.waitForTimeout(500);
        break;
      }
      case "mobile": {
        // Resize to mobile viewport, screenshot, then restore
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: filepath });
        await page.setViewportSize({
          width: options.width!,
          height: options.height!,
        });
        await page.waitForTimeout(500);
        break;
      }
    }

    // Check if file was actually created
    try {
      await fs.access(filepath);
    } catch {
      return null;
    }

    // Read file and convert to base64
    const buffer = await fs.readFile(filepath);
    const base64 = buffer.toString("base64");

    // Assign scroll depth and viewport metadata
    const SCROLL_DEPTHS: Record<string, number> = {
      "above-fold": 0,
      hero: 5,
      full: 50,
      footer: 95,
      tablet: 0,
      mobile: 0,
    };

    return {
      filepath,
      base64,
      viewport:
        section === "mobile"
          ? "mobile-390x844"
          : section === "tablet"
            ? "tablet-768x1024"
            : `desktop-${options.width}x${options.height}`,
      section,
      scrollDepth: SCROLL_DEPTHS[section] ?? 0,
    };
  } catch (error) {
    console.warn(`   ⚠️  Could not capture ${section} for ${slug}`);
    return null;
  }
}

async function extractDesignTokens(
  page: Page
): Promise<{ fonts: string[]; colors: string[] }> {
  try {
    const tokens = await page.evaluate(() => {
      const fontSet = new Set<string>();
      const colorSet = new Set<string>();

      // PHASE 1: Extract from CSS custom properties (preferred — these ARE the design system)
      try {
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            for (const rule of Array.from(sheet.cssRules)) {
              if (
                rule instanceof CSSStyleRule &&
                rule.selectorText === ":root"
              ) {
                const style = rule.style;
                for (let i = 0; i < style.length; i++) {
                  const name = style[i];
                  const prop = style.getPropertyValue(name).trim();
                  if (!prop) continue;
                  if (
                    name.startsWith("--color") ||
                    name.startsWith("--clr") ||
                    /--[\w-]*colou?r/i.test(name)
                  ) {
                    colorSet.add(prop);
                  }
                  if (
                    name.startsWith("--font") ||
                    /--[\w-]*font/i.test(name)
                  ) {
                    fontSet.add(
                      prop.split(",")[0].trim().replace(/['"]/g, "")
                    );
                  }
                }
              }
            }
          } catch {
            /* cross-origin sheet, skip */
          }
        }
      } catch {
        /* stylesheet access failed */
      }

      // PHASE 2: Fall back to computed styles if custom properties yielded little
      if (colorSet.size < 3 || fontSet.size < 2) {
        const allElements = document.querySelectorAll("*");
        const sample = Array.from(allElements).slice(0, 200);
        for (const el of sample) {
          const style = window.getComputedStyle(el);
          if (style.fontFamily) {
            const primary = style.fontFamily
              .split(",")[0]
              .trim()
              .replace(/['"]/g, "");
            if (primary) fontSet.add(primary);
          }
          if (style.color) colorSet.add(style.color);
          if (
            style.backgroundColor &&
            style.backgroundColor !== "rgba(0, 0, 0, 0)"
          )
            colorSet.add(style.backgroundColor);
        }
      }

      // PHASE 3: Deduplicate colors by rounding RGB to nearest 5
      function roundRgb(color: string): string {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = Math.round(parseInt(match[1]) / 5) * 5;
          const g = Math.round(parseInt(match[2]) / 5) * 5;
          const b = Math.round(parseInt(match[3]) / 5) * 5;
          return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
      }

      const roundedColors = new Set<string>();
      for (const c of colorSet) {
        roundedColors.add(roundRgb(c));
      }

      return {
        fonts: Array.from(fontSet).slice(0, 4),
        colors: Array.from(roundedColors).slice(0, 8),
      };
    });
    return tokens;
  } catch {
    return { fonts: [], colors: [] };
  }
}

async function detectTechStack(page: Page): Promise<string[]> {
  try {
    return await page.evaluate(() => {
      const stack: string[] = [];
      const html = document.documentElement.outerHTML;

      if (html.includes("__next") || html.includes("_next")) stack.push("Next.js");
      if (html.includes("__nuxt")) stack.push("Nuxt");
      if ((window as any).__GATSBY) stack.push("Gatsby");
      if (html.includes("wp-content")) stack.push("WordPress");
      if (html.includes("Shopify")) stack.push("Shopify");
      if (html.includes("webflow")) stack.push("Webflow");
      if (html.includes("framer")) stack.push("Framer");
      if (html.includes("wix.com")) stack.push("Wix");
      if (html.includes("squarespace")) stack.push("Squarespace");
      if (document.querySelector('[class*="tailwind"], [class*="tw-"]') || 
          html.match(/\b(flex|grid|gap-|p-|m-|text-|bg-|rounded-)/))
        stack.push("Tailwind (likely)");
      if (document.querySelector("[data-framer-component-type]")) stack.push("Framer Motion");

      return stack;
    });
  } catch {
    return [];
  }
}

// Batch crawl multiple URLs
export async function crawlMultiple(
  urls: string[],
  opts: CrawlOptions = {}
): Promise<CrawlResult[]> {
  const results: CrawlResult[] = [];
  for (const url of urls) {
    try {
      const result = await crawlSite(url, opts);
      results.push(result);
    } catch (error) {
      console.error(`Skipping ${url} due to error`);
    }
  }
  return results;
}
