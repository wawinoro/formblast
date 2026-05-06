import { FormSchema } from './types';

export type MaskPattern = string;
export type MaskChar = { [key: string]: RegExp };

export interface MaskOptions {
  pattern: MaskPattern;
  chars?: MaskChar;
  placeholder?: string;
}

const DEFAULT_CHARS: MaskChar = {
  '9': /[0-9]/,
  'a': /[a-zA-Z]/,
  '*': /[a-zA-Z0-9]/,
};

export function applyMask(value: string, options: MaskOptions): string {
  const { pattern, chars = DEFAULT_CHARS, placeholder = '_' } = options;
  let result = '';
  let valueIndex = 0;

  for (let i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i];
    const maskRegex = chars[patternChar];

    if (maskRegex) {
      if (valueIndex < value.length) {
        const rawChar = value[valueIndex];
        if (maskRegex.test(rawChar)) {
          result += rawChar;
        } else {
          result += placeholder;
        }
        valueIndex++;
      } else {
        result += placeholder;
      }
    } else {
      result += patternChar;
      if (value[valueIndex] === patternChar) {
        valueIndex++;
      }
    }
  }

  return result;
}

export function stripMask(value: string, options: MaskOptions): string {
  const { pattern, chars = DEFAULT_CHARS } = options;
  let result = '';

  for (let i = 0; i < Math.min(value.length, pattern.length); i++) {
    const patternChar = pattern[i];
    const maskRegex = chars[patternChar];
    if (maskRegex && maskRegex.test(value[i])) {
      result += value[i];
    }
  }

  return result;
}

export function createMaskedField<T extends Record<string, unknown>>(
  field: keyof T,
  options: MaskOptions
): (schema: FormSchema<T>) => FormSchema<T> {
  return (schema: FormSchema<T>): FormSchema<T> => ({
    ...schema,
    [field]: {
      ...(schema[field] as object),
      mask: options,
    },
  });
}
