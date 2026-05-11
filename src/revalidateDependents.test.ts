import { revalidateDependents, revalidateAll } from './revalidateDependents';
import { createDependencyGraph } from './fieldDependencyGraph';
import { ValidationResult } from './types';

function makeValidateFn(failFields: string[] = []) {
  return (field: string, _values: Record<string, unknown>): ValidationResult => ({
    valid: !failFields.includes(field as string),
    errors: failFields.includes(field as string) ? [`${field} is invalid`] : [],
  });
}

describe('revalidateDependents', () => {
  it('revalidates direct dependents of changed field', () => {
    const graph = createDependencyGraph();
    graph.addDependency('city', 'country');
    const values = { country: 'US', city: 'NY' };
    const result = revalidateDependents({
      graph,
      values,
      changedField: 'country',
      validateFn: makeValidateFn(),
    });
    expect(result.revalidated).toContain('city');
    expect(result.results['city']?.valid).toBe(true);
  });

  it('revalidates transitive dependents', () => {
    const graph = createDependencyGraph();
    graph.addDependency('city', 'country');
    graph.addDependency('district', 'city');
    const values = { country: 'US', city: 'NY', district: 'Manhattan' };
    const result = revalidateDependents({
      graph,
      values,
      changedField: 'country',
      validateFn: makeValidateFn(),
    });
    expect(result.revalidated).toContain('city');
    expect(result.revalidated).toContain('district');
  });

  it('captures validation errors in results', () => {
    const graph = createDependencyGraph();
    graph.addDependency('city', 'country');
    const values = { country: 'XX', city: '' };
    const result = revalidateDependents({
      graph,
      values,
      changedField: 'country',
      validateFn: makeValidateFn(['city']),
    });
    expect(result.results['city']?.valid).toBe(false);
    expect(result.results['city']?.errors).toContain('city is invalid');
  });

  it('returns empty result when field has no dependents', () => {
    const graph = createDependencyGraph();
    const values = { email: 'a@b.com' };
    const result = revalidateDependents({
      graph,
      values,
      changedField: 'email',
      validateFn: makeValidateFn(),
    });
    expect(result.revalidated).toHaveLength(0);
  });

  it('does not visit same field twice', () => {
    const graph = createDependencyGraph();
    graph.addDependency('c', 'a');
    graph.addDependency('c', 'b');
    graph.addDependency('d', 'c');
    const calls: string[] = [];
    revalidateDependents({
      graph,
      values: { a: 1, b: 2, c: 3, d: 4 },
      changedField: 'a',
      validateFn: (field, _v) => { calls.push(field as string); return { valid: true, errors: [] }; },
    });
    const unique = new Set(calls);
    expect(unique.size).toBe(calls.length);
  });
});

describe('revalidateAll', () => {
  it('validates all provided fields', () => {
    const values = { name: 'Alice', age: 25 };
    const results = revalidateAll(['name', 'age'], values, makeValidateFn());
    expect(results['name']?.valid).toBe(true);
    expect(results['age']?.valid).toBe(true);
  });

  it('captures failures for specified fields', () => {
    const values = { name: '', age: -1 };
    const results = revalidateAll(['name', 'age'], values, makeValidateFn(['name']));
    expect(results['name']?.valid).toBe(false);
    expect(results['age']?.valid).toBe(true);
  });
});
