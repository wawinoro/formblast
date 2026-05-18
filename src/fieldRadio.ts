import type { ValidationResult } from './types';

export interface FieldRadioOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface FieldRadioState<T> {
  value: T | null;
  options: FieldRadioOption<T>[];
  touched: boolean;
  valid: boolean;
  error: string | null;
}

export interface FieldRadio<T> {
  getState(): FieldRadioState<T>;
  select(value: T): void;
  clear(): void;
  touch(): void;
  validate(): ValidationResult;
  isSelected(value: T): boolean;
  getOption(value: T): FieldRadioOption<T> | undefined;
}

export function createFieldRadio<T>(
  options: FieldRadioOption<T>[],
  validator?: (value: T | null) => ValidationResult
): FieldRadio<T> {
  let state: FieldRadioState<T> = {
    value: null,
    options: [...options],
    touched: false,
    valid: true,
    error: null,
  };

  function validate(): ValidationResult {
    if (!validator) return { valid: true };
    const result = validator(state.value);
    state = { ...state, valid: result.valid, error: result.error ?? null };
    return result;
  }

  function select(value: T): void {
    const opt = state.options.find((o) => o.value === value);
    if (!opt || opt.disabled) return;
    state = { ...state, value, touched: true };
    validate();
  }

  function clear(): void {
    state = { ...state, value: null, error: null, valid: true };
  }

  function touch(): void {
    state = { ...state, touched: true };
  }

  function isSelected(value: T): boolean {
    return state.value === value;
  }

  function getOption(value: T): FieldRadioOption<T> | undefined {
    return state.options.find((o) => o.value === value);
  }

  return {
    getState: () => ({ ...state }),
    select,
    clear,
    touch,
    validate,
    isSelected,
    getOption,
  };
}
