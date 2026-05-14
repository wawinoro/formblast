import { FieldState } from './types';

export interface FieldLockState<T extends Record<string, unknown>> {
  locked: Set<keyof T>;
  readonly: Set<keyof T>;
}

export function createFieldLock<T extends Record<string, unknown>>(): FieldLockState<T> {
  return {
    locked: new Set(),
    readonly: new Set(),
  };
}

export function lockField<T extends Record<string, unknown>>(
  state: FieldLockState<T>,
  field: keyof T
): FieldLockState<T> {
  const locked = new Set(state.locked);
  locked.add(field);
  return { ...state, locked };
}

export function unlockField<T extends Record<string, unknown>>(
  state: FieldLockState<T>,
  field: keyof T
): FieldLockState<T> {
  const locked = new Set(state.locked);
  locked.delete(field);
  return { ...state, locked };
}

export function setReadonly<T extends Record<string, unknown>>(
  state: FieldLockState<T>,
  field: keyof T,
  isReadonly: boolean
): FieldLockState<T> {
  const readonly = new Set(state.readonly);
  if (isReadonly) {
    readonly.add(field);
  } else {
    readonly.delete(field);
  }
  return { ...state, readonly };
}

export function isLocked<T extends Record<string, unknown>>(
  state: FieldLockState<T>,
  field: keyof T
): boolean {
  return state.locked.has(field);
}

export function isReadonly<T extends Record<string, unknown>>(
  state: FieldLockState<T>,
  field: keyof T
): boolean {
  return state.readonly.has(field);
}

export function canEdit<T extends Record<string, unknown>>(
  state: FieldLockState<T>,
  field: keyof T
): boolean {
  return !state.locked.has(field) && !state.readonly.has(field);
}

export function getLockedFields<T extends Record<string, unknown>>(
  state: FieldLockState<T>
): Array<keyof T> {
  return Array.from(state.locked);
}

export function lockAll<T extends Record<string, unknown>>(
  state: FieldLockState<T>,
  fields: Array<keyof T>
): FieldLockState<T> {
  return { ...state, locked: new Set(fields) };
}
