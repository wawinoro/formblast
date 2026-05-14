import { ValidationResult } from './types';

export type FieldStatus = 'idle' | 'validating' | 'valid' | 'invalid' | 'disabled';

export interface FieldStatusState<T extends Record<string, unknown>> {
  statuses: { [K in keyof T]?: FieldStatus };
}

export function createFieldStatusState<T extends Record<string, unknown>>(): FieldStatusState<T> {
  return { statuses: {} };
}

export function setFieldStatus<T extends Record<string, unknown>>(
  state: FieldStatusState<T>,
  field: keyof T,
  status: FieldStatus
): FieldStatusState<T> {
  return { statuses: { ...state.statuses, [field]: status } };
}

export function getFieldStatus<T extends Record<string, unknown>>(
  state: FieldStatusState<T>,
  field: keyof T
): FieldStatus {
  return state.statuses[field] ?? 'idle';
}

export function applyValidationResult<T extends Record<string, unknown>>(
  state: FieldStatusState<T>,
  field: keyof T,
  result: ValidationResult
): FieldStatusState<T> {
  const status: FieldStatus = result.valid ? 'valid' : 'invalid';
  return setFieldStatus(state, field, status);
}

export function disableField<T extends Record<string, unknown>>(
  state: FieldStatusState<T>,
  field: keyof T
): FieldStatusState<T> {
  return setFieldStatus(state, field, 'disabled');
}

export function isFieldDisabled<T extends Record<string, unknown>>(
  state: FieldStatusState<T>,
  field: keyof T
): boolean {
  return getFieldStatus(state, field) === 'disabled';
}

export function getStatusSummary<T extends Record<string, unknown>>(
  state: FieldStatusState<T>
): Record<FieldStatus, (keyof T)[]> {
  const summary: Record<FieldStatus, (keyof T)[]> = {
    idle: [],
    validating: [],
    valid: [],
    invalid: [],
    disabled: [],
  };
  for (const [field, status] of Object.entries(state.statuses) as [keyof T, FieldStatus][]) {
    summary[status].push(field);
  }
  return summary;
}
