import { FieldState } from './types';

export interface RatingConfig {
  min: number;
  max: number;
  step?: number;
  required?: boolean;
  labels?: Record<number, string>;
}

export interface RatingState {
  value: number | null;
  min: number;
  max: number;
  step: number;
  isValid: boolean;
  error: string | null;
  label: string | null;
  percent: number;
}

export function createFieldRating(config: RatingConfig) {
  const { min, max, step = 1, required = false, labels = {} } = config;

  if (min >= max) throw new Error('min must be less than max');
  if (step <= 0) throw new Error('step must be positive');

  let current: number | null = null;

  function validate(value: number | null): string | null {
    if (value === null) {
      return required ? 'A rating is required.' : null;
    }
    if (value < min) return `Rating must be at least ${min}.`;
    if (value > max) return `Rating must be at most ${max}.`;
    const offset = (value - min) % step;
    if (Math.abs(offset) > 1e-9 && Math.abs(offset - step) > 1e-9) {
      return `Rating must be a multiple of ${step} starting from ${min}.`;
    }
    return null;
  }

  function getState(): RatingState {
    const error = validate(current);
    const range = max - min;
    const percent = current === null ? 0 : Math.round(((current - min) / range) * 100);
    return {
      value: current,
      min,
      max,
      step,
      isValid: error === null,
      error,
      label: current !== null && labels[current] ? labels[current] : null,
      percent,
    };
  }

  function setValue(value: number | null): RatingState {
    current = value;
    return getState();
  }

  function increment(): RatingState {
    const next = current === null ? min : Math.min(current + step, max);
    return setValue(next);
  }

  function decrement(): RatingState {
    const next = current === null ? min : Math.max(current - step, min);
    return setValue(next);
  }

  function reset(): RatingState {
    current = null;
    return getState();
  }

  return { setValue, increment, decrement, reset, getState, validate };
}

export type FieldRating = ReturnType<typeof createFieldRating>;
