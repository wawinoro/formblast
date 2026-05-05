import { FieldSchema, ValidationContext } from './types';

/**
 * Returns a validator/formatter pipeline that only applies when a condition is met.
 */
export function when<T extends Record<string, unknown>>(
  predicate: (values: T) => boolean,
  schema: Partial<FieldSchema<T>>
): Partial<FieldSchema<T>> {
  return {
    validators: [
      (value, context) => {
        if (!context?.values || !predicate(context.values as T)) {
          return null;
        }
        const errors: string[] = [];
        for (const validator of schema.validators ?? []) {
          const result = validator(value, context);
          if (result) errors.push(result);
        }
        return errors.length > 0 ? errors[0] : null;
      },
    ],
  };
}

/**
 * Marks a field as required only when the predicate returns true.
 */
export function requiredWhen<T extends Record<string, unknown>>(
  predicate: (values: T) => boolean,
  message = 'This field is required'
): (value: unknown, context?: ValidationContext<T>) => string | null {
  return (value, context) => {
    if (!context?.values || !predicate(context.values as T)) {
      return null;
    }
    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '');
    return isEmpty ? message : null;
  };
}

/**
 * Skips all validators when the predicate returns true (e.g. field is disabled).
 */
export function skipWhen<T extends Record<string, unknown>>(
  predicate: (values: T) => boolean,
  validator: (value: unknown, context?: ValidationContext<T>) => string | null
): (value: unknown, context?: ValidationContext<T>) => string | null {
  return (value, context) => {
    if (context?.values && predicate(context.values as T)) {
      return null;
    }
    return validator(value, context);
  };
}
