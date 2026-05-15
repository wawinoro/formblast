import { createFieldAutocomplete, AutocompleteOption } from './fieldAutocomplete';

const fruits: AutocompleteOption<string>[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Apricot', value: 'apricot' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('createFieldAutocomplete', () => {
  it('initialises with all options and no selection', () => {
    const ac = createFieldAutocomplete(fruits);
    const s = ac.getState();
    expect(s.filtered).toHaveLength(4);
    expect(s.selected).toBeNull();
    expect(s.isOpen).toBe(false);
  });

  it('filters options by query (case-insensitive)', () => {
    const ac = createFieldAutocomplete(fruits);
    ac.setQuery('ap');
    const s = ac.getState();
    expect(s.filtered).toHaveLength(2);
    expect(s.filtered.map(o => o.value)).toEqual(['apple', 'apricot']);
    expect(s.isOpen).toBe(true);
  });

  it('shows no results for unmatched query', () => {
    const ac = createFieldAutocomplete(fruits);
    ac.setQuery('xyz');
    expect(ac.getState().filtered).toHaveLength(0);
  });

  it('selects an option and closes dropdown', () => {
    const ac = createFieldAutocomplete(fruits);
    ac.setQuery('ban');
    ac.select({ label: 'Banana', value: 'banana' });
    const s = ac.getState();
    expect(s.selected?.value).toBe('banana');
    expect(s.query).toBe('Banana');
    expect(s.isOpen).toBe(false);
  });

  it('clears state', () => {
    const ac = createFieldAutocomplete(fruits);
    ac.setQuery('ban');
    ac.select({ label: 'Banana', value: 'banana' });
    ac.clear();
    const s = ac.getState();
    expect(s.selected).toBeNull();
    expect(s.query).toBe('');
    expect(s.filtered).toHaveLength(4);
  });

  it('open/close toggle isOpen', () => {
    const ac = createFieldAutocomplete(fruits);
    ac.open();
    expect(ac.getState().isOpen).toBe(true);
    ac.close();
    expect(ac.getState().isOpen).toBe(false);
  });

  it('validate returns true when no schema provided', () => {
    const ac = createFieldAutocomplete(fruits);
    expect(ac.validate()).toBe(true);
  });

  it('validate returns false and sets error when validator fails', () => {
    const ac = createFieldAutocomplete<string>(fruits, {
      validators: [
        (val: string | null) =>
          val === null ? { valid: false, message: 'Required' } : { valid: true },
      ],
    });
    expect(ac.validate()).toBe(false);
    expect(ac.getState().error).toBe('Required');
  });

  it('validate returns true when selected value passes validator', () => {
    const ac = createFieldAutocomplete<string>(fruits, {
      validators: [
        (val: string | null) =>
          val === null ? { valid: false, message: 'Required' } : { valid: true },
      ],
    });
    ac.select({ label: 'Apple', value: 'apple' });
    expect(ac.validate()).toBe(true);
    expect(ac.getState().error).toBeNull();
  });
});
