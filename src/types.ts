export type Validator<T> = (value: T) => string | null;

export interface FieldSchema<T> {
  validators: Validator<T>[];
  required?: boolean;
  requiredMessage?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export type FormSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: FieldSchema<T[K]>;
};

export type FormValidationResult<T extends Record<string, unknown>> = {
  [K in keyof T]: ValidationResult;
};
