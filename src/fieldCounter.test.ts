import { describe, it, expect } from "vitest";
import { countWords, createFieldCounter } from "./fieldCounter";

describe("countWords", () => {
  it("returns 0 for empty string", () => {
    expect(countWords("")).toBe(0);
  });

  it("returns 0 for whitespace-only string", () => {
    expect(countWords("   ")).toBe(0);
  });

  it("counts single word", () => {
    expect(countWords("hello")).toBe(1);
  });

  it("counts multiple words", () => {
    expect(countWords("hello world foo")).toBe(3);
  });

  it("handles extra spaces between words", () => {
    expect(countWords("hello   world")).toBe(2);
  });
});

describe("createFieldCounter", () => {
  it("returns charCount correctly", () => {
    const counter = createFieldCounter();
    expect(counter.getCount("hello").charCount).toBe(5);
  });

  it("charsRemaining is null when maxLength not set", () => {
    const counter = createFieldCounter();
    expect(counter.getCount("hello").charsRemaining).toBeNull();
  });

  it("calculates charsRemaining with maxLength", () => {
    const counter = createFieldCounter({ maxLength: 10 });
    const state = counter.getCount("hello");
    expect(state.charsRemaining).toBe(5);
    expect(state.percentUsed).toBe(50);
  });

  it("detects over char limit", () => {
    const counter = createFieldCounter({ maxLength: 3 });
    const state = counter.getCount("hello");
    expect(state.isOverLimit).toBe(true);
    expect(counter.isValid("hello")).toBe(false);
  });

  it("is valid when within char limit", () => {
    const counter = createFieldCounter({ maxLength: 10 });
    expect(counter.isValid("hello")).toBe(true);
  });

  it("counts words when countWords is enabled", () => {
    const counter = createFieldCounter({ countWords: true });
    const state = counter.getCount("hello world");
    expect(state.wordCount).toBe(2);
  });

  it("calculates wordsRemaining with maxWords", () => {
    const counter = createFieldCounter({ maxWords: 5 });
    const state = counter.getCount("one two three");
    expect(state.wordCount).toBe(3);
    expect(state.wordsRemaining).toBe(2);
  });

  it("detects over word limit", () => {
    const counter = createFieldCounter({ maxWords: 2 });
    const state = counter.getCount("one two three");
    expect(state.isOverLimit).toBe(true);
    expect(counter.isValid("one two three")).toBe(false);
  });

  it("percentUsed caps at 100", () => {
    const counter = createFieldCounter({ maxLength: 3 });
    const state = counter.getCount("toolongstring");
    expect(state.percentUsed).toBe(100);
  });

  it("percentUsed is null when no max set and no words", () => {
    const counter = createFieldCounter();
    const state = counter.getCount("hello");
    expect(state.percentUsed).toBeNull();
  });
});
