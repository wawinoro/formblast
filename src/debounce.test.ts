import { debounceValidation, createDebounced } from './debounce';
import { FieldSchema } from './types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('debounceValidation', () => {
  const schema: FieldSchema<string> = {
    validators: [(v) => (v.length < 3 ? ['Too short'] : [])],
  };

  const validateFn = (value: string, s: FieldSchema<string>): string[] => {
    const errors: string[] = [];
    for (const validator of s.validators ?? []) {
      errors.push(...validator(value));
    }
    return errors;
  };

  it('should debounce and return errors after wait', async () => {
    const debounced = debounceValidation(schema, validateFn, { wait: 50 });
    const promise = debounced.validate('ab');
    await wait(60);
    const errors = await promise;
    expect(errors).toEqual(['Too short']);
  });

  it('should return no errors for valid value', async () => {
    const debounced = debounceValidation(schema, validateFn, { wait: 50 });
    const promise = debounced.validate('hello');
    await wait(60);
    const errors = await promise;
    expect(errors).toEqual([]);
  });

  it('should cancel pending validation', async () => {
    const debounced = debounceValidation(schema, validateFn, { wait: 100 });
    const promise = debounced.validate('ab');
    debounced.cancel();
    const errors = await promise;
    expect(errors).toEqual([]);
  });

  it('should flush immediately with last value', async () => {
    const debounced = debounceValidation(schema, validateFn, { wait: 200 });
    debounced.validate('x');
    const errors = await debounced.flush();
    expect(errors).toEqual(['Too short']);
  });

  it('flush returns null if no value has been set', () => {
    const debounced = debounceValidation(schema, validateFn, { wait: 200 });
    expect(debounced.flush()).toBeNull();
  });

  it('leading option fires immediately on first call', async () => {
    const debounced = debounceValidation(schema, validateFn, { wait: 200, leading: true });
    const errors = await debounced.validate('hi');
    expect(errors).toEqual(['Too short']);
  });
});

describe('createDebounced', () => {
  it('should debounce calls and return result', async () => {
    const fn = (v: string) => (v.length < 3 ? ['Short'] : []);
    const debounced = createDebounced(fn, 50);
    const promise = debounced('ab');
    await wait(60);
    const errors = await promise;
    expect(errors).toEqual(['Short']);
  });

  it('only runs the last call within the wait window', async () => {
    const calls: string[] = [];
    const fn = (v: string) => { calls.push(v); return []; };
    const debounced = createDebounced(fn, 50);
    debounced('a');
    debounced('b');
    const last = debounced('c');
    await wait(60);
    await last;
    expect(calls).toEqual(['c']);
  });
});
