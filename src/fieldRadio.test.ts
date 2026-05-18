import { createFieldRadio } from './fieldRadio';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

describe('createFieldRadio', () => {
  it('initializes with null value and no error', () => {
    const radio = createFieldRadio(options);
    const state = radio.getState();
    expect(state.value).toBeNull();
    expect(state.valid).toBe(true);
    expect(state.error).toBeNull();
    expect(state.touched).toBe(false);
  });

  it('selects a valid option', () => {
    const radio = createFieldRadio(options);
    radio.select('a');
    expect(radio.getState().value).toBe('a');
    expect(radio.getState().touched).toBe(true);
  });

  it('does not select a disabled option', () => {
    const radio = createFieldRadio(options);
    radio.select('c');
    expect(radio.getState().value).toBeNull();
  });

  it('reports isSelected correctly', () => {
    const radio = createFieldRadio(options);
    radio.select('b');
    expect(radio.isSelected('b')).toBe(true);
    expect(radio.isSelected('a')).toBe(false);
  });

  it('clears the selected value', () => {
    const radio = createFieldRadio(options);
    radio.select('a');
    radio.clear();
    expect(radio.getState().value).toBeNull();
    expect(radio.getState().error).toBeNull();
  });

  it('marks field as touched on touch()', () => {
    const radio = createFieldRadio(options);
    radio.touch();
    expect(radio.getState().touched).toBe(true);
  });

  it('runs validator on select', () => {
    const radio = createFieldRadio(options, (val) =>
      val === null ? { valid: false, error: 'Required' } : { valid: true }
    );
    radio.validate();
    expect(radio.getState().valid).toBe(false);
    expect(radio.getState().error).toBe('Required');
    radio.select('a');
    expect(radio.getState().valid).toBe(true);
    expect(radio.getState().error).toBeNull();
  });

  it('returns option by value via getOption', () => {
    const radio = createFieldRadio(options);
    const opt = radio.getOption('b');
    expect(opt?.label).toBe('Option B');
  });

  it('returns undefined for unknown option', () => {
    const radio = createFieldRadio(options);
    expect(radio.getOption('z' as any)).toBeUndefined();
  });

  it('does not mutate internal state on getState', () => {
    const radio = createFieldRadio(options);
    const s1 = radio.getState();
    s1.value = 'a' as any;
    expect(radio.getState().value).toBeNull();
  });
});
