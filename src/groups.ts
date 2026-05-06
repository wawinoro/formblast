import { FieldSchema, ValidationResult } from './types';
import { validateField } from './validate';

export type GroupSchema<T extends Record<string, unknown>> = {
  [K in keyof T]: FieldSchema<T[K]>;
};

export type GroupResult<T extends Record<string, unknown>> = {
  [K in keyof T]: ValidationResult;
};

export interface GroupValidationSummary<T extends Record<string, unknown>> {
  results: GroupResult<T>;
  valid: boolean;
  errors: Partial<Record<keyof T, string[]>>;
}

export function validateGroup<T extends Record<string, unknown>>(
  values: T,
  schema: GroupSchema<T>
): GroupValidationSummary<T> {
  const results = {} as GroupResult<T>;
  const errors: Partial<Record<keyof T, string[]>> = {};
  let valid = true;

  for (const key in schema) {
    if (!Object.prototype.hasOwnProperty.call(schema, key)) continue;
    const fieldSchema = schema[key];
    const value = values[key];
    const result = validateField(value, fieldSchema);
    results[key] = result;
    if (!result.valid) {
      valid = false;
      errors[key] = result.errors;
    }
  }

  return { results, valid, errors };
}

export function getGroupErrors<T extends Record<string, unknown>>(
  summary: GroupValidationSummary<T>
): string[] {
  return Object.values(summary.errors).flat() as string[];
}

export function getFieldError<T extends Record<string, unknown>>(
  summary: GroupValidationSummary<T>,
  field: keyof T
): string | undefined {
  const fieldErrors = summary.errors[field];
  return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined;
}
