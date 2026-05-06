import { FieldSchema, ValidationResult } from './types';

export type DependencyMap<T extends Record<string, unknown>> = {
  [K in keyof T]?: (keyof T)[];
};

export type DependentValidationResult<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationResult;
};

/**
 * Creates a dependency map that tracks which fields depend on others.
 * When a source field changes, all dependent fields are re-validated.
 */
export function createDependencyMap<T extends Record<string, unknown>>(
  deps: DependencyMap<T>
): DependencyMap<T> {
  return { ...deps };
}

/**
 * Validates all fields that depend on the changed field.
 */
export function validateDependents<T extends Record<string, unknown>>(
  changedField: keyof T,
  values: T,
  schemas: { [K in keyof T]?: FieldSchema<T[K], T> },
  dependencyMap: DependencyMap<T>
): DependentValidationResult<T> {
  const result: DependentValidationResult<T> = {};
  const dependents = dependencyMap[changedField] ?? [];

  for (const dep of dependents) {
    const schema = schemas[dep];
    if (!schema || !schema.validators) continue;

    const value = values[dep];
    const errors: string[] = [];

    for (const validator of schema.validators) {
      const vResult = validator(value, values);
      if (!vResult.valid && vResult.message) {
        errors.push(vResult.message);
      }
    }

    result[dep] = {
      valid: errors.length === 0,
      errors,
    };
  }

  return result;
}

/**
 * Returns the list of fields that depend on the given field.
 */
export function getDependents<T extends Record<string, unknown>>(
  field: keyof T,
  dependencyMap: DependencyMap<T>
): (keyof T)[] {
  return dependencyMap[field] ?? [];
}

/**
 * Checks whether a field has any registered dependents.
 */
export function hasDependents<T extends Record<string, unknown>>(
  field: keyof T,
  dependencyMap: DependencyMap<T>
): boolean {
  return (dependencyMap[field]?.length ?? 0) > 0;
}
