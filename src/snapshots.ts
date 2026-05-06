import { FieldSchema } from './types';

export type Snapshot<T extends Record<string, unknown>> = {
  values: T;
  timestamp: number;
  label?: string;
};

export type SnapshotStore<T extends Record<string, unknown>> = {
  snapshots: Snapshot<T>[];
  maxSize: number;
};

export function createSnapshotStore<T extends Record<string, unknown>>(
  maxSize = 10
): SnapshotStore<T> {
  return { snapshots: [], maxSize };
}

export function takeSnapshot<T extends Record<string, unknown>>(
  store: SnapshotStore<T>,
  values: T,
  label?: string
): SnapshotStore<T> {
  const snapshot: Snapshot<T> = {
    values: { ...values },
    timestamp: Date.now(),
    label,
  };
  const snapshots = [...store.snapshots, snapshot].slice(-store.maxSize);
  return { ...store, snapshots };
}

export function restoreSnapshot<T extends Record<string, unknown>>(
  store: SnapshotStore<T>,
  index: number
): T | null {
  const snapshot = store.snapshots[index];
  return snapshot ? { ...snapshot.values } : null;
}

export function getLatestSnapshot<T extends Record<string, unknown>>(
  store: SnapshotStore<T>
): Snapshot<T> | null {
  return store.snapshots[store.snapshots.length - 1] ?? null;
}

export function clearSnapshots<T extends Record<string, unknown>>(
  store: SnapshotStore<T>
): SnapshotStore<T> {
  return { ...store, snapshots: [] };
}

export function diffSnapshots<T extends Record<string, unknown>>(
  a: Snapshot<T>,
  b: Snapshot<T>
): Partial<T> {
  const diff: Partial<T> = {};
  const keys = new Set([...Object.keys(a.values), ...Object.keys(b.values)]) as Set<keyof T>;
  for (const key of keys) {
    if (a.values[key] !== b.values[key]) {
      diff[key] = b.values[key];
    }
  }
  return diff;
}
