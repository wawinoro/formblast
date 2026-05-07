import {
  createFocusTrap,
  focusNext,
  focusPrev,
  focusFirst,
  focusLast,
  getCurrentField,
} from './focusTrap';

type Form = { name: string; email: string; age: string; bio: string };
const fields: (keyof Form)[] = ['name', 'email', 'age', 'bio'];

describe('createFocusTrap', () => {
  it('initializes with first field focused', () => {
    const state = createFocusTrap<Form>(fields);
    expect(state.currentIndex).toBe(0);
    expect(state.fields).toEqual(fields);
    expect(state.skipInvalid).toBe(false);
  });

  it('respects skipInvalid option', () => {
    const state = createFocusTrap<Form>(fields, { skipInvalid: true });
    expect(state.skipInvalid).toBe(true);
  });
});

describe('focusNext', () => {
  it('moves to next field', () => {
    const state = createFocusTrap<Form>(fields);
    const { state: next, field } = focusNext(state);
    expect(field).toBe('email');
    expect(next.currentIndex).toBe(1);
  });

  it('returns null when at last field', () => {
    const state = createFocusTrap<Form>(fields);
    const last = { ...state, currentIndex: 3 };
    const { field } = focusNext(last);
    expect(field).toBeNull();
  });

  it('skips invalid fields when skipInvalid is true', () => {
    const state = createFocusTrap<Form>(fields, { skipInvalid: true });
    const invalid = new Set<keyof Form>(['email']);
    const { field } = focusNext(state, invalid);
    expect(field).toBe('age');
  });
});

describe('focusPrev', () => {
  it('moves to previous field', () => {
    const state = { ...createFocusTrap<Form>(fields), currentIndex: 2 };
    const { state: prev, field } = focusPrev(state);
    expect(field).toBe('email');
    expect(prev.currentIndex).toBe(1);
  });

  it('returns null when at first field', () => {
    const state = createFocusTrap<Form>(fields);
    const { field } = focusPrev(state);
    expect(field).toBeNull();
  });

  it('skips invalid fields when skipInvalid is true', () => {
    const state = { ...createFocusTrap<Form>(fields, { skipInvalid: true }), currentIndex: 3 };
    const invalid = new Set<keyof Form>(['age']);
    const { field } = focusPrev(state, invalid);
    expect(field).toBe('email');
  });
});

describe('focusFirst / focusLast', () => {
  it('jumps to first field', () => {
    const state = { ...createFocusTrap<Form>(fields), currentIndex: 3 };
    const { field } = focusFirst(state);
    expect(field).toBe('name');
  });

  it('jumps to last field', () => {
    const state = createFocusTrap<Form>(fields);
    const { field } = focusLast(state);
    expect(field).toBe('bio');
  });
});

describe('getCurrentField', () => {
  it('returns currently focused field', () => {
    const state = { ...createFocusTrap<Form>(fields), currentIndex: 2 };
    expect(getCurrentField(state)).toBe('age');
  });
});
