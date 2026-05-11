import { FieldSchema } from './types';

export interface VisibilityRule<T extends Record<string, unknown>> {
  field: keyof T;
  condition: (values: T) => boolean;
}

export interface VisibilityState<T extends Record<string, unknown>> {
  rules: VisibilityRule<T>[];
  visibleFields: Set<keyof T>;
  hiddenFields: Set<keyof T>;
}

export function createVisibilityState<T extends Record<string, unknown>>(
  rules: VisibilityRule<T>[]
): VisibilityState<T> {
  return {
    rules,
    visibleFields: new Set(),
    hiddenFields: new Set(),
  };
}

export function evaluateVisibility<T extends Record<string, unknown>>(
  state: VisibilityState<T>,
  values: T
): VisibilityState<T> {
  const visibleFields = new Set<keyof T>();
  const hiddenFields = new Set<keyof T>();

  for (const rule of state.rules) {
    if (rule.condition(values)) {
      visibleFields.add(rule.field);
    } else {
      hiddenFields.add(rule.field);
    }
  }

  return { ...state, visibleFields, hiddenFields };
}

export function isFieldVisible<T extends Record<string, unknown>>(
  state: VisibilityState<T>,
  field: keyof T
): boolean {
  if (state.hiddenFields.has(field)) return false;
  if (state.visibleFields.has(field)) return true;
  // Fields not referenced by any rule are visible by default
  return true;
}

export function filterHiddenErrors<T extends Record<string, unknown>>(
  state: VisibilityState<T>,
  errors: Partial<Record<keyof T, string>>
): Partial<Record<keyof T, string>> {
  const filtered: Partial<Record<keyof T, string>> = {};
  for (const key in errors) {
    if (isFieldVisible(state, key as keyof T)) {
      filtered[key as keyof T] = errors[key as keyof T];
    }
  }
  return filtered;
}

export function getHiddenFieldKeys<T extends Record<string, unknown>>(
  state: VisibilityState<T>
): Array<keyof T> {
  return Array.from(state.hiddenFields);
}

export function getVisibleFieldKeys<T extends Record<string, unknown>>(
  state: VisibilityState<T>
): Array<keyof T> {
  return Array.from(state.visibleFields);
}
