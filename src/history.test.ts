import {
  createHistory,
  pushHistory,
  undo,
  redo,
  canUndo,
  canRedo,
  getCurrentValues,
} from './history';

type Form = { name: string; email: string };

const v1: Form = { name: 'Alice', email: 'alice@example.com' };
const v2: Form = { name: 'Bob', email: 'bob@example.com' };
const v3: Form = { name: 'Carol', email: 'carol@example.com' };

describe('createHistory', () => {
  it('starts with empty state', () => {
    const h = createHistory<Form>();
    expect(h.cursor).toBe(-1);
    expect(h.store.snapshots).toHaveLength(0);
  });
});

describe('pushHistory', () => {
  it('adds entries and advances cursor', () => {
    let h = createHistory<Form>();
    h = pushHistory(h, v1);
    h = pushHistory(h, v2);
    expect(h.store.snapshots).toHaveLength(2);
    expect(h.cursor).toBe(1);
  });

  it('discards redo states when pushing after undo', () => {
    let h = createHistory<Form>();
    h = pushHistory(h, v1);
    h = pushHistory(h, v2);
    ({ history: h } = undo(h));
    h = pushHistory(h, v3);
    expect(h.store.snapshots).toHaveLength(2);
    expect(getCurrentValues(h)).toEqual(v3);
  });
});

describe('undo', () => {
  it('moves cursor back and returns previous values', () => {
    let h = createHistory<Form>();
    h = pushHistory(h, v1);
    h = pushHistory(h, v2);
    const { history: h2, values } = undo(h);
    expect(values).toEqual(v1);
    expect(h2.cursor).toBe(0);
  });

  it('returns null when at the beginning', () => {
    let h = createHistory<Form>();
    h = pushHistory(h, v1);
    const { values } = undo(h);
    expect(values).toBeNull();
  });
});

describe('redo', () => {
  it('moves cursor forward after undo', () => {
    let h = createHistory<Form>();
    h = pushHistory(h, v1);
    h = pushHistory(h, v2);
    ({ history: h } = undo(h));
    const { history: h2, values } = redo(h);
    expect(values).toEqual(v2);
    expect(h2.cursor).toBe(1);
  });

  it('returns null when at the latest state', () => {
    let h = createHistory<Form>();
    h = pushHistory(h, v1);
    const { values } = redo(h);
    expect(values).toBeNull();
  });
});

describe('canUndo / canRedo', () => {
  it('reflects correct undo/redo availability', () => {
    let h = createHistory<Form>();
    expect(canUndo(h)).toBe(false);
    expect(canRedo(h)).toBe(false);
    h = pushHistory(h, v1);
    expect(canUndo(h)).toBe(false);
    h = pushHistory(h, v2);
    expect(canUndo(h)).toBe(true);
    expect(canRedo(h)).toBe(false);
    ({ history: h } = undo(h));
    expect(canRedo(h)).toBe(true);
  });
});

describe('getCurrentValues', () => {
  it('returns values at current cursor', () => {
    let h = createHistory<Form>();
    h = pushHistory(h, v1);
    h = pushHistory(h, v2);
    expect(getCurrentValues(h)).toEqual(v2);
  });

  it('returns null on empty history', () => {
    const h = createHistory<Form>();
    expect(getCurrentValues(h)).toBeNull();
  });
});
