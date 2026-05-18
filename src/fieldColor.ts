import { ValidationResult } from './types';

export interface FieldColorOptions {
  allowAlpha?: boolean;
  allowNamed?: boolean;
  defaultValue?: string;
}

export interface FieldColorState {
  value: string;
  hex: string;
  isValid: boolean;
  error: string | null;
  touched: boolean;
}

const HEX_RE = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const NAMED_COLORS = new Set([
  'red', 'green', 'blue', 'white', 'black', 'yellow', 'orange',
  'purple', 'pink', 'gray', 'grey', 'cyan', 'magenta', 'transparent',
]);

export function normalizeHex(value: string): string {
  const v = value.trim();
  if (v.startsWith('#') && (v.length === 4 || v.length === 5)) {
    const chars = v.slice(1).split('');
    return '#' + chars.map(c => c + c).join('');
  }
  return v;
}

export function createFieldColor(options: FieldColorOptions = {}) {
  const { allowAlpha = false, allowNamed = false, defaultValue = '' } = options;

  let state: FieldColorState = {
    value: defaultValue,
    hex: defaultValue,
    isValid: false,
    error: null,
    touched: false,
  };

  function validate(value: string): ValidationResult {
    const v = value.trim();

    if (!v) return { valid: false, error: 'Color is required' };

    if (HEX_RE.test(v)) {
      const hasAlpha = v.length === 5 || v.length === 9;
      if (hasAlpha && !allowAlpha) {
        return { valid: false, error: 'Alpha channel not allowed' };
      }
      return { valid: true, error: null };
    }

    if (allowNamed && NAMED_COLORS.has(v.toLowerCase())) {
      return { valid: true, error: null };
    }

    return { valid: false, error: 'Invalid color format' };
  }

  function setValue(value: string): FieldColorState {
    const normalized = normalizeHex(value.trim());
    const result = validate(normalized);
    state = {
      value,
      hex: result.valid ? normalized : state.hex,
      isValid: result.valid,
      error: result.error,
      touched: state.touched,
    };
    return state;
  }

  function touch(): FieldColorState {
    state = { ...state, touched: true };
    return state;
  }

  function reset(): FieldColorState {
    state = { value: defaultValue, hex: defaultValue, isValid: false, error: null, touched: false };
    return state;
  }

  function getState(): FieldColorState {
    return state;
  }

  return { setValue, validate, touch, reset, getState };
}
