import {
  createTouchedState,
  touchField,
  markDirty,
  isTouched,
  isDirty,
  resetTouched,
  getTouchedFields,
  getDirtyFields,
  hasAnyTouched,
  hasAnyDirty,
} from './touched';

describe('touched state', () => {
  it('creates empty state', () => {
    const state = createTouchedState();
    expect(state.fields.size).toBe(0);
    expect(state.dirty.size).toBe(0);
  });

  it('marks a field as touched', () => {
    let state = createTouchedState();
    state = touchField(state, 'email');
    expect(isTouched(state, 'email')).toBe(true);
    expect(isTouched(state, 'name')).toBe(false);
  });

  it('marks field as dirty when value changes', () => {
    let state = createTouchedState();
    state = markDirty(state, 'email', 'old@test.com', 'new@test.com');
    expect(isDirty(state, 'email')).toBe(true);
  });

  it('clears dirty when value reverts to original', () => {
    let state = createTouchedState();
    state = markDirty(state, 'email', 'old@test.com', 'new@test.com');
    state = markDirty(state, 'email', 'old@test.com', 'old@test.com');
    expect(isDirty(state, 'email')).toBe(false);
  });

  it('resets a single field', () => {
    let state = createTouchedState();
    state = touchField(state, 'email');
    state = touchField(state, 'name');
    state = markDirty(state, 'email', 'a', 'b');
    state = resetTouched(state, 'email');
    expect(isTouched(state, 'email')).toBe(false);
    expect(isDirty(state, 'email')).toBe(false);
    expect(isTouched(state, 'name')).toBe(true);
  });

  it('resets all fields', () => {
    let state = createTouchedState();
    state = touchField(state, 'email');
    state = touchField(state, 'name');
    state = resetTouched(state);
    expect(hasAnyTouched(state)).toBe(false);
    expect(hasAnyDirty(state)).toBe(false);
  });

  it('returns touched field names', () => {
    let state = createTouchedState();
    state = touchField(state, 'email');
    state = touchField(state, 'name');
    const fields = getTouchedFields(state);
    expect(fields).toContain('email');
    expect(fields).toContain('name');
    expect(fields.length).toBe(2);
  });

  it('returns dirty field names', () => {
    let state = createTouchedState();
    state = markDirty(state, 'email', 'a', 'b');
    state = markDirty(state, 'name', 'x', 'x');
    const dirty = getDirtyFields(state);
    expect(dirty).toContain('email');
    expect(dirty).not.toContain('name');
  });

  it('hasAnyTouched returns false for empty state', () => {
    const state = createTouchedState();
    expect(hasAnyTouched(state)).toBe(false);
  });

  it('hasAnyDirty returns true when at least one dirty field exists', () => {
    let state = createTouchedState();
    state = markDirty(state, 'age', 1, 2);
    expect(hasAnyDirty(state)).toBe(true);
  });
});
