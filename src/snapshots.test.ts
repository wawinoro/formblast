import {
  createSnapshotStore,
  takeSnapshot,
  restoreSnapshot,
  getLatestSnapshot,
  clearSnapshots,
  diffSnapshots,
} from './snapshots';

type FormValues = { name: string; email: string; age: number };

const initial: FormValues = { name: 'Alice', email: 'alice@example.com', age: 30 };

describe('createSnapshotStore', () => {
  it('creates an empty store with default maxSize', () => {
    const store = createSnapshotStore<FormValues>();
    expect(store.snapshots).toHaveLength(0);
    expect(store.maxSize).toBe(10);
  });

  it('respects custom maxSize', () => {
    const store = createSnapshotStore<FormValues>(3);
    expect(store.maxSize).toBe(3);
  });
});

describe('takeSnapshot', () => {
  it('adds a snapshot to the store', () => {
    const store = createSnapshotStore<FormValues>();
    const updated = takeSnapshot(store, initial, 'initial save');
    expect(updated.snapshots).toHaveLength(1);
    expect(updated.snapshots[0].values).toEqual(initial);
    expect(updated.snapshots[0].label).toBe('initial save');
  });

  it('does not mutate original store', () => {
    const store = createSnapshotStore<FormValues>();
    takeSnapshot(store, initial);
    expect(store.snapshots).toHaveLength(0);
  });

  it('trims to maxSize', () => {
    let store = createSnapshotStore<FormValues>(2);
    store = takeSnapshot(store, initial);
    store = takeSnapshot(store, { ...initial, name: 'Bob' });
    store = takeSnapshot(store, { ...initial, name: 'Carol' });
    expect(store.snapshots).toHaveLength(2);
    expect(store.snapshots[0].values.name).toBe('Bob');
  });
});

describe('restoreSnapshot', () => {
  it('returns values at given index', () => {
    let store = createSnapshotStore<FormValues>();
    store = takeSnapshot(store, initial);
    const restored = restoreSnapshot(store, 0);
    expect(restored).toEqual(initial);
  });

  it('returns null for invalid index', () => {
    const store = createSnapshotStore<FormValues>();
    expect(restoreSnapshot(store, 0)).toBeNull();
  });
});

describe('getLatestSnapshot', () => {
  it('returns the most recent snapshot', () => {
    let store = createSnapshotStore<FormValues>();
    store = takeSnapshot(store, initial, 'first');
    store = takeSnapshot(store, { ...initial, name: 'Bob' }, 'second');
    expect(getLatestSnapshot(store)?.label).toBe('second');
  });

  it('returns null when store is empty', () => {
    const store = createSnapshotStore<FormValues>();
    expect(getLatestSnapshot(store)).toBeNull();
  });
});

describe('clearSnapshots', () => {
  it('removes all snapshots', () => {
    let store = createSnapshotStore<FormValues>();
    store = takeSnapshot(store, initial);
    store = clearSnapshots(store);
    expect(store.snapshots).toHaveLength(0);
  });
});

describe('diffSnapshots', () => {
  it('returns changed fields between two snapshots', () => {
    let store = createSnapshotStore<FormValues>();
    store = takeSnapshot(store, initial);
    store = takeSnapshot(store, { ...initial, name: 'Bob', age: 25 });
    const diff = diffSnapshots(store.snapshots[0], store.snapshots[1]);
    expect(diff).toEqual({ name: 'Bob', age: 25 });
  });

  it('returns empty object when snapshots are identical', () => {
    let store = createSnapshotStore<FormValues>();
    store = takeSnapshot(store, initial);
    store = takeSnapshot(store, { ...initial });
    const diff = diffSnapshots(store.snapshots[0], store.snapshots[1]);
    expect(diff).toEqual({});
  });
});
