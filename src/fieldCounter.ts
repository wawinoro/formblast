/**
 * fieldCounter.ts
 * Tracks character/word counts for text fields and provides
 * limit-aware metadata useful for rendering counters in UI.
 */

export interface CounterOptions {
  maxLength?: number;
  maxWords?: number;
  countWords?: boolean;
}

export interface CounterState {
  charCount: number;
  wordCount: number;
  charsRemaining: number | null;
  wordsRemaining: number | null;
  isOverLimit: boolean;
  percentUsed: number | null;
}

export function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function createFieldCounter(options: CounterOptions = {}) {
  const { maxLength, maxWords, countWords: enableWordCount = false } = options;

  function getCount(value: string): CounterState {
    const charCount = value.length;
    const wordCount = enableWordCount || maxWords != null ? countWords(value) : 0;

    const charsRemaining = maxLength != null ? maxLength - charCount : null;
    const wordsRemaining = maxWords != null ? maxWords - wordCount : null;

    const isOverLimit =
      (charsRemaining != null && charsRemaining < 0) ||
      (wordsRemaining != null && wordsRemaining < 0);

    let percentUsed: number | null = null;
    if (maxLength != null) {
      percentUsed = Math.min(100, Math.round((charCount / maxLength) * 100));
    } else if (maxWords != null && wordCount > 0) {
      percentUsed = Math.min(100, Math.round((wordCount / maxWords) * 100));
    }

    return {
      charCount,
      wordCount,
      charsRemaining,
      wordsRemaining,
      isOverLimit,
      percentUsed,
    };
  }

  function isValid(value: string): boolean {
    const { isOverLimit } = getCount(value);
    return !isOverLimit;
  }

  return { getCount, isValid };
}
