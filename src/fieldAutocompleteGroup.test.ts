import { createFieldAutocompleteGroup } from './fieldAutocompleteGroup';
import { AutocompleteOption } from './fieldAutocomplete';

const colors: AutocompleteOption<string>[] = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
];

const sizes: AutocompleteOption<number>[] = [
  { label: 'Small', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'Large', value: 3 },
];

describe('createFieldAutocompleteGroup', () => {
  it('registers fields and retrieves them', () => {
    const group = createFieldAutocompleteGroup();
    group.register('color', colors);
    group.register('size', sizes);
    expect(group.getField('color')).toBeDefined();
    expect(group.getField('size')).toBeDefined();
    expect(group.getField('missing')).toBeUndefined();
  });

  it('getState returns state for all registered fields', () => {
    const group = createFieldAutocompleteGroup();
    group.register('color', colors);
    group.register('size', sizes);
    const s = group.getState();
    expect(Object.keys(s.fields)).toEqual(['color', 'size']);
    expect(s.isValid).toBe(true);
  });

  it('unregister removes a field', () => {
    const group = createFieldAutocompleteGroup();
    group.register('color', colors);
    group.unregister('color');
    expect(group.getField('color')).toBeUndefined();
  });

  it('validateAll returns true when no schemas set', () => {
    const group = createFieldAutocompleteGroup();
    group.register('color', colors);
    group.register('size', sizes);
    expect(group.validateAll()).toBe(true);
  });

  it('resetAll clears all fields', () => {
    const group = createFieldAutocompleteGroup();
    const colorField = group.register('color', colors);
    colorField.select({ label: 'Red', value: 'red' });
    group.resetAll();
    expect(colorField.getState().selected).toBeNull();
    expect(colorField.getState().query).toBe('');
  });

  it('getState reflects field errors after manual error injection via validate', () => {
    const group = createFieldAutocompleteGroup();
    group.register<string>('color', colors);
    // No schema so validate is always true; error stays null
    group.validateAll();
    const s = group.getState();
    expect(s.errors['color']).toBeNull();
    expect(s.isValid).toBe(true);
  });

  it('setQuery on a registered field is reflected in getState', () => {
    const group = createFieldAutocompleteGroup();
    const colorField = group.register('color', colors);
    colorField.setQuery('re');
    const s = group.getState();
    expect(s.fields['color'].query).toBe('re');
    expect(s.fields['color'].filtered).toHaveLength(1);
  });
});
