import { createFieldStepper } from './fieldSteppers';

describe('createFieldStepper', () => {
  it('initialises with the given value', () => {
    const s = createFieldStepper(5, { step: 1, min: 0, max: 10 });
    expect(s.getValue()).toBe(5);
  });

  it('increments by step', () => {
    const s = createFieldStepper(3, { step: 2, min: 0, max: 10 });
    s.increment();
    expect(s.getValue()).toBe(5);
  });

  it('decrements by step', () => {
    const s = createFieldStepper(6, { step: 2, min: 0, max: 10 });
    s.decrement();
    expect(s.getValue()).toBe(4);
  });

  it('clamps to max on increment', () => {
    const s = createFieldStepper(9, { step: 5, min: 0, max: 10 });
    s.increment();
    expect(s.getValue()).toBe(10);
  });

  it('clamps to min on decrement', () => {
    const s = createFieldStepper(1, { step: 5, min: 0, max: 10 });
    s.decrement();
    expect(s.getValue()).toBe(0);
  });

  it('returns valid result when in range', () => {
    const s = createFieldStepper(5, { step: 1, min: 0, max: 10 });
    const result = s.increment();
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('reports atMin and atMax in state', () => {
    const s = createFieldStepper(0, { step: 1, min: 0, max: 10 });
    expect(s.getState().atMin).toBe(true);
    expect(s.getState().atMax).toBe(false);
    s.setValue(10);
    expect(s.getState().atMax).toBe(true);
    expect(s.getState().atMin).toBe(false);
  });

  it('resets to initial value', () => {
    const s = createFieldStepper(3, { step: 1, min: 0, max: 10 });
    s.increment();
    s.increment();
    s.reset();
    expect(s.getValue()).toBe(3);
  });

  it('uses custom validator', () => {
    const s = createFieldStepper(4, {
      step: 1,
      validate: (v) => v % 2 === 0 ? { valid: true, error: null } : { valid: false, error: 'Must be even' },
    });
    const result = s.increment();
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Must be even');
  });

  it('works without min/max bounds', () => {
    const s = createFieldStepper(100, { step: 50 });
    s.increment();
    expect(s.getValue()).toBe(150);
    s.decrement();
    s.decrement();
    expect(s.getValue()).toBe(50);
  });
});
