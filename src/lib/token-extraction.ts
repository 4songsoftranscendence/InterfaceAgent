// ============================================
// Design Token Extraction Logic (testable)
// ============================================
// Pure function extracted from crawler's page.evaluate for unit testing.

/**
 * Round an RGB color string to the nearest 5 for deduplication.
 */
export function roundRgb(color: string): string {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = Math.round(parseInt(match[1]) / 5) * 5;
    const g = Math.round(parseInt(match[2]) / 5) * 5;
    const b = Math.round(parseInt(match[3]) / 5) * 5;
    return `rgb(${r}, ${g}, ${b})`;
  }
  return color;
}

/**
 * Deduplicate and limit a set of colors.
 */
export function deduplicateColors(
  colors: string[],
  limit = 8
): string[] {
  const rounded = new Set<string>();
  for (const c of colors) {
    rounded.add(roundRgb(c));
  }
  return Array.from(rounded).slice(0, limit);
}

/**
 * Clean a font family string: remove quotes and extract primary font.
 */
export function cleanFontFamily(fontStack: string): string {
  return fontStack.split(",")[0].trim().replace(/['"]/g, "");
}
