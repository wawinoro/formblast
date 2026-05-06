import {
  createDependencyMap,
  validateDependents,
  getDependents,
  hasDependents,
} from './dependentFields';
import { FieldSchema } from './types';

type TestForm = {
  password: string;
  confirmPassword: string;
  minAge: number;
  age: number;
};

const passwordMatchValidator = (value: string, all: TestForm) => ({
  valid: value === all.password,
  message: value === all.password ? undefined : 'Passwords do not match',
});

const ageValidator = (value: number, all: TestForm) => ({
  valid: value >= all.minAge,
  message: value >= all.minAge ? undefined : `Age must be at least ${all.minAge}`,
});

const schemas: { [K in keyof TestForm]?: FieldSchema<TestForm[K], TestForm> } = {
  confirmPassword: {
    validators: [passwordMatchValidator as any],
  },
  age: {
    validators: [ageValidator as any],
  },
};

const depMap = createDependencyMap<TestForm>({
  password: ['confirmPassword'],
  minAge: ['age'],
});

describe('createDependencyMap', () => {
  it('returns a copy of the provided dependency map', () => {
    expect(depMap).toEqual({ password: ['confirmPassword'], minAge: ['age'] });
  });
});

describe('validateDependents', () => {
  it('validates dependent fields when source changes', () => {
    const values: TestForm = { password: 'abc', confirmPassword: 'abc', minAge: 18, age: 20 };
    const result = validateDependents('password', values, schemas, depMap);
    expect(result.confirmPassword?.valid).toBe(true);
    expect(result.confirmPassword?.errors).toHaveLength(0);
  });

  it('returns errors when dependent field is invalid', () => {
    const values: TestForm = { password: 'abc', confirmPassword: 'xyz', minAge: 18, age: 20 };
    const result = validateDependents('password', values, schemas, depMap);
    expect(result.confirmPassword?.valid).toBe(false);
    expect(result.confirmPassword?.errors).toContain('Passwords do not match');
  });

  it('returns empty result when field has no dependents', () => {
    const values: TestForm = { password: 'abc', confirmPassword: 'abc', minAge: 18, age: 20 };
    const result = validateDependents('age', values, schemas, depMap);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('validates numeric dependent field', () => {
    const values: TestForm = { password: '', confirmPassword: '', minAge: 21, age: 18 };
    const result = validateDependents('minAge', values, schemas, depMap);
    expect(result.age?.valid).toBe(false);
    expect(result.age?.errors[0]).toContain('21');
  });
});

describe('getDependents', () => {
  it('returns dependent field keys', () => {
    expect(getDependents('password', depMap)).toEqual(['confirmPassword']);
  });

  it('returns empty array for field with no dependents', () => {
    expect(getDependents('age', depMap)).toEqual([]);
  });
});

describe('hasDependents', () => {
  it('returns true when field has dependents', () => {
    expect(hasDependents('password', depMap)).toBe(true);
  });

  it('returns false when field has no dependents', () => {
    expect(hasDependents('confirmPassword', depMap)).toBe(false);
  });
});
