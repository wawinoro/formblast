import {
  applyTransforms,
  clamp,
  truncate,
  replace,
  titleCase,
  roundTo,
  applyFieldTransforms,
} from './transforms';
import { FieldSchema } from './types';

describe('applyTransforms', () => {
  it('applies transforms in order', () => {
    const result = applyTransforms('  hello world  ', [
      (v) => v.trim(),
      (v) => v.toUpperCase(),
    ]);
    expect(result).toBe('HELLO WORLD');
  });

  it('returns value unchanged with empty transforms', () => {
    expect(applyTransforms(42, [])).toBe(42);
  });
});

describe('clamp', () => {
  it('clamps value within range', () => {
    expect(clamp(0, 10)(15)).toBe(10);
    expect(clamp(0, 10)(-5)).toBe(0);
    expect(clamp(0, 10)(5)).toBe(5);
  });
});

describe('truncate', () => {
  it('truncates string to max length', () => {
    expect(truncate(5)('hello world')).toBe('hello');
  });

  it('returns string as-is if within limit', () => {
    expect(truncate(20)('hi')).toBe('hi');
  });
});

describe('replace', () => {
  it('replaces occurrences in string', () => {
    expect(replace(/o/g, '0')('foo bar')).toBe('f00 bar');
  });

  it('replaces literal string', () => {
    expect(replace('world', 'there')('hello world')).toBe('hello there');
  });
});

describe('titleCase', () => {
  it('converts string to title case', () => {
    expect(titleCase('hello world')).toBe('Hello World');
  });

  it('handles single word', () => {
    expect(titleCase('foo')).toBe('Foo');
  });
});

describe('roundTo', () => {
  it('rounds to specified decimals', () => {
    expect(roundTo(2)(3.14159)).toBe(3.14);
    expect(roundTo(0)(2.7)).toBe(3);
  });
});

describe('applyFieldTransforms', () => {
  it('applies schema transforms to a value', () => {
    type Form = { name: string };
    const schema: FieldSchema<Form, 'name'> = {
      transforms: [(v) => v.trim(), (v) => v.toUpperCase()],
    };
    expect(applyFieldTransforms(schema, '  alice  ')).toBe('ALICE');
  });

  it('returns value when no transforms defined', () => {
    type Form = { age: number };
    const schema: FieldSchema<Form, 'age'> = {};
    expect(applyFieldTransforms(schema, 25)).toBe(25);
  });
});
