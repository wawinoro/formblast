import { createFieldComboGroup } from './fieldComboGroup';

const schema = {
  country: {
    options: [
      { label: 'USA', value: 'us' },
      { label: 'UK', value: 'uk' },
    ],
    required: true,
  },
  language: {
    options: [
      { label: 'English', value: 'en' },
      { label: 'French', value: 'fr' },
    ],
    required: false,
  },
};

describe('createFieldComboGroup', () => {
  it('creates a group with all fields', () => {
    const group = createFieldComboGroup(schema);
    const state = group.getState();
    expect(state.country).toBeDefined();
    expect(state.language).toBeDefined();
  });

  it('returns errors for required unset fields', () => {
    const group = createFieldComboGroup(schema);
    const errors = group.validateAll();
    expect(errors.country).toBeTruthy();
    expect(errors.language).toBeUndefined();
  });

  it('isValid returns false when required field missing', () => {
    const group = createFieldComboGroup(schema);
    expect(group.isValid()).toBe(false);
  });

  it('isValid returns true when all required fields set', () => {
    const group = createFieldComboGroup(schema);
    group.getField('country').select('us');
    expect(group.isValid()).toBe(true);
  });

  it('getField returns the correct combo instance', () => {
    const group = createFieldComboGroup(schema);
    const country = group.getField('country');
    country.select('uk');
    expect(group.getState().country.selected).toBe('uk');
  });

  it('resetAll clears all fields', () => {
    const group = createFieldComboGroup(schema);
    group.getField('country').select('us');
    group.getField('language').select('en');
    group.resetAll();
    const state = group.getState();
    expect(state.country.selected).toBeNull();
    expect(state.language.selected).toBeNull();
  });

  it('validates multiple fields with errors', () => {
    const strictSchema = {
      a: { options: [{ label: 'X', value: 'x' }], required: true },
      b: { options: [{ label: 'Y', value: 'y' }], required: true },
    };
    const group = createFieldComboGroup(strictSchema);
    const errors = group.validateAll();
    expect(Object.keys(errors)).toHaveLength(2);
  });
});
