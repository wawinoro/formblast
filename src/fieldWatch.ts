import { FieldSchema, ValidationResult } from './types';

export type WatchCallback<T> = (value: T, result: ValidationResult) => void;

export interface FieldWatcher<T> {
  value: T;
  subscribe: (cb: WatchCallback<T>) => () => void;
  update: (newValue: T) => void;
  getResult: () => ValidationResult;
  destroy: () => void;
}

/**
 * Creates a reactive field watcher that triggers validation on value changes
 * and notifies subscribers with the latest value and validation result.
 */
export function watchField<T>(
  schema: FieldSchema<T>,
  initialValue: T,
  validate: (schema: FieldSchema<T>, value: T) => ValidationResult
): FieldWatcher<T> {
  let currentValue: T = initialValue;
  let currentResult: ValidationResult = validate(schema, initialValue);
  const subscribers = new Set<WatchCallback<T>>();

  function notify() {
    subscribers.forEach((cb) => cb(currentValue, currentResult));
  }

  return {
    get value() {
      return currentValue;
    },

    subscribe(cb: WatchCallback<T>) {
      subscribers.add(cb);
      // Immediately invoke with current state
      cb(currentValue, currentResult);
      return () => {
        subscribers.delete(cb);
      };
    },

    update(newValue: T) {
      currentValue = newValue;
      currentResult = validate(schema, newValue);
      notify();
    },

    getResult() {
      return currentResult;
    },

    destroy() {
      subscribers.clear();
    },
  };
}

/**
 * Creates a multi-field watcher that fires when any watched field changes.
 */
export function watchFields<T extends Record<string, unknown>>(
  watchers: { [K in keyof T]: FieldWatcher<T[K]> },
  onChange: (field: keyof T, value: T[keyof T], result: ValidationResult) => void
): () => void {
  const unsubscribers: Array<() => void> = [];

  for (const key in watchers) {
    const watcher = watchers[key];
    const unsub = watcher.subscribe((value, result) => {
      onChange(key, value as T[keyof T], result);
    });
    unsubscribers.push(unsub);
  }

  return () => unsubscribers.forEach((fn) => fn());
}
