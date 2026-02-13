import { describe, it, expect } from "vitest";
import {
  roundRgb,
  deduplicateColors,
  cleanFontFamily,
} from "../../lib/token-extraction";

describe("roundRgb", () => {
  it("rounds RGB values to nearest 5", () => {
    expect(roundRgb("rgb(123, 67, 201)")).toBe("rgb(125, 65, 200)");
  });

  it("handles rgba format", () => {
    expect(roundRgb("rgba(123, 67, 201, 0.5)")).toBe("rgb(125, 65, 200)");
  });

  it("returns non-RGB colors unchanged", () => {
    expect(roundRgb("#ff0000")).toBe("#ff0000");
    expect(roundRgb("red")).toBe("red");
  });

  it("rounds 0 correctly", () => {
    expect(roundRgb("rgb(0, 0, 0)")).toBe("rgb(0, 0, 0)");
  });

  it("rounds 255 correctly", () => {
    expect(roundRgb("rgb(255, 255, 255)")).toBe("rgb(255, 255, 255)");
  });

  it("rounds 252 to 250", () => {
    expect(roundRgb("rgb(252, 252, 252)")).toBe("rgb(250, 250, 250)");
  });

  it("rounds 253 to 255", () => {
    expect(roundRgb("rgb(253, 253, 253)")).toBe("rgb(255, 255, 255)");
  });
});

describe("deduplicateColors", () => {
  it("deduplicates similar colors by rounding", () => {
    const colors = [
      "rgb(123, 67, 201)",
      "rgb(124, 66, 202)",
      "rgb(125, 65, 200)",
    ];
    const result = deduplicateColors(colors);
    // All three round to the same value
    expect(result).toHaveLength(1);
  });

  it("limits to specified count", () => {
    const colors = Array.from({ length: 20 }, (_, i) =>
      `rgb(${i * 15}, ${i * 15}, ${i * 15})`
    );
    const result = deduplicateColors(colors, 8);
    expect(result.length).toBeLessThanOrEqual(8);
  });

  it("handles empty array", () => {
    expect(deduplicateColors([])).toEqual([]);
  });

  it("handles hex colors (no dedup)", () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff"];
    const result = deduplicateColors(colors);
    expect(result).toHaveLength(3);
  });
});

describe("cleanFontFamily", () => {
  it("removes quotes from font name", () => {
    expect(cleanFontFamily("'Inter'")).toBe("Inter");
    expect(cleanFontFamily('"Inter"')).toBe("Inter");
  });

  it("extracts primary font from stack", () => {
    expect(cleanFontFamily("Inter, Helvetica, sans-serif")).toBe("Inter");
  });

  it("handles single font without quotes", () => {
    expect(cleanFontFamily("Roboto")).toBe("Roboto");
  });

  it("handles font with spaces", () => {
    expect(cleanFontFamily("'Open Sans', sans-serif")).toBe("Open Sans");
  });

  it("handles double-quoted font with spaces", () => {
    expect(cleanFontFamily('"Source Code Pro", monospace')).toBe(
      "Source Code Pro"
    );
  });
});
