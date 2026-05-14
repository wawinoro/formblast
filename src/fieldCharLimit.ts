import { FieldSchema } from './types';

export interface CharLimitState {
  value: string;
  max: number;
  current: number;
  remaining: number;
  exceeded: boolean;
  percentage: number;
}

export interface CharLimitOptions {
  max: number;
  warnAt?: number;
  countMode?: 'chars' | 'bytes';
}

function countBytes(str: string): number {
  return new TextEncoder().encode(str).length;
}

export function createCharLimit(options: CharLimitOptions) {
  const { max, warnAt, countMode = 'chars' } = options;

  function getCount(value: string): number {
    return countMode === 'bytes' ? countBytes(value) : value.length;
  }

  function getState(value: string): CharLimitState {
    const current = getCount(value);
    const remaining = max - current;
    const exceeded = current > max;
    const percentage = Math.min(100, Math.round((current / max) * 100));
    return { value, max, current, remaining, exceeded, percentage };
  }

  function isWarning(value: string): boolean {
    if (warnAt === undefined) return false;
    const current = getCount(value);
    return current >= warnAt && current <= max;
  }

  function enforce(value: string): string {
    if (countMode === 'chars') {
      return value.length > max ? value.slice(0, max) : value;
    }
    // For bytes, trim until within limit
    let result = value;
    while (countBytes(result) > max && result.length > 0) {
      result = result.slice(0, -1);
    }
    return result;
  }

  function toValidator<T extends Record<string, unknown>>(
    message?: string
  ): FieldSchema<T>['validators'] {
    return [
      (value: unknown) => {
        if (typeof value !== 'string') return undefined;
        const count = getCount(value);
        if (count > max) {
          return message ?? `Must be ${max} ${countMode === 'bytes' ? 'bytes' : 'characters'} or fewer (currently ${count})`;
        }
        return undefined;
      },
    ];
  }

  return { getState, isWarning, enforce, toValidator };
}
