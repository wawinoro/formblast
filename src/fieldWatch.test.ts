import { watchField, watchFields } from './fieldWatch';
import { FieldSchema, ValidationResult } from './types';

const mockValidate = (
  _schema: FieldSchema<string>,
  value: string
): ValidationResult => ({
  valid: value.length >= 3,
  errors: value.length < 3 ? ['Too short'] : [],
});

describe('watchField', () => {
  const schema = {} as FieldSchema<string>;

  it('returns initial value and result on creation', () => {
    const watcher = watchField(schema, 'hi', mockValidate);
    expect(watcher.value).toBe('hi');
    expect(watcher.getResult().valid).toBe(false);
  });

  it('calls subscriber immediately with current state', () => {
    const watcher = watchField(schema, 'hello', mockValidate);
    const cb = jest.fn();
    watcher.subscribe(cb);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('hello', { valid: true, errors: [] });
  });

  it('notifies subscriber on update', () => {
    const watcher = watchField(schema, 'hi', mockValidate);
    const cb = jest.fn();
    watcher.subscribe(cb);
    watcher.update('hello');
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenLastCalledWith('hello', { valid: true, errors: [] });
  });

  it('unsubscribe stops notifications', () => {
    const watcher = watchField(schema, 'hi', mockValidate);
    const cb = jest.fn();
    const unsub = watcher.subscribe(cb);
    unsub();
    watcher.update('hello');
    expect(cb).toHaveBeenCalledTimes(1); // only the immediate call
  });

  it('destroy removes all subscribers', () => {
    const watcher = watchField(schema, 'hi', mockValidate);
    const cb = jest.fn();
    watcher.subscribe(cb);
    watcher.destroy();
    watcher.update('hello');
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('reflects updated value after update', () => {
    const watcher = watchField(schema, 'hi', mockValidate);
    watcher.update('world');
    expect(watcher.value).toBe('world');
    expect(watcher.getResult().valid).toBe(true);
  });
});

describe('watchFields', () => {
  const schema = {} as FieldSchema<string>;

  it('fires onChange for each field update', () => {
    const w1 = watchField(schema, 'ab', mockValidate);
    const w2 = watchField(schema, 'xyz', mockValidate);
    const onChange = jest.fn();

    const unsub = watchFields({ name: w1, city: w2 }, onChange);

    w1.update('abc');
    expect(onChange).toHaveBeenCalledWith('name', 'abc', { valid: true, errors: [] });

    w2.update('no');
    expect(onChange).toHaveBeenCalledWith('city', 'no', { valid: false, errors: ['Too short'] });

    unsub();
    w1.update('xyz');
    // onChange should not be called again after unsub
    expect(onChange).toHaveBeenCalledTimes(4); // 2 immediate + 2 updates
  });
});
