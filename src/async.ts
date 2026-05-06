import { FieldSchema } from './types';

export type AsyncValidator<T> = (value: T) => Promise<string[]>;

export type AsyncFieldSchema<T> = FieldSchema<T> & {
  asyncValidators?: AsyncValidator<T>[];
  asyncDebounce?: number;
};

export type AsyncValidationResult = {
  errors: string[];
  pending: boolean;
};

/**
 * Runs all async validators for a field in parallel and collects errors.
 */
export async function runAsyncValidators<T>(
  value: T,
  validators: AsyncValidator<T>[]
): Promise<string[]> {
  if (!validators || validators.length === 0) return [];

  const results = await Promise.allSettled(validators.map((v) => v(value)));

  const errors: string[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      errors.push(...result.value);
    } else {
      errors.push('Async validation failed');
    }
  }
  return errors;
}

/**
 * Combines sync and async validation for a field schema.
 * Sync validators run first; async validators run only if sync passes.
 */
export async function validateFieldAsync<T>(
  value: T,
  schema: AsyncFieldSchema<T>,
  syncValidateFn: (value: T, schema: FieldSchema<T>) => string[]
): Promise<string[]> {
  const syncErrors = syncValidateFn(value, schema);
  if (syncErrors.length > 0) return syncErrors;

  if (!schema.asyncValidators || schema.asyncValidators.length === 0) {
    return [];
  }

  return runAsyncValidators(value, schema.asyncValidators);
}

/**
 * Creates an async validator that checks uniqueness via a provided lookup function.
 */
export function uniqueAsync<T>(
  checkExists: (value: T) => Promise<boolean>,
  message = 'Value already exists'
): AsyncValidator<T> {
  return async (value: T): Promise<string[]> => {
    const exists = await checkExists(value);
    return exists ? [message] : [];
  };
}

/**
 * Creates an async validator from a remote URL check (fetch-based).
 */
export function remoteValidator(
  buildUrl: (value: string) => string,
  extractErrors: (data: unknown) => string[]
): AsyncValidator<string> {
  return async (value: string): Promise<string[]> => {
    const response = await fetch(buildUrl(value));
    if (!response.ok) return ['Remote validation failed'];
    const data = await response.json();
    return extractErrors(data);
  };
}
