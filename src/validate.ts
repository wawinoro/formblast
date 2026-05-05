import type {
  FieldSchema,
  FormSchema,
  FormValidationResult,
  ValidationResult,
} from "./types";

/**
 * Validates a single field value against its schema.
 */
export function validateField<T>(
  value: T,
  fieldName: string,
  schema: FieldSchema<T>
): ValidationResult {
  const errors: string[] = [];
  const label = schema.label ?? fieldName;

  if (schema.required) {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "");
    if (isEmpty) {
      errors.push(`${label} is required.`);
    }
  }

  if (schema.validators && value !== null && value !== undefined) {
    for (const validator of schema.validators) {
      const result = validator(value, label);
      if (!result.valid) {
        errors.push(...result.errors);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates an entire form data object against a schema.
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  schema: FormSchema<T>
): FormValidationResult<T> {
  let formValid = true;
  const errors: FormValidationResult<T>["errors"] = {};

  for (const key in schema) {
    const fieldSchema = schema[key];
    if (!fieldSchema) continue;

    const result = validateField(data[key], key, fieldSchema as FieldSchema);
    if (!result.valid) {
      formValid = false;
      errors[key as keyof T] = result.errors;
    }
  }

  return { valid: formValid, errors };
}
