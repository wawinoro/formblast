import { createResetForm, FormResetState } from './resetForm';

interface TestForm {
  username: string;
  email: string;
  age: number;
}

const defaults: TestForm = {
  username: '',
  email: '',
  age: 0,
};

const schema = {};

function makeState(overrides: Partial<FormResetState<TestForm>> = {}): FormResetState<TestForm> {
  return {
    values: { username: 'alice', email: 'alice@example.com', age: 30 },
    errors: { username: ['too short'], email: ['invalid'] },
    touched: { username: true, email: true },
    dirty: { username: true },
    resetCount: 0,
    ...overrides,
  };
}

describe('createResetForm', () => {
  it('resets values to defaults', () => {
    const { reset } = createResetForm(schema, defaults);
    const state = makeState();
    const next = reset(state);
    expect(next.values).toEqual(defaults);
  });

  it('merges initialValues over defaults', () => {
    const { reset } = createResetForm(schema, defaults);
    const state = makeState();
    const next = reset(state, { initialValues: { username: 'bob' } });
    expect(next.values.username).toBe('bob');
    expect(next.values.email).toBe('');
  });

  it('clears errors by default', () => {
    const { reset } = createResetForm(schema, defaults);
    const next = reset(makeState());
    expect(next.errors).toEqual({});
  });

  it('keeps errors when keepErrors is true', () => {
    const { reset } = createResetForm(schema, defaults);
    const state = makeState();
    const next = reset(state, { keepErrors: true });
    expect(next.errors).toEqual(state.errors);
  });

  it('clears touched by default', () => {
    const { reset } = createResetForm(schema, defaults);
    const next = reset(makeState());
    expect(next.touched).toEqual({});
  });

  it('keeps touched when keepTouched is true', () => {
    const { reset } = createResetForm(schema, defaults);
    const state = makeState();
    const next = reset(state, { keepTouched: true });
    expect(next.touched).toEqual(state.touched);
  });

  it('always clears dirty on reset', () => {
    const { reset } = createResetForm(schema, defaults);
    const next = reset(makeState());
    expect(next.dirty).toEqual({});
  });

  it('increments resetCount on each reset', () => {
    const { reset, getResetCount } = createResetForm(schema, defaults);
    reset(makeState());
    reset(makeState());
    expect(getResetCount()).toBe(2);
  });

  it('resetField restores a single field to default', () => {
    const { resetField } = createResetForm(schema, defaults);
    const state = makeState();
    const next = resetField(state, 'username');
    expect(next.values.username).toBe('');
    expect(next.values.email).toBe('alice@example.com');
  });

  it('resetField accepts a custom value', () => {
    const { resetField } = createResetForm(schema, defaults);
    const state = makeState();
    const next = resetField(state, 'username', 'charlie');
    expect(next.values.username).toBe('charlie');
  });

  it('resetField clears error and touched for that field', () => {
    const { resetField } = createResetForm(schema, defaults);
    const state = makeState();
    const next = resetField(state, 'username');
    expect(next.errors.username).toBeUndefined();
    expect(next.touched.username).toBe(false);
    expect(next.dirty.username).toBe(false);
  });
});
