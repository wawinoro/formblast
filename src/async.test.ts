import { runAsyncValidators, validateFieldAsync, uniqueAsync } from './async';
import { FieldSchema } from './types';

const syncValidateFn = (value: string, schema: FieldSchema<string>): string[] => {
  const errors: string[] = [];
  for (const validator of schema.validators ?? []) {
    errors.push(...validator(value));
  }
  return errors;
};

describe('runAsyncValidators', () => {
  it('returns empty array when no validators provided', async () => {
    const errors = await runAsyncValidators('test', []);
    expect(errors).toEqual([]);
  });

  it('collects errors from multiple async validators', async () => {
    const v1 = async (_: string) => ['Error 1'];
    const v2 = async (_: string) => ['Error 2'];
    const errors = await runAsyncValidators('test', [v1, v2]);
    expect(errors).toEqual(['Error 1', 'Error 2']);
  });

  it('handles rejected promises gracefully', async () => {
    const v1 = async (_: string): Promise<string[]> => { throw new Error('fail'); };
    const errors = await runAsyncValidators('test', [v1]);
    expect(errors).toEqual(['Async validation failed']);
  });

  it('returns empty array for valid value', async () => {
    const v1 = async (_: string) => [];
    const errors = await runAsyncValidators('test', [v1]);
    expect(errors).toEqual([]);
  });
});

describe('validateFieldAsync', () => {
  it('returns sync errors without running async validators', async () => {
    const schema = {
      validators: [(_: string) => ['Sync error']],
      asyncValidators: [async (_: string) => ['Async error']],
    };
    const errors = await validateFieldAsync('x', schema, syncValidateFn);
    expect(errors).toEqual(['Sync error']);
  });

  it('runs async validators when sync passes', async () => {
    const schema = {
      validators: [],
      asyncValidators: [async (_: string) => ['Async error']],
    };
    const errors = await validateFieldAsync('valid', schema, syncValidateFn);
    expect(errors).toEqual(['Async error']);
  });

  it('returns empty errors when all validators pass', async () => {
    const schema = {
      validators: [],
      asyncValidators: [async (_: string) => []],
    };
    const errors = await validateFieldAsync('valid', schema, syncValidateFn);
    expect(errors).toEqual([]);
  });

  it('handles schema with no async validators', async () => {
    const schema = { validators: [] };
    const errors = await validateFieldAsync('valid', schema, syncValidateFn);
    expect(errors).toEqual([]);
  });
});

describe('uniqueAsync', () => {
  it('returns error if value already exists', async () => {
    const validator = uniqueAsync(async () => true);
    const errors = await validator('taken');
    expect(errors).toEqual(['Value already exists']);
  });

  it('returns no error if value is unique', async () => {
    const validator = uniqueAsync(async () => false);
    const errors = await validator('new-value');
    expect(errors).toEqual([]);
  });

  it('supports custom error message', async () => {
    const validator = uniqueAsync(async () => true, 'Username taken');
    const errors = await validator('bob');
    expect(errors).toEqual(['Username taken']);
  });
});
