import { FieldSchema } from './types';

export interface DirtyFieldsState<T extends Record<string, unknown>> {
  initial: Partial<T>;
  current: Partial<T>;
  dirty: Set<keyof T>;
}

export function createDirtyFields<T extends Record<string, unknown>>(
  initialValues: Partial<T>
): DirtyFieldsState<T> {
  return {
    initial: { ...initialValues },
    current: { ...initialValues },
    dirty: new Set(),
  };
}

export function updateField<T extends Record<string, unknown>>(
  state: DirtyFieldsState<T>,
  field: keyof T,
  value: T[keyof T]
): DirtyFieldsState<T> {
  const current = { ...state.current, [field]: value };
  const dirty = new Set(state.dirty);

  if (value !== state.initial[field]) {
    dirty.add(field);
  } else {
    dirty.delete(field);
  }

  return { ...state, current, dirty };
}

export function getDirtyFields<T extends Record<string, unknown>>(
  state: DirtyFieldsState<T>
): Array<keyof T> {
  return Array.from(state.dirty);
}

export function isDirtyField<T extends Record<string, unknown>>(
  state: DirtyFieldsState<T>,
  field: keyof T
): boolean {
  return state.dirty.has(field);
}

export function hasAnyDirty<T extends Record<string, unknown>>(
  state: DirtyFieldsState<T>
): boolean {
  return state.dirty.size > 0;
}

export function resetDirtyFields<T extends Record<string, unknown>>(
  state: DirtyFieldsState<T>,
  newInitial?: Partial<T>
): DirtyFieldsState<T> {
  const initial = newInitial ?? state.current;
  return {
    initial: { ...initial },
    current: { ...initial },
    dirty: new Set(),
  };
}

export function getDirtyValues<T extends Record<string, unknown>>(
  state: DirtyFieldsState<T>
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of state.dirty) {
    result[key] = state.current[key] as T[keyof T];
  }
  return result;
}
