import {
  defineCrossFieldRule,
  validateCrossFields,
  hasCrossFieldErrors,
} from './crossField';

type SignupForm = {
  password: string;
  confirmPassword: string;
  minAge: number;
  maxAge: number;
};

describe('defineCrossFieldRule', () => {
  it('creates a rule with the correct shape', () => {
    const rule = defineCrossFieldRule<SignupForm>(
      ['password', 'confirmPassword'],
      (values) =>
        values.password !== values.confirmPassword ? 'Passwords must match' : null
    );
    expect(rule.fields).toEqual(['password', 'confirmPassword']);
    expect(typeof rule.validate).toBe('function');
  });

  it('stores an optional override message', () => {
    const rule = defineCrossFieldRule<SignupForm>(
      ['password', 'confirmPassword'],
      () => 'error',
      'Custom override'
    );
    expect(rule.message).toBe('Custom override');
  });
});

describe('validateCrossFields', () => {
  it('returns empty result when all rules pass', () => {
    const rule = defineCrossFieldRule<SignupForm>(
      ['password', 'confirmPassword'],
      (v) => (v.password !== v.confirmPassword ? 'Passwords must match' : null)
    );
    const result = validateCrossFields<SignupForm>(
      { password: 'abc123', confirmPassword: 'abc123' },
      [rule]
    );
    expect(result).toEqual({});
  });

  it('returns errors for all involved fields when rule fails', () => {
    const rule = defineCrossFieldRule<SignupForm>(
      ['password', 'confirmPassword'],
      (v) => (v.password !== v.confirmPassword ? 'Passwords must match' : null)
    );
    const result = validateCrossFields<SignupForm>(
      { password: 'abc123', confirmPassword: 'xyz' },
      [rule]
    );
    expect(result.password).toBe('Passwords must match');
    expect(result.confirmPassword).toBe('Passwords must match');
  });

  it('uses override message when provided', () => {
    const rule = defineCrossFieldRule<SignupForm>(
      ['minAge', 'maxAge'],
      (v) => ((v.minAge ?? 0) > (v.maxAge ?? 0) ? 'Invalid range' : null),
      'Min must be less than max'
    );
    const result = validateCrossFields<SignupForm>({ minAge: 50, maxAge: 10 }, [rule]);
    expect(result.minAge).toBe('Min must be less than max');
    expect(result.maxAge).toBe('Min must be less than max');
  });

  it('does not overwrite an already-set field error from a prior rule', () => {
    const rule1 = defineCrossFieldRule<SignupForm>(
      ['password'],
      () => 'First error'
    );
    const rule2 = defineCrossFieldRule<SignupForm>(
      ['password'],
      () => 'Second error'
    );
    const result = validateCrossFields<SignupForm>({ password: 'x' }, [rule1, rule2]);
    expect(result.password).toBe('First error');
  });
});

describe('hasCrossFieldErrors', () => {
  it('returns false for empty result', () => {
    expect(hasCrossFieldErrors({})).toBe(false);
  });

  it('returns true when errors exist', () => {
    expect(hasCrossFieldErrors({ password: 'Passwords must match' })).toBe(true);
  });

  it('returns false when all values are null', () => {
    expect(hasCrossFieldErrors({ password: null })).toBe(false);
  });
});
