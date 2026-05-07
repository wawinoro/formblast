import { FieldSchema } from './types';

export interface FocusTrapState<T extends Record<string, unknown>> {
  fields: (keyof T)[];
  currentIndex: number;
  skipInvalid: boolean;
}

export function createFocusTrap<T extends Record<string, unknown>>(
  fields: (keyof T)[],
  options: { skipInvalid?: boolean } = {}
): FocusTrapState<T> {
  return {
    fields: [...fields],
    currentIndex: 0,
    skipInvalid: options.skipInvalid ?? false,
  };
}

export function focusNext<T extends Record<string, unknown>>(
  state: FocusTrapState<T>,
  invalidFields: Set<keyof T> = new Set()
): { state: FocusTrapState<T>; field: keyof T | null } {
  let next = state.currentIndex + 1;
  while (next < state.fields.length) {
    const field = state.fields[next];
    if (!state.skipInvalid || !invalidFields.has(field)) {
      return { state: { ...state, currentIndex: next }, field };
    }
    next++;
  }
  return { state, field: null };
}

export function focusPrev<T extends Record<string, unknown>>(
  state: FocusTrapState<T>,
  invalidFields: Set<keyof T> = new Set()
): { state: FocusTrapState<T>; field: keyof T | null } {
  let prev = state.currentIndex - 1;
  while (prev >= 0) {
    const field = state.fields[prev];
    if (!state.skipInvalid || !invalidFields.has(field)) {
      return { state: { ...state, currentIndex: prev }, field };
    }
    prev--;
  }
  return { state, field: null };
}

export function focusFirst<T extends Record<string, unknown>>(
  state: FocusTrapState<T>
): { state: FocusTrapState<T>; field: keyof T } {
  return { state: { ...state, currentIndex: 0 }, field: state.fields[0] };
}

export function focusLast<T extends Record<string, unknown>>(
  state: FocusTrapState<T>
): { state: FocusTrapState<T>; field: keyof T } {
  const last = state.fields.length - 1;
  return { state: { ...state, currentIndex: last }, field: state.fields[last] };
}

export function getCurrentField<T extends Record<string, unknown>>(
  state: FocusTrapState<T>
): keyof T {
  return state.fields[state.currentIndex];
}
