# Snapshots & History

Formblast provides immutable snapshot and history utilities for tracking form state over time, enabling undo/redo functionality without external state management.

## Snapshots

A **snapshot** is an immutable copy of form values at a point in time.

```ts
import { createSnapshotStore, takeSnapshot, restoreSnapshot, diffSnapshots } from 'formblast';

const store = createSnapshotStore<MyForm>(10); // max 10 snapshots

const s1 = takeSnapshot(store, values, 'after step 1');
const s2 = takeSnapshot(s1, updatedValues, 'after step 2');

// Restore a previous snapshot
const restored = restoreSnapshot(s2, 0); // first snapshot values

// Find what changed between two snapshots
const diff = diffSnapshots(s2.snapshots[0], s2.snapshots[1]);
// => { email: 'new@example.com' }
```

## History (Undo / Redo)

The `history` module wraps the snapshot store with cursor-based undo/redo.

```ts
import { createHistory, pushHistory, undo, redo, canUndo, canRedo } from 'formblast';

let history = createHistory<MyForm>(50);

// Record a change
history = pushHistory(history, formValues);

// Undo
if (canUndo(history)) {
  const { history: h, values } = undo(history);
  history = h;
  setFormValues(values);
}

// Redo
if (canRedo(history)) {
  const { history: h, values } = redo(history);
  history = h;
  setFormValues(values);
}
```

## API Reference

### Snapshots

| Function | Description |
|---|---|
| `createSnapshotStore(maxSize?)` | Create a new snapshot store |
| `takeSnapshot(store, values, label?)` | Record a snapshot, returns new store |
| `restoreSnapshot(store, index)` | Get values at index, or `null` |
| `getLatestSnapshot(store)` | Get the most recent snapshot |
| `clearSnapshots(store)` | Remove all snapshots |
| `diffSnapshots(a, b)` | Return fields that differ between two snapshots |

### History

| Function | Description |
|---|---|
| `createHistory(maxSize?)` | Create a history state |
| `pushHistory(history, values, label?)` | Push new state, discards redo stack |
| `undo(history)` | Move back one step |
| `redo(history)` | Move forward one step |
| `canUndo(history)` | Whether undo is available |
| `canRedo(history)` | Whether redo is available |
| `getCurrentValues(history)` | Values at current cursor |
