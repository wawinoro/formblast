import { GroupSchema, GroupValidationSummary, validateGroup } from './groups';
import { applyTransforms } from './transforms';
import { TransformFn } from './types';

export type GroupTransforms<T extends Record<string, unknown>> = {
  [K in keyof T]?: TransformFn<T[K]>[];
};

export interface GroupPipelineOptions<T extends Record<string, unknown>> {
  transforms?: GroupTransforms<T>;
}

export function runGroupPipeline<T extends Record<string, unknown>>(
  values: T,
  schema: GroupSchema<T>,
  options: GroupPipelineOptions<T> = {}
): { transformed: T; summary: GroupValidationSummary<T> } {
  const transformed = { ...values };

  if (options.transforms) {
    for (const key in options.transforms) {
      if (!Object.prototype.hasOwnProperty.call(options.transforms, key)) continue;
      const fns = options.transforms[key];
      if (fns && fns.length > 0) {
        transformed[key] = applyTransforms(transformed[key], fns) as T[typeof key];
      }
    }
  }

  const summary = validateGroup(transformed, schema);
  return { transformed, summary };
}
