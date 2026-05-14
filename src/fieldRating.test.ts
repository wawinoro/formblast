import { createFieldRating } from './fieldRating';

describe('createFieldRating', () => {
  it('initializes with null value', () => {
    const rating = createFieldRating({ min: 1, max: 5 });
    const state = rating.getState();
    expect(state.value).toBeNull();
    expect(state.isValid).toBe(true);
    expect(state.percent).toBe(0);
  });

  it('returns error when required and value is null', () => {
    const rating = createFieldRating({ min: 1, max: 5, required: true });
    const state = rating.getState();
    expect(state.isValid).toBe(false);
    expect(state.error).toMatch(/required/i);
  });

  it('sets a valid value', () => {
    const rating = createFieldRating({ min: 1, max: 5 });
    const state = rating.setValue(3);
    expect(state.value).toBe(3);
    expect(state.isValid).toBe(true);
    expect(state.error).toBeNull();
  });

  it('returns error for out-of-range value', () => {
    const rating = createFieldRating({ min: 1, max: 5 });
    expect(rating.setValue(0).error).toMatch(/at least 1/);
    expect(rating.setValue(6).error).toMatch(/at most 5/);
  });

  it('respects step validation', () => {
    const rating = createFieldRating({ min: 0, max: 10, step: 2 });
    expect(rating.setValue(4).isValid).toBe(true);
    expect(rating.setValue(3).isValid).toBe(false);
  });

  it('calculates percent correctly', () => {
    const rating = createFieldRating({ min: 0, max: 10 });
    expect(rating.setValue(5).percent).toBe(50);
    expect(rating.setValue(10).percent).toBe(100);
  });

  it('increments value', () => {
    const rating = createFieldRating({ min: 1, max: 5 });
    rating.setValue(3);
    expect(rating.increment().value).toBe(4);
  });

  it('does not exceed max on increment', () => {
    const rating = createFieldRating({ min: 1, max: 5 });
    rating.setValue(5);
    expect(rating.increment().value).toBe(5);
  });

  it('decrements value', () => {
    const rating = createFieldRating({ min: 1, max: 5 });
    rating.setValue(3);
    expect(rating.decrement().value).toBe(2);
  });

  it('does not go below min on decrement', () => {
    const rating = createFieldRating({ min: 1, max: 5 });
    rating.setValue(1);
    expect(rating.decrement().value).toBe(1);
  });

  it('returns label when configured', () => {
    const rating = createFieldRating({ min: 1, max: 5, labels: { 5: 'Excellent' } });
    expect(rating.setValue(5).label).toBe('Excellent');
    expect(rating.setValue(3).label).toBeNull();
  });

  it('resets to null', () => {
    const rating = createFieldRating({ min: 1, max: 5 });
    rating.setValue(4);
    const state = rating.reset();
    expect(state.value).toBeNull();
  });

  it('throws when min >= max', () => {
    expect(() => createFieldRating({ min: 5, max: 5 })).toThrow();
    expect(() => createFieldRating({ min: 6, max: 5 })).toThrow();
  });

  it('throws when step <= 0', () => {
    expect(() => createFieldRating({ min: 1, max: 5, step: 0 })).toThrow();
  });
});
