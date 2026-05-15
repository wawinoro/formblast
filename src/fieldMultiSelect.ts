import { ValidationResult } from './types';

export interface FieldMultiSelectState<T> {
  options: T[];
  selected: T[];
  error: string | null;
  touched: boolean;
}

export interface FieldMultiSelectConfig<T> {
  options: T[];
  initial?: T[];
  min?: number;
  max?: number;
  validate?: (selected: T[]) => string | null;
}

export function createFieldMultiSelect<T>(config: FieldMultiSelectConfig<T>) {
  let state: FieldMultiSelectState<T> = {
    options: config.options,
    selected: config.initial ?? [],
    error: null,
    touched: false,
  };

  function validate(): ValidationResult {
    if (config.min !== undefined && state.selected.length < config.min) {
      state.error = `Select at least ${config.min} option(s).`;
      return { valid: false, error: state.error };
    }
    if (config.max !== undefined && state.selected.length > config.max) {
      state.error = `Select no more than ${config.max} option(s).`;
      return { valid: false, error: state.error };
    }
    if (config.validate) {
      const msg = config.validate(state.selected);
      state.error = msg;
      return { valid: msg === null, error: msg };
    }
    state.error = null;
    return { valid: true, error: null };
  }

  function toggle(option: T): void {
    state.touched = true;
    const idx = state.selected.indexOf(option);
    if (idx === -1) {
      state.selected = [...state.selected, option];
    } else {
      state.selected = state.selected.filter((_, i) => i !== idx);
    }
  }

  function selectAll(): void {
    state.touched = true;
    state.selected = [...state.options];
  }

  function clearAll(): void {
    state.touched = true;
    state.selected = [];
  }

  function isSelected(option: T): boolean {
    return state.selected.includes(option);
  }

  function getState(): FieldMultiSelectState<T> {
    return { ...state, selected: [...state.selected] };
  }

  function reset(): void {
    state.selected = config.initial ?? [];
    state.error = null;
    state.touched = false;
  }

  return { toggle, selectAll, clearAll, isSelected, validate, getState, reset };
}
