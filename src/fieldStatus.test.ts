import {
  createFieldStatusState,
  setFieldStatus,
  getFieldStatus,
  applyValidationResult,
  disableField,
  isFieldDisabled,
  getStatusSummary,
} from './fieldStatus';

type Form = { username: string; email: string; age: string };

describe('fieldStatus', () => {
  it('creates state with empty statuses', () => {
    const state = createFieldStatusState<Form>();
    expect(state.statuses).toEqual({});
  });

  it('returns idle for unknown field', () => {
    const state = createFieldStatusState<Form>();
    expect(getFieldStatus(state, 'username')).toBe('idle');
  });

  it('sets and gets field status', () => {
    let state = createFieldStatusState<Form>();
    state = setFieldStatus(state, 'username', 'validating');
    expect(getFieldStatus(state, 'username')).toBe('validating');
  });

  it('does not mutate original state', () => {
    const state = createFieldStatusState<Form>();
    const next = setFieldStatus(state, 'email', 'valid');
    expect(state.statuses).toEqual({});
    expect(next.statuses.email).toBe('valid');
  });

  it('applies valid result', () => {
    let state = createFieldStatusState<Form>();
    state = applyValidationResult(state, 'email', { valid: true });
    expect(getFieldStatus(state, 'email')).toBe('valid');
  });

  it('applies invalid result', () => {
    let state = createFieldStatusState<Form>();
    state = applyValidationResult(state, 'email', { valid: false, error: 'bad email' });
    expect(getFieldStatus(state, 'email')).toBe('invalid');
  });

  it('disables a field', () => {
    let state = createFieldStatusState<Form>();
    state = disableField(state, 'age');
    expect(isFieldDisabled(state, 'age')).toBe(true);
    expect(isFieldDisabled(state, 'username')).toBe(false);
  });

  it('getStatusSummary groups fields by status', () => {
    let state = createFieldStatusState<Form>();
    state = setFieldStatus(state, 'username', 'valid');
    state = setFieldStatus(state, 'email', 'invalid');
    state = setFieldStatus(state, 'age', 'disabled');
    const summary = getStatusSummary(state);
    expect(summary.valid).toContain('username');
    expect(summary.invalid).toContain('email');
    expect(summary.disabled).toContain('age');
    expect(summary.idle).toHaveLength(0);
  });
});
