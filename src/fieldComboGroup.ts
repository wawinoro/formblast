import { createFieldCombo, FieldComboConfig, FieldComboState, ComboOption } from './fieldCombo';
import { ValidationResult } from './types';

export type ComboGroupSchema<T extends Record<string, unknown>> = {
  [K in keyof T]: FieldComboConfig<T[K]>;
};

export type ComboGroupState<T extends Record<string, unknown>> = {
  [K in keyof T]: FieldComboState<T[K]>;
};

export type ComboGroupErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string | null;
};

export function createFieldComboGroup<T extends Record<string, unknown>>(
  schema: ComboGroupSchema<T>
) {
  type Key = keyof T;
  const combos = {} as Record<Key, ReturnType<typeof createFieldCombo>>;

  for (const key in schema) {
    combos[key as Key] = createFieldCombo(schema[key as Key] as FieldComboConfig<unknown>);
  }

  function getState(): ComboGroupState<T> {
    const result = {} as ComboGroupState<T>;
    for (const key in combos) {
      (result as Record<string, unknown>)[key] = combos[key as Key].getState();
    }
    return result;
  }

  function validateAll(): ComboGroupErrors<T> {
    const errors = {} as ComboGroupErrors<T>;
    for (const key in combos) {
      const result: ValidationResult = combos[key as Key].validate();
      if (!result.valid) {
        (errors as Record<string, unknown>)[key] = result.error ?? 'Invalid';
      }
    }
    return errors;
  }

  function isValid(): boolean {
    return Object.keys(validateAll()).length === 0;
  }

  function resetAll(): void {
    for (const key in combos) {
      combos[key as Key].reset();
    }
  }

  function getField(key: Key) {
    return combos[key];
  }

  /**
   * Sets the value of a specific field by key.
   * Useful for programmatically updating a single combo without resetting the group.
   */
  function setFieldValue(key: Key, value: unknown): void {
    const field = combos[key];
    if (!field) {
      throw new Error(`Field "${String(key)}" does not exist in this combo group.`);
    }
    field.setValue(value);
  }

  return { getState, validateAll, isValid, resetAll, getField, setFieldValue };
}
