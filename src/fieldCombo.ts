import { ValidationResult } from './types';

export interface ComboOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface FieldComboState<T = string> {
  options: ComboOption<T>[];
  selected: T | null;
  query: string;
  isOpen: boolean;
  error: string | null;
}

export interface FieldComboConfig<T = string> {
  options: ComboOption<T>[];
  required?: boolean;
  validate?: (value: T | null) => ValidationResult;
}

export function createFieldCombo<T = string>(config: FieldComboConfig<T>) {
  const state: FieldComboState<T> = {
    options: config.options,
    selected: null,
    query: '',
    isOpen: false,
    error: null,
  };

  function getFiltered(): ComboOption<T>[] {
    const q = state.query.toLowerCase();
    return state.options.filter(
      (o) => !o.disabled && o.label.toLowerCase().includes(q)
    );
  }

  function select(value: T | null): void {
    state.selected = value;
    const found = state.options.find((o) => o.value === value);
    state.query = found ? found.label : '';
    state.isOpen = false;
    validate();
  }

  function setQuery(q: string): void {
    state.query = q;
    state.isOpen = true;
    if (q === '') state.selected = null;
  }

  function open(): void {
    state.isOpen = true;
  }

  function close(): void {
    state.isOpen = false;
  }

  function validate(): ValidationResult {
    if (config.required && state.selected === null) {
      state.error = 'This field is required';
      return { valid: false, error: state.error };
    }
    if (config.validate) {
      const result = config.validate(state.selected);
      state.error = result.valid ? null : (result.error ?? null);
      return result;
    }
    state.error = null;
    return { valid: true };
  }

  function getState(): FieldComboState<T> {
    return { ...state, options: [...state.options] };
  }

  function reset(): void {
    state.selected = null;
    state.query = '';
    state.isOpen = false;
    state.error = null;
  }

  return { getFiltered, select, setQuery, open, close, validate, getState, reset };
}
