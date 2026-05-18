import { createFieldColor, normalizeHex } from './fieldColor';

describe('normalizeHex', () => {
  it('expands 3-char hex to 6-char', () => {
    expect(normalizeHex('#abc')).toBe('#aabbcc');
  });

  it('expands 4-char hex to 8-char', () => {
    expect(normalizeHex('#abcd')).toBe('#aabbccdd');
  });

  it('leaves 6-char hex unchanged', () => {
    expect(normalizeHex('#aabbcc')).toBe('#aabbcc');
  });

  it('leaves 8-char hex unchanged', () => {
    expect(normalizeHex('#aabbccdd')).toBe('#aabbccdd');
  });
});

describe('createFieldColor', () => {
  it('initializes with default state', () => {
    const field = createFieldColor();
    const state = field.getState();
    expect(state.value).toBe('');
    expect(state.isValid).toBe(false);
    expect(state.touched).toBe(false);
  });

  it('validates a valid 6-char hex color', () => {
    const field = createFieldColor();
    const state = field.setValue('#ff0000');
    expect(state.isValid).toBe(true);
    expect(state.error).toBeNull();
    expect(state.hex).toBe('#ff0000');
  });

  it('validates and expands a 3-char hex color', () => {
    const field = createFieldColor();
    const state = field.setValue('#f00');
    expect(state.isValid).toBe(true);
    expect(state.hex).toBe('#ff0000');
  });

  it('rejects alpha hex when allowAlpha is false', () => {
    const field = createFieldColor({ allowAlpha: false });
    const state = field.setValue('#ff0000aa');
    expect(state.isValid).toBe(false);
    expect(state.error).toMatch(/alpha/i);
  });

  it('accepts alpha hex when allowAlpha is true', () => {
    const field = createFieldColor({ allowAlpha: true });
    const state = field.setValue('#ff0000aa');
    expect(state.isValid).toBe(true);
  });

  it('rejects named colors by default', () => {
    const field = createFieldColor();
    const state = field.setValue('red');
    expect(state.isValid).toBe(false);
  });

  it('accepts named colors when allowNamed is true', () => {
    const field = createFieldColor({ allowNamed: true });
    const state = field.setValue('red');
    expect(state.isValid).toBe(true);
  });

  it('returns error for empty value', () => {
    const field = createFieldColor();
    const result = field.validate('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Color is required');
  });

  it('marks field as touched', () => {
    const field = createFieldColor();
    field.touch();
    expect(field.getState().touched).toBe(true);
  });

  it('resets to default state', () => {
    const field = createFieldColor({ defaultValue: '#000000' });
    field.setValue('#ffffff');
    field.touch();
    const state = field.reset();
    expect(state.value).toBe('#000000');
    expect(state.touched).toBe(false);
  });
});
