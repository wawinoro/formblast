import { throttleValidation, createThrottled } from './throttle';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockValidator = (value: string): string[] =>
  value.length < 3 ? ['Too short'] : [];

describe('throttleValidation', () => {
  it('calls validator immediately on leading edge', async () => {
    const throttled = throttleValidation(mockValidator as any, { interval: 100, leading: true, trailing: false });
    const result = await throttled.validate('ab');
    expect(result).toEqual(['Too short']);
  });

  it('returns empty array when no prior result and trailing only', async () => {
    const throttled = throttleValidation(mockValidator as any, { interval: 200, leading: false, trailing: true });
    const promise = throttled.validate('ab');
    throttled.cancel();
    const result = await promise;
    expect(Array.isArray(result)).toBe(true);
  });

  it('throttles rapid calls and resolves trailing', async () => {
    const calls: string[] = [];
    const validator = (value: string): string[] => {
      calls.push(value);
      return [];
    };
    const throttled = throttleValidation(validator as any, { interval: 80, leading: true, trailing: true });

    throttled.validate('a');
    throttled.validate('ab');
    const last = throttled.validate('abc');

    await sleep(150);
    const result = await last;
    expect(result).toEqual([]);
    expect(calls.length).toBeGreaterThanOrEqual(1);
  });

  it('cancel clears pending trailing call', async () => {
    const calls: string[] = [];
    const validator = (value: string): string[] => {
      calls.push(value);
      return [];
    };
    const throttled = throttleValidation(validator as any, { interval: 200, leading: false, trailing: true });

    throttled.validate('hello');
    throttled.cancel();

    await sleep(250);
    expect(calls.length).toBe(0);
  });

  it('flush runs pending trailing validation immediately', async () => {
    const throttled = throttleValidation(mockValidator as any, { interval: 500, leading: false, trailing: true });
    throttled.validate('hi');
    const result = await throttled.flush();
    expect(result).toEqual(['Too short']);
  });

  it('flush returns null when nothing is pending', () => {
    const throttled = throttleValidation(mockValidator as any, { interval: 100 });
    const result = throttled.flush();
    expect(result).toBeNull();
  });
});

describe('createThrottled', () => {
  it('wraps a sync validator into a throttled async one', async () => {
    const throttled = createThrottled(mockValidator, 50);
    const result = await throttled('hello');
    expect(result).toEqual([]);
  });

  it('returns errors for invalid value', async () => {
    const throttled = createThrottled(mockValidator, 50);
    const result = await throttled('hi');
    expect(result).toEqual(['Too short']);
  });
});
