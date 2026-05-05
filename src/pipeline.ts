import { Schema, ValidationResult } from './types';
import { applyFieldTransforms } from './transforms';
import { validateField } from './validate';

export type PipelineResult<T extends Record<string, unknown>> = {
  data: T;
  validation: ValidationResult;
};

/**
 * Runs transforms then validates a full form data object against a schema.
 * Returns the transformed data alongside the validation result.
 */
export function runPipeline<T extends Record<string, unknown>>(
  data: T,
  schema: Schema<T>
): PipelineResult<T> {
  const transformed = { ...data };

  // Apply transforms for each field
  for (const key of Object.keys(schema) as (keyof T)[]) {
    const fieldSchema = schema[key];
    if (!fieldSchema) continue;
    transformed[key] = applyFieldTransforms(
      fieldSchema as never,
      transformed[key]
    ) as T[typeof key];
  }

  const errors: ValidationResult['errors'] = [];

  // Validate each field using transformed values
  for (const key of Object.keys(schema) as (keyof T)[]) {
    const fieldSchema = schema[key];
    if (!fieldSchema) continue;

    const result = validateField(
      transformed[key],
      fieldSchema as never,
      transformed
    );

    if (!result.valid) {
      errors.push(
        ...result.errors.map((e) => ({ field: String(key), message: e.message }))
      );
    }
  }

  return {
    data: transformed,
    validation: {
      valid: errors.length === 0,
      errors,
    },
  };
}
