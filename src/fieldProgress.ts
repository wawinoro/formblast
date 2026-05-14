import { FieldSchema } from './types';

export interface FieldProgressOptions<T extends Record<string, unknown>> {
  schema: FieldSchema<T>[];
  required?: (keyof T)[];
}

export interface FieldProgressState<T extends Record<string, unknown>> {
  total: number;
  completed: number;
  percent: number;
  remaining: (keyof T)[];
  isComplete: boolean;
}

export function createFieldProgress<T extends Record<string, unknown>>(
  options: FieldProgressOptions<T>
) {
  const { schema, required } = options;
  const trackedFields: (keyof T)[] = required ??
    schema.map((s) => s.field as keyof T);

  function evaluate(values: Partial<T>): FieldProgressState<T> {
    const total = trackedFields.length;
    const remaining: (keyof T)[] = [];

    for (const field of trackedFields) {
      const val = values[field];
      const isEmpty =
        val === undefined ||
        val === null ||
        (typeof val === 'string' && val.trim() === '');
      if (isEmpty) remaining.push(field);
    }

    const completed = total - remaining.length;
    const percent = total === 0 ? 100 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      percent,
      remaining,
      isComplete: remaining.length === 0,
    };
  }

  function getPercent(values: Partial<T>): number {
    return evaluate(values).percent;
  }

  function isComplete(values: Partial<T>): boolean {
    return evaluate(values).isComplete;
  }

  return { evaluate, getPercent, isComplete };
}
