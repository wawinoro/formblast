import { FieldSchema } from './types';

export interface FieldSliderOptions<T> {
  min: number;
  max: number;
  step?: number;
  initialValue?: number;
  schema?: FieldSchema<T, unknown>;
}

export interface FieldSliderState {
  value: number;
  min: number;
  max: number;
  step: number;
  percent: number;
  valid: boolean;
  error: string | null;
}

export interface FieldSlider<T> {
  getState: () => FieldSliderState;
  setValue: (val: number) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  validate: () => boolean;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function toStep(val: number, step: number, min: number): number {
  const steps = Math.round((val - min) / step);
  return min + steps * step;
}

export function createFieldSlider<T>(
  options: FieldSliderOptions<T>
): FieldSlider<T> {
  const { min, max, step = 1, schema } = options;
  let value = clamp(options.initialValue ?? min, min, max);
  let error: string | null = null;
  let valid = true;

  function computePercent(v: number): number {
    if (max === min) return 0;
    return Math.round(((v - min) / (max - min)) * 100);
  }

  function runValidation(v: number): boolean {
    if (!schema) return true;
    const result = schema.validate ? schema.validate(v as unknown as T) : null;
    if (result && result.errors && result.errors.length > 0) {
      error = result.errors[0];
      return false;
    }
    error = null;
    return true;
  }

  return {
    getState(): FieldSliderState {
      return { value, min, max, step, percent: computePercent(value), valid, error };
    },
    setValue(val: number): void {
      value = clamp(toStep(val, step, min), min, max);
      valid = runValidation(value);
    },
    increment(): void {
      value = clamp(value + step, min, max);
      valid = runValidation(value);
    },
    decrement(): void {
      value = clamp(value - step, min, max);
      valid = runValidation(value);
    },
    reset(): void {
      value = clamp(options.initialValue ?? min, min, max);
      error = null;
      valid = true;
    },
    validate(): boolean {
      valid = runValidation(value);
      return valid;
    },
  };
}
