import {
  createFieldLock,
  lockField,
  unlockField,
  setReadonly,
  isLocked,
  isReadonly,
  canEdit,
  getLockedFields,
  lockAll,
} from './fieldLock';

type Form = { name: string; email: string; age: number };

describe('fieldLock', () => {
  it('creates initial state with no locked or readonly fields', () => {
    const state = createFieldLock<Form>();
    expect(state.locked.size).toBe(0);
    expect(state.readonly.size).toBe(0);
  });

  it('locks a field', () => {
    const state = createFieldLock<Form>();
    const next = lockField(state, 'name');
    expect(isLocked(next, 'name')).toBe(true);
    expect(isLocked(next, 'email')).toBe(false);
  });

  it('unlocks a previously locked field', () => {
    let state = createFieldLock<Form>();
    state = lockField(state, 'name');
    state = unlockField(state, 'name');
    expect(isLocked(state, 'name')).toBe(false);
  });

  it('does not mutate original state when locking', () => {
    const original = createFieldLock<Form>();
    lockField(original, 'email');
    expect(original.locked.size).toBe(0);
  });

  it('sets a field as readonly', () => {
    const state = createFieldLock<Form>();
    const next = setReadonly(state, 'age', true);
    expect(isReadonly(next, 'age')).toBe(true);
    expect(isReadonly(next, 'name')).toBe(false);
  });

  it('removes readonly from a field', () => {
    let state = createFieldLock<Form>();
    state = setReadonly(state, 'age', true);
    state = setReadonly(state, 'age', false);
    expect(isReadonly(state, 'age')).toBe(false);
  });

  it('canEdit returns false if field is locked', () => {
    const state = lockField(createFieldLock<Form>(), 'name');
    expect(canEdit(state, 'name')).toBe(false);
  });

  it('canEdit returns false if field is readonly', () => {
    const state = setReadonly(createFieldLock<Form>(), 'email', true);
    expect(canEdit(state, 'email')).toBe(false);
  });

  it('canEdit returns true for unrestricted field', () => {
    const state = createFieldLock<Form>();
    expect(canEdit(state, 'name')).toBe(true);
  });

  it('getLockedFields returns all locked field keys', () => {
    let state = createFieldLock<Form>();
    state = lockField(state, 'name');
    state = lockField(state, 'age');
    const fields = getLockedFields(state);
    expect(fields).toContain('name');
    expect(fields).toContain('age');
    expect(fields.length).toBe(2);
  });

  it('lockAll replaces locked set with provided fields', () => {
    let state = createFieldLock<Form>();
    state = lockField(state, 'name');
    state = lockAll(state, ['email', 'age']);
    expect(isLocked(state, 'email')).toBe(true);
    expect(isLocked(state, 'age')).toBe(true);
    expect(isLocked(state, 'name')).toBe(false);
  });
});
