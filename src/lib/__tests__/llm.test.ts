import { describe, it, expect } from "vitest";
import { extractJsonFromLLMResponse } from "../llm";

describe("extractJsonFromLLMResponse", () => {
  it("extracts bare JSON object", () => {
    const result = extractJsonFromLLMResponse('{"a": 1}');
    expect(JSON.parse(result)).toEqual({ a: 1 });
  });

  it("extracts JSON from markdown json code fence", () => {
    const result = extractJsonFromLLMResponse('```json\n{"a": 1}\n```');
    expect(JSON.parse(result)).toEqual({ a: 1 });
  });

  it("extracts JSON from plain code fence", () => {
    const result = extractJsonFromLLMResponse('```\n{"a": 1}\n```');
    expect(JSON.parse(result)).toEqual({ a: 1 });
  });

  it("extracts JSON embedded in prose text", () => {
    const result = extractJsonFromLLMResponse(
      'Here is the result: {"a": 1} Hope this helps!'
    );
    expect(JSON.parse(result)).toEqual({ a: 1 });
  });

  it("handles nested braces correctly", () => {
    const input = '{"a": {"b": {"c": 1}}}';
    const result = extractJsonFromLLMResponse(input);
    expect(JSON.parse(result)).toEqual({ a: { b: { c: 1 } } });
  });

  it("returns original string if no JSON found", () => {
    const input = "no json here at all";
    const result = extractJsonFromLLMResponse(input);
    expect(result).toBe(input);
  });

  it("handles empty string input", () => {
    const result = extractJsonFromLLMResponse("");
    expect(result).toBe("");
  });

  it("handles string with only opening brace", () => {
    // Only one brace — firstBrace === lastBrace, but it's not a valid JSON
    // The function still returns it since lastBrace > firstBrace is false for `{`
    const result = extractJsonFromLLMResponse("{");
    expect(result).toBe("{");
  });

  it("takes outermost braces when multiple objects present", () => {
    const input = 'prefix {"outer": {"inner": 1}} suffix';
    const result = extractJsonFromLLMResponse(input);
    expect(JSON.parse(result)).toEqual({ outer: { inner: 1 } });
  });

  it("strips leading/trailing whitespace around JSON in fences", () => {
    const result = extractJsonFromLLMResponse(
      '```json\n  {"a": 1}  \n```'
    );
    expect(JSON.parse(result)).toEqual({ a: 1 });
  });
});
