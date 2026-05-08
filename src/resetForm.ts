import { FieldSchema } from './types';

export interface ResetFormOptions<T extends Record<string, unknown>> {
  initialValues?: Partial<T>;
  keepTouched?: boolean;
  keepErrors?: boolean;
}

export interface FormResetState<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string[]>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  resetCount: number;
}

export function createResetForm<T extends Record<string, unknown>>(
  schema: Partial<Record<keyof T, FieldSchema<T[keyof T]>>>,
  defaults: T
) {
  let resetCount = 0;

  function reset(
    current: FormResetState<T>,
    options: ResetFormOptions<T> = {}
  ): FormResetState<T> {
    const { initialValues = {}, keepTouched = false, keepErrors = false } = options;

    const values = { ...defaults, ...initialValues } as T;

    const errors = keepErrors
      ? current.errors
      : ({} as Partial<Record<keyof T, string[]>>);

    const touched = keepTouched
      ? current.touched
      : ({} as Partial<Record<keyof T, boolean>>);

    resetCount += 1;

    return {
      values,
      errors,
      touched,
      dirty: {} as Partial<Record<keyof T, boolean>>,
      resetCount,
    };
  }

  function resetField<K extends keyof T>(
    current: FormResetState<T>,
    field: K,
    value?: T[K]
  ): FormResetState<T> {
    const nextValue = value !== undefined ? value : defaults[field];
    return {
      ...current,
      values: { ...current.values, [field]: nextValue },
      errors: { ...current.errors, [field]: undefined },
      touched: { ...current.touched, [field]: false },
      dirty: { ...current.dirty, [field]: false },
    };
  }

  function getResetCount(): number {
    return resetCount;
  }

  return { reset, resetField, getResetCount };
}
