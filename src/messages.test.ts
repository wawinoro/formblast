import {
  getMessage,
  configureMessages,
  resetMessages,
  defaultMessages,
} from './messages';

describe('getMessage', () => {
  afterEach(() => {
    resetMessages();
  });

  it('returns the default required message', () => {
    expect(getMessage('required')).toBe('This field is required.');
  });

  it('interpolates minLength param', () => {
    expect(getMessage('minLength', { min: 8 })).toBe(
      'Must be at least 8 characters long.'
    );
  });

  it('interpolates maxLength param', () => {
    expect(getMessage('maxLength', { max: 20 })).toBe(
      'Must be no more than 20 characters long.'
    );
  });

  it('interpolates rangeMin param', () => {
    expect(getMessage('rangeMin', { min: 0 })).toBe(
      'Must be greater than or equal to 0.'
    );
  });

  it('interpolates rangeMax param', () => {
    expect(getMessage('rangeMax', { max: 100 })).toBe(
      'Must be less than or equal to 100.'
    );
  });

  it('returns default pattern message', () => {
    expect(getMessage('pattern')).toBe('Invalid format.');
  });
});

describe('configureMessages', () => {
  afterEach(() => {
    resetMessages();
  });

  it('overrides a single message', () => {
    configureMessages({
      required: () => 'Pflichtfeld.',
    });
    expect(getMessage('required')).toBe('Pflichtfeld.');
  });

  it('does not affect other messages', () => {
    configureMessages({
      required: () => 'Pflichtfeld.',
    });
    expect(getMessage('pattern')).toBe('Invalid format.');
  });

  it('resets back to defaults after resetMessages', () => {
    configureMessages({ required: () => 'Pflichtfeld.' });
    resetMessages();
    expect(getMessage('required')).toBe('This field is required.');
  });

  it('supports param interpolation in custom override', () => {
    configureMessages({
      minLength: ({ min }) => `Minimum ${min} chars required.`,
    });
    expect(getMessage('minLength', { min: 5 })).toBe(
      'Minimum 5 chars required.'
    );
  });
});

describe('defaultMessages', () => {
  it('exports all expected keys', () => {
    const keys = Object.keys(defaultMessages);
    expect(keys).toEqual(
      expect.arrayContaining([
        'required',
        'minLength',
        'maxLength',
        'pattern',
        'rangeMin',
        'rangeMax',
        'custom',
      ])
    );
  });
});
