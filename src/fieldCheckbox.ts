import { ValidatorFn } from './types';

export interface FieldCheckboxState {
  checked: boolean;
  indeterminate: boolean;
  error: string | null;
  dirty: boolean;
  touched: boolean;
}

export interface FieldCheckboxOptions<T> {
  initial?: boolean;
  required?: boolean;
  validators?: ValidatorFn<T>[];
  requiredMessage?: string;
}

export interface FieldCheckbox<T> {
  getState: () => FieldCheckboxState;
  toggle: () => void;
  setChecked: (value: boolean) => void;
  setIndeterminate: (value: boolean) => void;
  touch: () => void;
  validate: () => string | null;
  reset: () => void;
}

export function createFieldCheckbox<T = boolean>(
  options: FieldCheckboxOptions<T> = {}
): FieldCheckbox<T> {
  const {
    initial = false,
    required = false,
    validators = [],
    requiredMessage = 'This field is required.',
  } = options;

  let checked = initial;
  let indeterminate = false;
  let error: string | null = null;
  let dirty = false;
  let touched = false;

  function validate(): string | null {
    if (required && !checked) {
      error = requiredMessage;
      return error;
    }
    const value = checked as unknown as T;
    for (const fn of validators) {
      const result = fn(value);
      if (result) {
        error = result;
        return error;
      }
    }
    error = null;
    return null;
  }

  return {
    getState: () => ({ checked, indeterminate, error, dirty, touched }),

    toggle() {
      checked = !checked;
      indeterminate = false;
      dirty = true;
      validate();
    },

    setChecked(value: boolean) {
      checked = value;
      indeterminate = false;
      dirty = true;
      validate();
    },

    setIndeterminate(value: boolean) {
      indeterminate = value;
      if (value) checked = false;
      dirty = true;
    },

    touch() {
      touched = true;
    },

    validate,

    reset() {
      checked = initial;
      indeterminate = false;
      error = null;
      dirty = false;
      touched = false;
    },
  };
}
