import {
  createDirtyFields,
  updateField,
  getDirtyFields,
  isDirtyField,
  hasAnyDirty,
  resetDirtyFields,
  getDirtyValues,
} from './dirtyFields';

interface TestForm {
  name: string;
  email: string;
  age: number;
}

const initial: Partial<TestForm> = { name: 'Alice', email: 'alice@example.com', age: 30 };

describe('createDirtyFields', () => {
  it('initializes with no dirty fields', () => {
    const state = createDirtyFields<TestForm>(initial);
    expect(state.dirty.size).toBe(0);
    expect(state.initial).toEqual(initial);
    expect(state.current).toEqual(initial);
  });
});

describe('updateField', () => {
  it('marks a field dirty when value changes', () => {
    const state = createDirtyFields<TestForm>(initial);
    const next = updateField(state, 'name', 'Bob');
    expect(next.dirty.has('name')).toBe(true);
    expect(next.current.name).toBe('Bob');
  });

  it('clears dirty when value reverts to initial', () => {
    const state = createDirtyFields<TestForm>(initial);
    const changed = updateField(state, 'name', 'Bob');
    const reverted = updateField(changed, 'name', 'Alice');
    expect(reverted.dirty.has('name')).toBe(false);
  });

  it('does not mutate original state', () => {
    const state = createDirtyFields<TestForm>(initial);
    updateField(state, 'email', 'new@example.com');
    expect(state.dirty.size).toBe(0);
  });
});

describe('getDirtyFields', () => {
  it('returns array of dirty field keys', () => {
    const state = createDirtyFields<TestForm>(initial);
    const next = updateField(updateField(state, 'name', 'Bob'), 'age', 25);
    const dirty = getDirtyFields(next);
    expect(dirty).toContain('name');
    expect(dirty).toContain('age');
    expect(dirty).not.toContain('email');
  });
});

describe('isDirtyField', () => {
  it('returns true for dirty field', () => {
    const state = updateField(createDirtyFields<TestForm>(initial), 'email', 'x@y.com');
    expect(isDirtyField(state, 'email')).toBe(true);
    expect(isDirtyField(state, 'name')).toBe(false);
  });
});

describe('hasAnyDirty', () => {
  it('returns false when nothing is dirty', () => {
    expect(hasAnyDirty(createDirtyFields<TestForm>(initial))).toBe(false);
  });

  it('returns true when at least one field is dirty', () => {
    const state = updateField(createDirtyFields<TestForm>(initial), 'age', 99);
    expect(hasAnyDirty(state)).toBe(true);
  });
});

describe('resetDirtyFields', () => {
  it('clears all dirty fields and resets initial to current', () => {
    const state = updateField(createDirtyFields<TestForm>(initial), 'name', 'Charlie');
    const reset = resetDirtyFields(state);
    expect(reset.dirty.size).toBe(0);
    expect(reset.initial.name).toBe('Charlie');
  });

  it('accepts explicit new initial values', () => {
    const state = createDirtyFields<TestForm>(initial);
    const reset = resetDirtyFields(state, { name: 'Dave', email: 'dave@d.com', age: 40 });
    expect(reset.initial.name).toBe('Dave');
  });
});

describe('getDirtyValues', () => {
  it('returns only the changed field values', () => {
    const state = updateField(
      updateField(createDirtyFields<TestForm>(initial), 'name', 'Eve'),
      'age',
      22
    );
    const dirty = getDirtyValues(state);
    expect(dirty).toEqual({ name: 'Eve', age: 22 });
    expect(dirty.email).toBeUndefined();
  });
});
