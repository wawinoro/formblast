import { createFieldProgress } from './fieldProgress';
import { FieldSchema } from './types';

interface Form {
  name: string;
  email: string;
  age: number | null;
  bio: string;
}

const schema: FieldSchema<Form>[] = [
  { field: 'name', rules: [] },
  { field: 'email', rules: [] },
  { field: 'age', rules: [] },
  { field: 'bio', rules: [] },
];

describe('createFieldProgress', () => {
  it('returns 0% when all fields are empty', () => {
    const progress = createFieldProgress({ schema });
    const state = progress.evaluate({});
    expect(state.percent).toBe(0);
    expect(state.completed).toBe(0);
    expect(state.isComplete).toBe(false);
  });

  it('returns 100% when all fields are filled', () => {
    const progress = createFieldProgress({ schema });
    const state = progress.evaluate({ name: 'Alice', email: 'a@b.com', age: 30, bio: 'Hello' });
    expect(state.percent).toBe(100);
    expect(state.isComplete).toBe(true);
    expect(state.remaining).toHaveLength(0);
  });

  it('returns partial progress', () => {
    const progress = createFieldProgress({ schema });
    const state = progress.evaluate({ name: 'Alice', email: 'a@b.com' });
    expect(state.completed).toBe(2);
    expect(state.total).toBe(4);
    expect(state.percent).toBe(50);
    expect(state.remaining).toEqual(['age', 'bio']);
  });

  it('respects required subset', () => {
    const progress = createFieldProgress({ schema, required: ['name', 'email'] });
    const state = progress.evaluate({ name: 'Alice', email: 'a@b.com' });
    expect(state.percent).toBe(100);
    expect(state.isComplete).toBe(true);
  });

  it('treats whitespace-only strings as empty', () => {
    const progress = createFieldProgress({ schema });
    const state = progress.evaluate({ name: '   ', email: 'a@b.com', age: 30, bio: 'Hi' });
    expect(state.completed).toBe(3);
    expect(state.remaining).toEqual(['name']);
  });

  it('getPercent helper returns correct value', () => {
    const progress = createFieldProgress({ schema });
    expect(progress.getPercent({ name: 'X', email: 'e@e.com', age: 1, bio: 'b' })).toBe(100);
    expect(progress.getPercent({})).toBe(0);
  });

  it('isComplete returns boolean', () => {
    const progress = createFieldProgress({ schema });
    expect(progress.isComplete({ name: 'X', email: 'e@e.com', age: 1, bio: 'b' })).toBe(true);
    expect(progress.isComplete({ name: 'X' })).toBe(false);
  });

  it('handles null values as empty', () => {
    const progress = createFieldProgress({ schema });
    const state = progress.evaluate({ name: 'Alice', email: 'a@b.com', age: null, bio: 'Hi' });
    expect(state.completed).toBe(3);
    expect(state.remaining).toEqual(['age']);
  });
});
