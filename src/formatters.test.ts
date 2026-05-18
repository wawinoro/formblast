import {
  trim,
  lowercase,
  uppercase,
  digitsOnly,
  normalizeEmail,
  truncate,
  collapseSpaces,
  applyFormatters,
} from './formatters';

describe('trim', () => {
  it('removes leading and trailing whitespace', () => {
    expect(trim('  hello  ')).toBe('hello');
  });

  it('returns unchanged string when no surrounding spaces', () => {
    expect(trim('hello')).toBe('hello');
  });
});

describe('lowercase', () => {
  it('converts string to lowercase', () => {
    expect(lowercase('HELLO World')).toBe('hello world');
  });
});

describe('uppercase', () => {
  it('converts string to uppercase', () => {
    expect(uppercase('hello world')).toBe('HELLO WORLD');
  });
});

describe('digitsOnly', () => {
  it('strips non-numeric characters', () => {
    expect(digitsOnly('abc123def456')).toBe('123456');
  });

  it('returns empty string when no digits present', () => {
    expect(digitsOnly('abc')).toBe('');
  });
});

describe('normalizeEmail', () => {
  it('trims and lowercases an email', () => {
    expect(normalizeEmail('  User@Example.COM  ')).toBe('user@example.com');
  });
});

describe('truncate', () => {
  it('truncates a string to the given max length', () => {
    expect(truncate(5)('hello world')).toBe('hello');
  });

  it('returns full string when shorter than max length', () => {
    expect(truncate(20)('hi')).toBe('hi');
  });

  it('returns empty string when max length is 0', () => {
    expect(truncate(0)('hello')).toBe('');
  });

  it('returns full string when max length equals string length', () => {
    expect(truncate(5)('hello')).toBe('hello');
  });
});

describe('collapseSpaces', () => {
  it('replaces multiple spaces with a single space', () => {
    expect(collapseSpaces('hello   world')).toBe('hello world');
  });

  it('handles tabs and newlines as spaces', () => {
    expect(collapseSpaces('hello\t\nworld')).toBe('hello world');
  });
});

describe('applyFormatters', () => {
  it('applies formatters in sequence', () => {
    const result = applyFormatters('  HELLO WORLD  ', [trim, lowercase]);
    expect(result).toBe('hello world');
  });

  it('returns original value when formatter list is empty', () => {
    expect(applyFormatters('hello', [])).toBe('hello');
  });
});
