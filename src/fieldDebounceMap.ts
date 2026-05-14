/**
 * fieldDebounceMap — per-field debounce registry with configurable delays.
 * Allows different fields to have independent debounce timers.
 */

export interface DebounceEntry {
  timerId: ReturnType<typeof setTimeout> | null;
  delay: number;
  lastValue: unknown;
}

export interface FieldDebounceMap {
  register: (field: string, delay: number) => void;
  unregister: (field: string) => void;
  schedule: (field: string, fn: () => void, value?: unknown) => void;
  cancel: (field: string) => void;
  flush: (field: string) => void;
  isScheduled: (field: string) => boolean;
  getDelay: (field: string) => number | undefined;
}

export function createFieldDebounceMap(defaultDelay = 300): FieldDebounceMap {
  const entries = new Map<string, DebounceEntry>();
  const pendingFns = new Map<string, () => void>();

  function register(field: string, delay: number): void {
    if (!entries.has(field)) {
      entries.set(field, { timerId: null, delay, lastValue: undefined });
    } else {
      entries.get(field)!.delay = delay;
    }
  }

  function unregister(field: string): void {
    cancel(field);
    entries.delete(field);
    pendingFns.delete(field);
  }

  function schedule(field: string, fn: () => void, value?: unknown): void {
    if (!entries.has(field)) {
      register(field, defaultDelay);
    }
    const entry = entries.get(field)!;
    if (entry.timerId !== null) {
      clearTimeout(entry.timerId);
    }
    entry.lastValue = value;
    pendingFns.set(field, fn);
    entry.timerId = setTimeout(() => {
      entry.timerId = null;
      const pending = pendingFns.get(field);
      pendingFns.delete(field);
      if (pending) pending();
    }, entry.delay);
  }

  function cancel(field: string): void {
    const entry = entries.get(field);
    if (entry?.timerId !== null && entry?.timerId !== undefined) {
      clearTimeout(entry.timerId);
      entry.timerId = null;
    }
    pendingFns.delete(field);
  }

  function flush(field: string): void {
    const entry = entries.get(field);
    if (entry?.timerId !== null && entry?.timerId !== undefined) {
      clearTimeout(entry.timerId);
      entry.timerId = null;
    }
    const pending = pendingFns.get(field);
    pendingFns.delete(field);
    if (pending) pending();
  }

  function isScheduled(field: string): boolean {
    const entry = entries.get(field);
    return entry?.timerId !== null && entry?.timerId !== undefined;
  }

  function getDelay(field: string): number | undefined {
    return entries.get(field)?.delay;
  }

  return { register, unregister, schedule, cancel, flush, isScheduled, getDelay };
}
