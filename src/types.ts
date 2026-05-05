/**
 * Core types for formblast validation library
 */

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export type Validator<T = unknown> = (
  value: T,
  fieldName: string
) => ValidationResult;

export type FieldSchema<T = unknown> = {
  required?: boolean;
  validators?: Validator<T>[];
  label?: string;
};

export type FormSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: FieldSchema<T[K]>;
};

export type FormErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string[];
};

export type FormValidationResult<T extends Record<string, unknown>> = {
  valid: boolean;
  errors: FormErrors<T>;
};
