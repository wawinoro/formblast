import { FieldSchema } from './types';

export interface TouchedState {
  fields: Set<string>;
  dirty: Set<string>;
}

export function createTouchedState(): TouchedState {
  return {
    fields: new Set(),
    dirty: new Set(),
  };
}

export function touchField(state: TouchedState, field: string): TouchedState {
  const fields = new Set(state.fields);
  fields.add(field);
  return { ...state, fields };
}

export function markDirty(
  state: TouchedState,
  field: string,
  originalValue: unknown,
  currentValue: unknown
): TouchedState {
  const dirty = new Set(state.dirty);
  if (originalValue !== currentValue) {
    dirty.add(field);
  } else {
    dirty.delete(field);
  }
  return { ...state, dirty };
}

export function isTouched(state: TouchedState, field: string): boolean {
  return state.fields.has(field);
}

export function isDirty(state: TouchedState, field: string): boolean {
  return state.dirty.has(field);
}

export function resetTouched(state: TouchedState, field?: string): TouchedState {
  if (field) {
    const fields = new Set(state.fields);
    const dirty = new Set(state.dirty);
    fields.delete(field);
    dirty.delete(field);
    return { fields, dirty };
  }
  return createTouchedState();
}

export function getTouchedFields(state: TouchedState): string[] {
  return Array.from(state.fields);
}

export function getDirtyFields(state: TouchedState): string[] {
  return Array.from(state.dirty);
}

export function hasAnyTouched(state: TouchedState): boolean {
  return state.fields.size > 0;
}

export function hasAnyDirty(state: TouchedState): boolean {
  return state.dirty.size > 0;
}
