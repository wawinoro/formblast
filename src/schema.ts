import { FieldSchema, FormSchema, ValidationResult, FormValidationResult } from './types';
import { validateField } from './validate';

/**
 * Validates an entire form object against a schema definition.
 * Returns a map of field names to their validation results.
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  schema: FormSchema<T>
): FormValidationResult<T> {
  const result = {} as FormValidationResult<T>;

  for (const key in schema) {
    if (!Object.prototype.hasOwnProperty.call(schema, key)) continue;

    const fieldSchema = schema[key] as FieldSchema<T[typeof key]>;
    const value = data[key];

    result[key] = validateField(value, fieldSchema);
  }

  return result;
}

/**
 * Returns true if all fields in a FormValidationResult are valid.
 */
export function isFormValid<T extends Record<string, unknown>>(
  result: FormValidationResult<T>
): boolean {
  return Object.values(result).every(
    (fieldResult) => (fieldResult as ValidationResult).valid
  );
}

/**
 * Collects all error messages from a FormValidationResult into a flat record.
 * Only the first error per field is included.
 */
export function getFormErrors<T extends Record<string, unknown>>(
  result: FormValidationResult<T>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const key in result) {
    const fieldResult = result[key] as ValidationResult;
    if (!fieldResult.valid && fieldResult.errors.length > 0) {
      errors[key as keyof T] = fieldResult.errors[0];
    }
  }

  return errors;
}

/**
 * Collects all error messages from a FormValidationResult into a flat record,
 * returning every error per field rather than just the first.
 */
export function getAllFormErrors<T extends Record<string, unknown>>(
  result: FormValidationResult<T>
): Partial<Record<keyof T, string[]>> {
  const errors: Partial<Record<keyof T, string[]>> = {};

  for (const key in result) {
    const fieldResult = result[key] as ValidationResult;
    if (!fieldResult.valid && fieldResult.errors.length > 0) {
      errors[key as keyof T] = fieldResult.errors;
    }
  }

  return errors;
}
