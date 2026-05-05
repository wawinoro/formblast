import { FieldSchema } from './types';

/**
 * A transform function takes a value and returns a transformed value.
 */
export type TransformFn<T> = (value: T) => T;

/**
 * Applies a series of transform functions to a value in order.
 */
export function applyTransforms<T>(value: T, transforms: TransformFn<T>[]): T {
  return transforms.reduce((acc, fn) => fn(acc), value);
}

/**
 * Clamps a numeric value between min and max.
 */
export const clamp =
  (min: number, max: number): TransformFn<number> =>
  (value) =>
    Math.min(Math.max(value, min), max);

/**
 * Truncates a string to a maximum length.
 */
export const truncate =
  (maxLen: number): TransformFn<string> =>
  (value) =>
    typeof value === 'string' ? value.slice(0, maxLen) : value;

/**
 * Replaces all occurrences of a pattern in a string.
 */
export const replace =
  (search: string | RegExp, replacement: string): TransformFn<string> =>
  (value) =>
    typeof value === 'string' ? value.replace(search, replacement) : value;

/**
 * Converts a string to title case.
 */
export const titleCase: TransformFn<string> = (value) =>
  typeof value === 'string'
    ? value.replace(/\b\w/g, (c) => c.toUpperCase())
    : value;

/**
 * Rounds a numeric value to a given number of decimal places.
 */
export const roundTo =
  (decimals: number): TransformFn<number> =>
  (value) =>
    typeof value === 'number'
      ? Math.round(value * 10 ** decimals) / 10 ** decimals
      : value;

/**
 * Applies transforms defined on a field schema to its value.
 */
export function applyFieldTransforms<T extends Record<string, unknown>>(
  schema: FieldSchema<T, keyof T>,
  value: unknown
): unknown {
  if (!schema.transforms || schema.transforms.length === 0) return value;
  return applyTransforms(value as never, schema.transforms as TransformFn<never>[]);
}
