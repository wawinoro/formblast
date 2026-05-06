import { validateGroup, getGroupErrors, getFieldError } from './groups';
import { minLength, maxLength } from './validators';
import { required } from './conditions';

const schema = {
  username: {
    validators: [minLength(3), maxLength(20)],
    conditions: [required()],
  },
  email: {
    validators: [{ validate: (v: unknown) => typeof v === 'string' && v.includes('@'), message: 'Invalid email' }],
    conditions: [required()],
  },
  bio: {
    validators: [maxLength(200)],
  },
};

describe('validateGroup', () => {
  it('returns valid summary when all fields pass', () => {
    const values = { username: 'alice', email: 'alice@example.com', bio: 'Hello!' };
    const summary = validateGroup(values, schema);
    expect(summary.valid).toBe(true);
    expect(Object.keys(summary.errors)).toHaveLength(0);
  });

  it('returns invalid summary when a field fails', () => {
    const values = { username: 'al', email: 'alice@example.com', bio: '' };
    const summary = validateGroup(values, schema);
    expect(summary.valid).toBe(false);
    expect(summary.errors.username).toBeDefined();
    expect(summary.errors.email).toBeUndefined();
  });

  it('collects errors for multiple invalid fields', () => {
    const values = { username: '', email: 'not-an-email', bio: '' };
    const summary = validateGroup(values, schema);
    expect(summary.valid).toBe(false);
    expect(Object.keys(summary.errors).length).toBeGreaterThanOrEqual(2);
  });

  it('includes per-field results', () => {
    const values = { username: 'alice', email: 'alice@example.com', bio: '' };
    const summary = validateGroup(values, schema);
    expect(summary.results.username.valid).toBe(true);
  });
});

describe('getGroupErrors', () => {
  it('returns flat list of all errors', () => {
    const values = { username: 'al', email: 'bad', bio: '' };
    const summary = validateGroup(values, schema);
    const allErrors = getGroupErrors(summary);
    expect(Array.isArray(allErrors)).toBe(true);
    expect(allErrors.length).toBeGreaterThan(0);
  });

  it('returns empty array when valid', () => {
    const values = { username: 'alice', email: 'alice@example.com', bio: '' };
    const summary = validateGroup(values, schema);
    expect(getGroupErrors(summary)).toEqual([]);
  });
});

describe('getFieldError', () => {
  it('returns first error for a field', () => {
    const values = { username: 'al', email: 'alice@example.com', bio: '' };
    const summary = validateGroup(values, schema);
    const err = getFieldError(summary, 'username');
    expect(typeof err).toBe('string');
  });

  it('returns undefined when field is valid', () => {
    const values = { username: 'alice', email: 'alice@example.com', bio: '' };
    const summary = validateGroup(values, schema);
    expect(getFieldError(summary, 'username')).toBeUndefined();
  });
});
