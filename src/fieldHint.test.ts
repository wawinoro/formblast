import { createFieldHint, HintRule } from './fieldHint';

describe('createFieldHint', () => {
  it('returns empty hints when no rules match', () => {
    const hint = createFieldHint<string>();
    const state = hint.evaluate('hello');
    expect(state.hints).toEqual([]);
    expect(state.activeHint).toBeNull();
  });

  it('returns matching hints for current value', () => {
    const hint = createFieldHint<string>([
      { when: (v) => v.length < 8, message: 'Use at least 8 characters' },
      { when: (v) => !/[A-Z]/.test(v), message: 'Add an uppercase letter' },
    ]);
    const state = hint.evaluate('abc');
    expect(state.hints).toContain('Use at least 8 characters');
    expect(state.hints).toContain('Add an uppercase letter');
    expect(state.activeHint).toBe('Use at least 8 characters');
  });

  it('returns only matching hints', () => {
    const hint = createFieldHint<string>([
      { when: (v) => v.length < 8, message: 'Use at least 8 characters' },
      { when: (v) => !/[A-Z]/.test(v), message: 'Add an uppercase letter' },
    ]);
    const state = hint.evaluate('Abcdefgh');
    expect(state.hints).not.toContain('Use at least 8 characters');
    expect(state.hints).not.toContain('Add an uppercase letter');
  });

  it('addRule appends a new rule', () => {
    const hint = createFieldHint<number>();
    hint.addRule({ when: (v) => v < 0, message: 'Must be positive' });
    const state = hint.evaluate(-5);
    expect(state.hints).toContain('Must be positive');
  });

  it('removeRule removes rule by message', () => {
    const hint = createFieldHint<string>([
      { when: () => true, message: 'Always shown' },
      { when: () => true, message: 'Also shown' },
    ]);
    hint.removeRule('Always shown');
    const hints = hint.getActiveHints('anything');
    expect(hints).not.toContain('Always shown');
    expect(hints).toContain('Also shown');
  });

  it('clear removes all rules', () => {
    const hint = createFieldHint<string>([
      { when: () => true, message: 'Rule A' },
      { when: () => true, message: 'Rule B' },
    ]);
    hint.clear();
    const state = hint.evaluate('test');
    expect(state.hints).toEqual([]);
  });

  it('getActiveHints returns array of matching messages', () => {
    const hint = createFieldHint<number>([
      { when: (v) => v > 100, message: 'Value is large' },
      { when: (v) => v % 2 === 0, message: 'Value is even' },
    ]);
    const hints = hint.getActiveHints(200);
    expect(hints).toContain('Value is large');
    expect(hints).toContain('Value is even');
  });

  it('evaluate includes value in returned state', () => {
    const hint = createFieldHint<string>();
    const state = hint.evaluate('myvalue');
    expect(state.value).toBe('myvalue');
  });
});
