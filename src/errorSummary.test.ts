import {
  createErrorSummary,
  mergeErrorSummaries,
  filterErrorSummary,
} from './errorSummary';

describe('createErrorSummary', () => {
  it('returns empty summary when no errors', () => {
    const summary = createErrorSummary({ name: null, email: undefined });
    expect(summary.hasErrors).toBe(false);
    expect(summary.count).toBe(0);
    expect(summary.errors).toEqual([]);
    expect(summary.firstError).toBeNull();
    expect(summary.byField).toEqual({});
  });

  it('collects all error messages', () => {
    const summary = createErrorSummary({
      name: 'Required',
      email: 'Invalid email',
      age: null,
    });
    expect(summary.hasErrors).toBe(true);
    expect(summary.count).toBe(2);
    expect(summary.errors).toContainEqual({ field: 'name', message: 'Required' });
    expect(summary.errors).toContainEqual({ field: 'email', message: 'Invalid email' });
  });

  it('sets firstError to the first encountered error', () => {
    const summary = createErrorSummary({ name: 'Required', email: 'Bad' });
    expect(summary.firstError?.field).toBe('name');
  });

  it('builds byField lookup', () => {
    const summary = createErrorSummary({ name: 'Required', email: 'Invalid' });
    expect(summary.byField['name']).toBe('Required');
    expect(summary.byField['email']).toBe('Invalid');
  });
});

describe('mergeErrorSummaries', () => {
  it('merges multiple summaries', () => {
    const a = createErrorSummary({ name: 'Required' });
    const b = createErrorSummary({ email: 'Invalid' });
    const merged = mergeErrorSummaries(a, b);
    expect(merged.count).toBe(2);
    expect(merged.byField['name']).toBe('Required');
    expect(merged.byField['email']).toBe('Invalid');
  });

  it('does not overwrite earlier field errors with later ones', () => {
    const a = createErrorSummary({ name: 'First error' });
    const b = createErrorSummary({ name: 'Second error' });
    const merged = mergeErrorSummaries(a, b);
    expect(merged.byField['name']).toBe('First error');
  });

  it('returns empty summary when all inputs are clean', () => {
    const a = createErrorSummary({});
    const b = createErrorSummary({});
    const merged = mergeErrorSummaries(a, b);
    expect(merged.hasErrors).toBe(false);
  });
});

describe('filterErrorSummary', () => {
  it('returns only errors for specified fields', () => {
    const summary = createErrorSummary({
      name: 'Required',
      email: 'Invalid',
      age: 'Too young',
    });
    const filtered = filterErrorSummary(summary, ['name', 'age']);
    expect(filtered.count).toBe(2);
    expect(filtered.byField['email']).toBeUndefined();
    expect(filtered.byField['name']).toBe('Required');
  });

  it('returns empty summary when no matching fields', () => {
    const summary = createErrorSummary({ name: 'Required' });
    const filtered = filterErrorSummary(summary, ['email']);
    expect(filtered.hasErrors).toBe(false);
    expect(filtered.firstError).toBeNull();
  });
});
