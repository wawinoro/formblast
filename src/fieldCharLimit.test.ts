import { createCharLimit } from './fieldCharLimit';

describe('createCharLimit', () => {
  describe('getState', () => {
    it('returns correct state for value within limit', () => {
      const limit = createCharLimit({ max: 10 });
      const state = limit.getState('hello');
      expect(state.current).toBe(5);
      expect(state.remaining).toBe(5);
      expect(state.exceeded).toBe(false);
      expect(state.percentage).toBe(50);
    });

    it('marks exceeded when over limit', () => {
      const limit = createCharLimit({ max: 5 });
      const state = limit.getState('toolongstring');
      expect(state.exceeded).toBe(true);
      expect(state.remaining).toBeLessThan(0);
      expect(state.percentage).toBe(100);
    });

    it('returns 100% when exactly at limit', () => {
      const limit = createCharLimit({ max: 5 });
      const state = limit.getState('hello');
      expect(state.percentage).toBe(100);
      expect(state.exceeded).toBe(false);
    });
  });

  describe('isWarning', () => {
    it('returns false when no warnAt configured', () => {
      const limit = createCharLimit({ max: 10 });
      expect(limit.isWarning('hello')).toBe(false);
    });

    it('returns true when at or past warnAt threshold', () => {
      const limit = createCharLimit({ max: 10, warnAt: 8 });
      expect(limit.isWarning('abcdefgh')).toBe(true);
      expect(limit.isWarning('abcdefghi')).toBe(true);
    });

    it('returns false when below warnAt', () => {
      const limit = createCharLimit({ max: 10, warnAt: 8 });
      expect(limit.isWarning('hello')).toBe(false);
    });

    it('returns false when exceeded (past max)', () => {
      const limit = createCharLimit({ max: 10, warnAt: 8 });
      expect(limit.isWarning('abcdefghijk')).toBe(false);
    });
  });

  describe('enforce', () => {
    it('truncates string to max chars', () => {
      const limit = createCharLimit({ max: 5 });
      expect(limit.enforce('toolongstring')).toBe('toolo');
    });

    it('returns original string when within limit', () => {
      const limit = createCharLimit({ max: 10 });
      expect(limit.enforce('hello')).toBe('hello');
    });

    it('handles byte mode truncation', () => {
      const limit = createCharLimit({ max: 5, countMode: 'bytes' });
      const result = limit.enforce('hello world');
      expect(new TextEncoder().encode(result).length).toBeLessThanOrEqual(5);
    });
  });

  describe('toValidator', () => {
    it('returns no error when within limit', () => {
      const limit = createCharLimit({ max: 10 });
      const [validator] = limit.toValidator()!;
      expect(validator('hello', {} as any)).toBeUndefined();
    });

    it('returns error when over limit', () => {
      const limit = createCharLimit({ max: 5 });
      const [validator] = limit.toValidator()!;
      const result = validator('toolong', {} as any);
      expect(typeof result).toBe('string');
      expect(result).toContain('5');
    });

    it('uses custom message when provided', () => {
      const limit = createCharLimit({ max: 5 });
      const [validator] = limit.toValidator('Too long!')!;
      expect(validator('toolong', {} as any)).toBe('Too long!');
    });

    it('returns undefined for non-string values', () => {
      const limit = createCharLimit({ max: 5 });
      const [validator] = limit.toValidator()!;
      expect(validator(null, {} as any)).toBeUndefined();
      expect(validator(42, {} as any)).toBeUndefined();
    });
  });
});
