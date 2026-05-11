import { ValidationResult } from './types';
import { DependencyGraph } from './fieldDependencyGraph';

export interface RevalidateOptions<T extends Record<string, unknown>> {
  graph: DependencyGraph;
  values: T;
  changedField: keyof T;
  validateFn: (field: keyof T, values: T) => ValidationResult;
}

export interface RevalidateResult<T extends Record<string, unknown>> {
  revalidated: Array<keyof T>;
  results: Partial<Record<keyof T, ValidationResult>>;
}

export function revalidateDependents<T extends Record<string, unknown>>(
  options: RevalidateOptions<T>
): RevalidateResult<T> {
  const { graph, values, changedField, validateFn } = options;
  const results: Partial<Record<keyof T, ValidationResult>> = {};
  const revalidated: Array<keyof T> = [];
  const queue: string[] = [...graph.getDependents(changedField as string)];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const field = queue.shift()!;
    if (visited.has(field)) continue;
    visited.add(field);

    const result = validateFn(field as keyof T, values);
    results[field as keyof T] = result;
    revalidated.push(field as keyof T);

    for (const dependent of graph.getDependents(field)) {
      if (!visited.has(dependent)) {
        queue.push(dependent);
      }
    }
  }

  return { revalidated, results };
}

export function revalidateAll<T extends Record<string, unknown>>(
  fields: Array<keyof T>,
  values: T,
  validateFn: (field: keyof T, values: T) => ValidationResult
): Partial<Record<keyof T, ValidationResult>> {
  const results: Partial<Record<keyof T, ValidationResult>> = {};
  for (const field of fields) {
    results[field] = validateFn(field, values);
  }
  return results;
}
