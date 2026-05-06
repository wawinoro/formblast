import { createFieldArray, validateFieldArray } from './fieldArray';
import { minLength, maxLength } from './validators';

interface Person {
  name: string;
  email: string;
  [key: string]: unknown;
}

const personSchema = {
  name: [minLength(2), maxLength(50)],
  email: [minLength(5), maxLength(100)],
};

describe('createFieldArray', () => {
  it('should add items to the array', () => {
    const fa = createFieldArray<Person>(personSchema);
    fa.add({ name: 'Alice', email: 'alice@example.com' });
    expect(fa.state.items).toHaveLength(1);
    expect(fa.state.items[0].name).toBe('Alice');
  });

  it('should remove items and re-index errors', () => {
    const fa = createFieldArray<Person>(personSchema);
    fa.add({ name: 'A', email: 'a@b.c' });
    fa.add({ name: 'Bob', email: 'bob@example.com' });
    fa.add({ name: 'C', email: 'c@d.e' });
    fa.validate();
    fa.remove(1);
    expect(fa.state.items).toHaveLength(2);
    expect(fa.state.items[0].name).toBe('A');
    expect(fa.state.items[1].name).toBe('C');
  });

  it('should update an item at a given index', () => {
    const fa = createFieldArray<Person>(personSchema);
    fa.add({ name: 'Alice', email: 'alice@example.com' });
    fa.update(0, { name: 'Alicia', email: 'alicia@example.com' });
    expect(fa.state.items[0].name).toBe('Alicia');
  });

  it('should validate all items and return true when all valid', () => {
    const fa = createFieldArray<Person>(personSchema);
    fa.add({ name: 'Alice', email: 'alice@example.com' });
    fa.add({ name: 'Bob', email: 'bob@example.com' });
    const valid = fa.validate();
    expect(valid).toBe(true);
    expect(Object.keys(fa.state.errors)).toHaveLength(0);
  });

  it('should collect errors for invalid items', () => {
    const fa = createFieldArray<Person>(personSchema);
    fa.add({ name: 'A', email: 'alice@example.com' }); // name too short
    fa.add({ name: 'Bob', email: 'bob@example.com' });
    const valid = fa.validate();
    expect(valid).toBe(false);
    expect(fa.getErrors(0)).toBeDefined();
    expect(fa.getErrors(1)).toBeUndefined();
  });

  it('should reset state', () => {
    const fa = createFieldArray<Person>(personSchema);
    fa.add({ name: 'Alice', email: 'alice@example.com' });
    fa.reset();
    expect(fa.state.items).toHaveLength(0);
    expect(Object.keys(fa.state.errors)).toHaveLength(0);
  });
});

describe('validateFieldArray', () => {
  it('should return valid true when all items pass', () => {
    const items: Person[] = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ];
    const result = validateFieldArray(personSchema, items);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return errors for invalid items', () => {
    const items: Person[] = [
      { name: 'A', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ];
    const result = validateFieldArray(personSchema, items);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toBeDefined();
    expect(result.errors[1]).toBeUndefined();
  });

  it('should handle empty arrays', () => {
    const result = validateFieldArray(personSchema, []);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
