import { FieldSchema } from './types';

export interface ThrottleOptions {
  interval: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottledValidator<T> {
  validate: (value: T) => Promise<string[]>;
  cancel: () => void;
  flush: () => Promise<string[]> | null;
}

export function throttleValidation<T>(
  schema: FieldSchema<T>,
  options: ThrottleOptions
): ThrottledValidator<T> {
  const { interval, leading = true, trailing = true } = options;

  let lastCallTime: number | null = null;
  let trailingTimer: ReturnType<typeof setTimeout> | null = null;
  let lastValue: T | undefined;
  let lastResult: Promise<string[]> | null = null;

  function runValidation(value: T): Promise<string[]> {
    if (typeof schema === 'function') {
      const result = schema(value);
      lastResult = Promise.resolve(result as string[]);
    } else {
      lastResult = Promise.resolve([]);
    }
    return lastResult;
  }

  function cancel() {
    if (trailingTimer !== null) {
      clearTimeout(trailingTimer);
      trailingTimer = null;
    }
    lastCallTime = null;
    lastValue = undefined;
  }

  function flush(): Promise<string[]> | null {
    if (trailingTimer !== null && lastValue !== undefined) {
      clearTimeout(trailingTimer);
      trailingTimer = null;
      return runValidation(lastValue);
    }
    return lastResult;
  }

  function validate(value: T): Promise<string[]> {
    const now = Date.now();
    const elapsed = lastCallTime !== null ? now - lastCallTime : Infinity;
    lastValue = value;

    if (trailingTimer !== null) {
      clearTimeout(trailingTimer);
      trailingTimer = null;
    }

    if (elapsed >= interval) {
      lastCallTime = now;
      if (leading) {
        return runValidation(value);
      }
    }

    if (trailing) {
      return new Promise((resolve) => {
        trailingTimer = setTimeout(() => {
          lastCallTime = Date.now();
          trailingTimer = null;
          runValidation(value).then(resolve);
        }, interval - (elapsed === Infinity ? 0 : elapsed));
      });
    }

    return lastResult ?? Promise.resolve([]);
  }

  return { validate, cancel, flush };
}

export function createThrottled<T>(
  fn: (value: T) => string[],
  interval: number
): (value: T) => Promise<string[]> {
  const throttled = throttleValidation<T>(fn as unknown as FieldSchema<T>, { interval });
  return throttled.validate;
}
