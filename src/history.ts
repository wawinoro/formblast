import { SnapshotStore, Snapshot, takeSnapshot, restoreSnapshot, createSnapshotStore } from './snapshots';

export type HistoryState<T extends Record<string, unknown>> = {
  store: SnapshotStore<T>;
  cursor: number;
};

export function createHistory<T extends Record<string, unknown>>(
  maxSize = 50
): HistoryState<T> {
  return { store: createSnapshotStore<T>(maxSize), cursor: -1 };
}

export function pushHistory<T extends Record<string, unknown>>(
  history: HistoryState<T>,
  values: T,
  label?: string
): HistoryState<T> {
  // Discard any redo states beyond cursor
  const trimmed = {
    ...history.store,
    snapshots: history.store.snapshots.slice(0, history.cursor + 1),
  };
  const store = takeSnapshot(trimmed, values, label);
  return { store, cursor: store.snapshots.length - 1 };
}

export function undo<T extends Record<string, unknown>>(
  history: HistoryState<T>
): { history: HistoryState<T>; values: T | null } {
  if (history.cursor <= 0) {
    return { history, values: null };
  }
  const cursor = history.cursor - 1;
  const values = restoreSnapshot(history.store, cursor);
  return { history: { ...history, cursor }, values };
}

export function redo<T extends Record<string, unknown>>(
  history: HistoryState<T>
): { history: HistoryState<T>; values: T | null } {
  const maxCursor = history.store.snapshots.length - 1;
  if (history.cursor >= maxCursor) {
    return { history, values: null };
  }
  const cursor = history.cursor + 1;
  const values = restoreSnapshot(history.store, cursor);
  return { history: { ...history, cursor }, values };
}

export function canUndo<T extends Record<string, unknown>>(
  history: HistoryState<T>
): boolean {
  return history.cursor > 0;
}

export function canRedo<T extends Record<string, unknown>>(
  history: HistoryState<T>
): boolean {
  return history.cursor < history.store.snapshots.length - 1;
}

export function getCurrentValues<T extends Record<string, unknown>>(
  history: HistoryState<T>
): T | null {
  return restoreSnapshot(history.store, history.cursor);
}
