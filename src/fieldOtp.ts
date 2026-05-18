import { FieldState } from './types';

export interface OtpOptions {
  length?: number;
  allowAlpha?: boolean;
  onComplete?: (value: string) => void;
}

export interface OtpState {
  slots: string[];
  activeIndex: number;
  filled: boolean;
  valid: boolean;
  error: string | null;
}

export interface FieldOtp {
  getState: () => OtpState;
  setValue: (index: number, char: string) => void;
  setSlots: (value: string) => void;
  clear: () => void;
  focus: (index: number) => void;
  backspace: (index: number) => void;
  validate: () => boolean;
  getValue: () => string;
}

export function createFieldOtp(options: OtpOptions = {}): FieldOtp {
  const length = options.length ?? 6;
  const allowAlpha = options.allowAlpha ?? false;

  let slots: string[] = Array(length).fill('');
  let activeIndex = 0;
  let error: string | null = null;

  function getValue(): string {
    return slots.join('');
  }

  function isFilled(): boolean {
    return slots.every((s) => s.length === 1);
  }

  function normalize(char: string): string {
    if (!allowAlpha) return /^\d$/.test(char) ? char : '';
    return /^[a-zA-Z0-9]$/.test(char) ? char.toUpperCase() : '';
  }

  function getState(): OtpState {
    const filled = isFilled();
    return {
      slots: [...slots],
      activeIndex,
      filled,
      valid: filled && error === null,
      error,
    };
  }

  function setValue(index: number, char: string): void {
    if (index < 0 || index >= length) return;
    const normalized = normalize(char);
    slots[index] = normalized;
    if (normalized && index < length - 1) activeIndex = index + 1;
    if (isFilled() && options.onComplete) options.onComplete(getValue());
  }

  function setSlots(value: string): void {
    const chars = value.slice(0, length).split('');
    slots = Array(length).fill('').map((_, i) => normalize(chars[i] ?? ''));
    activeIndex = Math.min(slots.filter(Boolean).length, length - 1);
    if (isFilled() && options.onComplete) options.onComplete(getValue());
  }

  function clear(): void {
    slots = Array(length).fill('');
    activeIndex = 0;
    error = null;
  }

  function focus(index: number): void {
    if (index >= 0 && index < length) activeIndex = index;
  }

  function backspace(index: number): void {
    if (index < 0 || index >= length) return;
    if (slots[index]) {
      slots[index] = '';
    } else if (index > 0) {
      slots[index - 1] = '';
      activeIndex = index - 1;
    }
  }

  function validate(): boolean {
    if (!isFilled()) {
      error = `Please enter all ${length} digits`;
      return false;
    }
    error = null;
    return true;
  }

  return { getState, setValue, setSlots, clear, focus, backspace, validate, getValue };
}
