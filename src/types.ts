import { ValidatorFn } from './validate';
import { TransformFn } from './transforms';

export type FieldError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: FieldError[];
};

export type FieldSchema<T extends Record<string, unknown>, K extends keyof T> = {
  validators?: ValidatorFn<T[K]>[];
  transforms?: TransformFn<T[K]>[];
  conditions?: ((data: T) => boolean)[];
  label?: string;
};

export type Schema<T extends Record<string, unknown>> = {
  [K in keyof T]?: FieldSchema<T, K>;
};
