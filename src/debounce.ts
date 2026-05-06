import { FieldSchema } from './types';

type DebouncedValidator<T> = {
  validate: (value: T) => Promise<string[]>;
  cancel: () => void;
  flush: () => Promise<string[]> | null;
};

type DebounceOptions = {
  wait?: number;
  leading?: boolean;
};

/**
 * Wraps a field schema's validation in a debounced async validator.
 * Useful for delaying validation until the user stops typing.
 */
export function debounceValidation<T>(
  schema: FieldSchema<T>,
  validateFn: (value: T, schema: FieldSchema<T>) => string[],
  options: DebounceOptions = {}
): DebouncedValidator<T> {
  const { wait = 300, leading = false } = options;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastValue: T | undefined;
  let pendingResolve: ((errors: string[]) => void) | null = null;

  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (pendingResolve) {
      pendingResolve([]);
      pendingResolve = null;
    }
  };

  const flush = (): Promise<string[]> | null => {
    if (lastValue === undefined) return null;
    cancel();
    return Promise.resolve(validateFn(lastValue, schema));
  };

  const validate = (value: T): Promise<string[]> => {
    lastValue = value;

    if (leading && timer === null) {
      return Promise.resolve(validateFn(value, schema));
    }

    cancel();

    return new Promise<string[]>((resolve) => {
      pendingResolve = resolve;
      timer = setTimeout(() => {
        timer = null;
        pendingResolve = null;
        resolve(validateFn(value, schema));
      }, wait);
    });
  };

  return { validate, cancel, flush };
}

/**
 * Creates a simple async debounce wrapper for any validation function.
 */
export function createDebounced<T>(
  fn: (value: T) => string[],
  wait = 300
): (value: T) => Promise<string[]> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (value: T): Promise<string[]> => {
    if (timer) clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        timer = null;
        resolve(fn(value));
      }, wait);
    });
  };
}
