import { FieldSchema, ValidationResult } from './types';

/**
 * Cross-field validation rule: validates one field in the context of other field values.
 */
export type CrossFieldRule<T extends Record<string, unknown>> = {
  fields: (keyof T)[];
  validate: (values: Partial<T>) => string | null;
  message?: string;
};

/**
 * Cross-field validation result: maps each involved field to its error (if any).
 */
export type CrossFieldResult<T extends Record<string, unknown>> = {
  [K in keyof T]?: string | null;
};

/**
 * Defines a cross-field rule.
 */
export function defineCrossFieldRule<T extends Record<string, unknown>>(
  fields: (keyof T)[],
  validate: (values: Partial<T>) => string | null,
  message?: string
): CrossFieldRule<T> {
  return { fields, validate, message };
}

/**
 * Runs all cross-field rules against the provided form values.
 * Returns a map of field keys to error messages.
 */
export function validateCrossFields<T extends Record<string, unknown>>(
  values: Partial<T>,
  rules: CrossFieldRule<T>[]
): CrossFieldResult<T> {
  const result: CrossFieldResult<T> = {};

  for (const rule of rules) {
    const error = rule.validate(values);
    if (error !== null) {
      const message = rule.message ?? error;
      for (const field of rule.fields) {
        if (!result[field]) {
          result[field] = message;
        }
      }
    }
  }

  return result;
}

/**
 * Checks whether any cross-field errors exist.
 */
export function hasCrossFieldErrors<T extends Record<string, unknown>>(
  result: CrossFieldResult<T>
): boolean {
  return Object.values(result).some((v) => v != null && v !== '');
}
