import { runPipeline } from './pipeline';
import { Schema } from './types';
import { minLength, maxLength } from './validators';
import { truncate, titleCase } from './transforms';

type SignupForm = {
  username: string;
  bio: string;
};

const schema: Schema<SignupForm> = {
  username: {
    transforms: [(v) => v.trim(), titleCase],
    validators: [minLength(3), maxLength(20)],
  },
  bio: {
    transforms: [truncate(100)],
    validators: [],
  },
};

describe('runPipeline', () => {
  it('transforms data and validates successfully', () => {
    const result = runPipeline(
      { username: '  alice  ', bio: 'Loves coding.' },
      schema
    );
    expect(result.data.username).toBe('Alice');
    expect(result.data.bio).toBe('Loves coding.');
    expect(result.validation.valid).toBe(true);
    expect(result.validation.errors).toHaveLength(0);
  });

  it('returns errors when validation fails after transform', () => {
    const result = runPipeline({ username: 'ab', bio: '' }, schema);
    expect(result.validation.valid).toBe(false);
    expect(result.validation.errors.some((e) => e.field === 'username')).toBe(true);
  });

  it('truncates bio to max 100 chars', () => {
    const longBio = 'x'.repeat(200);
    const result = runPipeline({ username: 'Alice', bio: longBio }, schema);
    expect(result.data.bio.length).toBe(100);
    expect(result.validation.valid).toBe(true);
  });

  it('applies title case to username', () => {
    const result = runPipeline({ username: 'john doe', bio: 'hi' }, schema);
    expect(result.data.username).toBe('John Doe');
  });

  it('returns transformed data even when invalid', () => {
    const result = runPipeline({ username: '  x  ', bio: '' }, schema);
    expect(result.data.username).toBe('X');
    expect(result.validation.valid).toBe(false);
  });
});
