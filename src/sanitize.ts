import { FieldSchema } from './types';

export type SanitizerFn<T> = (value: T) => T;

export interface SanitizeOptions<T> {
  sanitizers: SanitizerFn<T>[];
  stopOnNull?: boolean;
}

/**
 * Apply a list of sanitizer functions to a value in sequence.
 */
export function sanitizeValue<T>(value: T, options: SanitizeOptions<T>): T {
  const { sanitizers, stopOnNull = true } = options;
  let result = value;
  for (const sanitizer of sanitizers) {
    if (stopOnNull && (result === null || result === undefined)) break;
    result = sanitizer(result);
  }
  return result;
}

/**
 * Strip HTML tags from a string value.
 */
export const stripHtml: SanitizerFn<string> = (value) =>
  value.replace(/<[^>]*>/g, '');

/**
 * Collapse multiple whitespace characters into a single space.
 */
export const collapseWhitespace: SanitizerFn<string> = (value) =>
  value.replace(/\s+/g, ' ').trim();

/**
 * Remove non-printable / control characters from a string.
 */
export const removeControlChars: SanitizerFn<string> = (value) =>
  // eslint-disable-next-line no-control-regex
  value.replace(/[\x00-\x1F\x7F]/g, '');

/**
 * Truncate a string to a maximum length.
 */
export function truncate(maxLen: number): SanitizerFn<string> {
  return (value) => value.slice(0, maxLen);
}

/**
 * Create a sanitize schema entry that wraps a field schema with sanitizers.
 */
export function withSanitizers<T extends Record<string, unknown>>(
  schema: FieldSchema<T, string>,
  sanitizers: SanitizerFn<string>[]
): FieldSchema<T, string> {
  return {
    ...schema,
    transform: (value: string, data: T) => {
      const sanitized = sanitizeValue(value, { sanitizers });
      return schema.transform ? schema.transform(sanitized, data) : sanitized;
    },
  };
}
