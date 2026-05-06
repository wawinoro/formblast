import { ValidationSchema, ValidationResult } from './types';
import { validateSchema } from './schema';

export interface FieldArrayState<T> {
  items: T[];
  errors: Record<number, ValidationResult<T>>;
}

export function createFieldArray<T extends Record<string, unknown>>(
  schema: ValidationSchema<T>
): {
  state: FieldArrayState<T>;
  add: (item: T) => void;
  remove: (index: number) => void;
  update: (index: number, item: T) => void;
  validate: () => boolean;
  getErrors: (index: number) => ValidationResult<T> | undefined;
  reset: () => void;
} {
  const state: FieldArrayState<T> = {
    items: [],
    errors: {},
  };

  function add(item: T): void {
    state.items.push(item);
  }

  function remove(index: number): void {
    state.items.splice(index, 1);
    delete state.errors[index];
    // Re-index errors
    const reindexed: Record<number, ValidationResult<T>> = {};
    Object.keys(state.errors).forEach((key) => {
      const k = parseInt(key, 10);
      if (k > index) {
        reindexed[k - 1] = state.errors[k];
      } else {
        reindexed[k] = state.errors[k];
      }
    });
    state.errors = reindexed;
  }

  function update(index: number, item: T): void {
    if (index >= 0 && index < state.items.length) {
      state.items[index] = item;
    }
  }

  function validate(): boolean {
    state.errors = {};
    let allValid = true;
    state.items.forEach((item, index) => {
      const result = validateSchema(schema, item);
      const hasErrors = Object.values(result).some((r) => !r.valid);
      if (hasErrors) {
        state.errors[index] = result;
        allValid = false;
      }
    });
    return allValid;
  }

  function getErrors(index: number): ValidationResult<T> | undefined {
    return state.errors[index];
  }

  function reset(): void {
    state.items = [];
    state.errors = {};
  }

  return { state, add, remove, update, validate, getErrors, reset };
}

export function validateFieldArray<T extends Record<string, unknown>>(
  schema: ValidationSchema<T>,
  items: T[]
): { valid: boolean; errors: Record<number, ValidationResult<T>> } {
  const errors: Record<number, ValidationResult<T>> = {};
  let valid = true;
  items.forEach((item, index) => {
    const result = validateSchema(schema, item);
    const hasErrors = Object.values(result).some((r) => !r.valid);
    if (hasErrors) {
      errors[index] = result;
      valid = false;
    }
  });
  return { valid, errors };
}
