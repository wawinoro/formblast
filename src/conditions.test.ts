import { requiredWhen, skipWhen, when } from './conditions';
import { minLength } from './validators';

describe('requiredWhen', () => {
  const isSubscribed = (values: Record<string, unknown>) =>
    values.subscribed === true;

  it('returns null when predicate is false', () => {
    const validator = requiredWhen(isSubscribed);
    expect(validator('', { values: { subscribed: false } })).toBeNull();
  });

  it('returns error when predicate is true and value is empty', () => {
    const validator = requiredWhen(isSubscribed);
    expect(validator('', { values: { subscribed: true } })).toBe(
      'This field is required'
    );
  });

  it('returns null when predicate is true and value is present', () => {
    const validator = requiredWhen(isSubscribed);
    expect(validator('hello', { values: { subscribed: true } })).toBeNull();
  });

  it('supports a custom message', () => {
    const validator = requiredWhen(isSubscribed, 'Email is required for subscribers');
    expect(validator(null, { values: { subscribed: true } })).toBe(
      'Email is required for subscribers'
    );
  });

  it('returns null when no context is provided', () => {
    const validator = requiredWhen(isSubscribed);
    expect(validator('')).toBeNull();
  });
});

describe('skipWhen', () => {
  const isDisabled = (values: Record<string, unknown>) =>
    values.disabled === true;

  it('skips the inner validator when predicate is true', () => {
    const validator = skipWhen(isDisabled, minLength(5));
    expect(validator('hi', { values: { disabled: true } })).toBeNull();
  });

  it('runs the inner validator when predicate is false', () => {
    const validator = skipWhen(isDisabled, minLength(5));
    expect(validator('hi', { values: { disabled: false } })).not.toBeNull();
  });
});

describe('when', () => {
  const isAdvanced = (values: Record<string, unknown>) =>
    values.mode === 'advanced';

  it('returns no error when predicate is false', () => {
    const conditional = when(isAdvanced, { validators: [minLength(8)] });
    const result = conditional.validators![0]('abc', { values: { mode: 'basic' } });
    expect(result).toBeNull();
  });

  it('returns error when predicate is true and validation fails', () => {
    const conditional = when(isAdvanced, { validators: [minLength(8)] });
    const result = conditional.validators![0]('abc', { values: { mode: 'advanced' } });
    expect(result).not.toBeNull();
  });

  it('returns null when predicate is true and validation passes', () => {
    const conditional = when(isAdvanced, { validators: [minLength(8)] });
    const result = conditional.validators![0]('strongpass', { values: { mode: 'advanced' } });
    expect(result).toBeNull();
  });
});
