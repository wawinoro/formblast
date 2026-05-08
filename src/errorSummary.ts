import { FieldSchema } from './types';

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorSummary {
  hasErrors: boolean;
  count: number;
  errors: FieldError[];
  firstError: FieldError | null;
  byField: Record<string, string>;
}

export function createErrorSummary(
  results: Record<string, string | null | undefined>
): ErrorSummary {
  const errors: FieldError[] = [];

  for (const [field, message] of Object.entries(results)) {
    if (message) {
      errors.push({ field, message });
    }
  }

  const byField: Record<string, string> = {};
  for (const { field, message } of errors) {
    byField[field] = message;
  }

  return {
    hasErrors: errors.length > 0,
    count: errors.length,
    errors,
    firstError: errors[0] ?? null,
    byField,
  };
}

export function mergeErrorSummaries(...summaries: ErrorSummary[]): ErrorSummary {
  const allErrors: FieldError[] = summaries.flatMap((s) => s.errors);
  const byField: Record<string, string> = {};
  for (const { field, message } of allErrors) {
    if (!byField[field]) {
      byField[field] = message;
    }
  }

  return {
    hasErrors: allErrors.length > 0,
    count: allErrors.length,
    errors: allErrors,
    firstError: allErrors[0] ?? null,
    byField,
  };
}

export function filterErrorSummary(
  summary: ErrorSummary,
  fields: string[]
): ErrorSummary {
  const fieldSet = new Set(fields);
  const filtered = summary.errors.filter((e) => fieldSet.has(e.field));
  const byField: Record<string, string> = {};
  for (const { field, message } of filtered) {
    byField[field] = message;
  }
  return {
    hasErrors: filtered.length > 0,
    count: filtered.length,
    errors: filtered,
    firstError: filtered[0] ?? null,
    byField,
  };
}
