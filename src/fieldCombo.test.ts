import { createFieldCombo, ComboOption } from './fieldCombo';

const OPTIONS: ComboOption<string>[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Disabled', value: 'disabled', disabled: true },
];

describe('createFieldCombo', () => {
  it('initialises with empty selection', () => {
    const combo = createFieldCombo({ options: OPTIONS });
    const s = combo.getState();
    expect(s.selected).toBeNull();
    expect(s.query).toBe('');
    expect(s.isOpen).toBe(false);
  });

  it('filters options by query', () => {
    const combo = createFieldCombo({ options: OPTIONS });
    combo.setQuery('an');
    const filtered = combo.getFiltered();
    expect(filtered.map((o) => o.value)).toEqual(['banana']);
  });

  it('excludes disabled options from filtered results', () => {
    const combo = createFieldCombo({ options: OPTIONS });
    combo.setQuery('dis');
    expect(combo.getFiltered()).toHaveLength(0);
  });

  it('selects a value and closes dropdown', () => {
    const combo = createFieldCombo({ options: OPTIONS });
    combo.select('apple');
    const s = combo.getState();
    expect(s.selected).toBe('apple');
    expect(s.query).toBe('Apple');
    expect(s.isOpen).toBe(false);
  });

  it('clears selection when query is set to empty string', () => {
    const combo = createFieldCombo({ options: OPTIONS });
    combo.select('banana');
    combo.setQuery('');
    expect(combo.getState().selected).toBeNull();
  });

  it('opens dropdown on setQuery', () => {
    const combo = createFieldCombo({ options: OPTIONS });
    combo.setQuery('c');
    expect(combo.getState().isOpen).toBe(true);
  });

  it('validates required field', () => {
    const combo = createFieldCombo({ options: OPTIONS, required: true });
    const result = combo.validate();
    expect(result.valid).toBe(false);
    expect(combo.getState().error).toBeTruthy();
  });

  it('passes required validation when value is selected', () => {
    const combo = createFieldCombo({ options: OPTIONS, required: true });
    combo.select('cherry');
    const result = combo.validate();
    expect(result.valid).toBe(true);
    expect(combo.getState().error).toBeNull();
  });

  it('runs custom validate function', () => {
    const combo = createFieldCombo({
      options: OPTIONS,
      validate: (v) => (v === 'banana' ? { valid: false, error: 'No bananas' } : { valid: true }),
    });
    combo.select('banana');
    const result = combo.validate();
    expect(result.valid).toBe(false);
    expect(result.error).toBe('No bananas');
  });

  it('resets to initial state', () => {
    const combo = createFieldCombo({ options: OPTIONS });
    combo.select('apple');
    combo.reset();
    const s = combo.getState();
    expect(s.selected).toBeNull();
    expect(s.query).toBe('');
    expect(s.error).toBeNull();
  });

  it('open and close control isOpen', () => {
    const combo = createFieldCombo({ options: OPTIONS });
    combo.open();
    expect(combo.getState().isOpen).toBe(true);
    combo.close();
    expect(combo.getState().isOpen).toBe(false);
  });
});
