import {
  sanitizeValue,
  stripHtml,
  collapseWhitespace,
  removeControlChars,
  truncate,
  withSanitizers,
} from './sanitize';

describe('sanitizeValue', () => {
  it('applies sanitizers in order', () => {
    const result = sanitizeValue('  hello  ', {
      sanitizers: [collapseWhitespace, (v) => v.toUpperCase()],
    });
    expect(result).toBe('HELLO');
  });

  it('stops on null when stopOnNull is true', () => {
    const spy = jest.fn((v: string) => v);
    sanitizeValue(null as unknown as string, { sanitizers: [spy], stopOnNull: true });
    expect(spy).not.toHaveBeenCalled();
  });

  it('continues on null when stopOnNull is false', () => {
    const spy = jest.fn((v: string) => v);
    sanitizeValue(null as unknown as string, { sanitizers: [spy], stopOnNull: false });
    expect(spy).toHaveBeenCalled();
  });
});

describe('stripHtml', () => {
  it('removes html tags', () => {
    expect(stripHtml('<b>bold</b> text')).toBe('bold text');
  });

  it('handles nested tags', () => {
    expect(stripHtml('<div><span>hello</span></div>')).toBe('hello');
  });

  it('returns plain string unchanged', () => {
    expect(stripHtml('no tags here')).toBe('no tags here');
  });
});

describe('collapseWhitespace', () => {
  it('collapses multiple spaces', () => {
    expect(collapseWhitespace('hello   world')).toBe('hello world');
  });

  it('trims leading and trailing whitespace', () => {
    expect(collapseWhitespace('  hello  ')).toBe('hello');
  });
});

describe('removeControlChars', () => {
  it('removes control characters', () => {
    expect(removeControlChars('hello\x00world\x1F')).toBe('helloworld');
  });

  it('leaves normal text intact', () => {
    expect(removeControlChars('normal text')).toBe('normal text');
  });
});

describe('truncate', () => {
  it('truncates string to max length', () => {
    expect(truncate(5)('hello world')).toBe('hello');
  });

  it('returns string unchanged if shorter than max', () => {
    expect(truncate(20)('hi')).toBe('hi');
  });
});

describe('withSanitizers', () => {
  it('applies sanitizers before transform', () => {
    const schema = withSanitizers(
      { field: 'name', rules: [] },
      [stripHtml, collapseWhitespace]
    );
    const result = schema.transform?.('<b>  John  </b>', {} as never);
    expect(result).toBe('John');
  });

  it('works without an existing transform', () => {
    const schema = withSanitizers({ field: 'bio', rules: [] }, [stripHtml]);
    const result = schema.transform?.('<p>bio</p>', {} as never);
    expect(result).toBe('bio');
  });
});
