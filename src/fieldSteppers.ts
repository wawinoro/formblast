import { ValidationResult } from './types';

export interface StepperOptions<T> {
  min?: T;
  max?: T;
  step: T;
  validate?: (value: T) => ValidationResult;
}

export interface FieldStepper<T> {
  getValue: () => T;
  increment: () => ValidationResult;
  decrement: () => ValidationResult;
  setValue: (value: T) => ValidationResult;
  reset: () => void;
  getState: () => StepperState<T>;
}

export interface StepperState<T> {
  value: T;
  atMin: boolean;
  atMax: boolean;
  error: string | null;
}

export function createFieldStepper<T extends number>(
  initial: T,
  options: StepperOptions<T>
): FieldStepper<T> {
  let current: T = initial;

  function clamp(value: number): T {
    let result = value;
    if (options.min !== undefined && result < options.min) result = options.min as number;
    if (options.max !== undefined && result > options.max) result = options.max as number;
    return result as T;
  }

  function runValidation(value: T): ValidationResult {
    if (options.min !== undefined && value < options.min) {
      return { valid: false, error: `Value must be at least ${options.min}` };
    }
    if (options.max !== undefined && value > options.max) {
      return { valid: false, error: `Value must be at most ${options.max}` };
    }
    if (options.validate) return options.validate(value);
    return { valid: true, error: null };
  }

  function getState(): StepperState<T> {
    const result = runValidation(current);
    return {
      value: current,
      atMin: options.min !== undefined && current <= options.min,
      atMax: options.max !== undefined && current >= options.max,
      error: result.valid ? null : (result.error ?? null),
    };
  }

  function setValue(value: T): ValidationResult {
    current = clamp(value as number) as T;
    return runValidation(current);
  }

  function increment(): ValidationResult {
    return setValue((current + options.step) as T);
  }

  function decrement(): ValidationResult {
    return setValue((current - options.step) as T);
  }

  function reset(): void {
    current = initial;
  }

  return { getValue: () => current, increment, decrement, setValue, reset, getState };
}
