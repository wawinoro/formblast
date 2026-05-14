/**
 * fieldToggle — manage a boolean toggle field with optional validation rules.
 */

export interface FieldToggleState {
  value: boolean;
  disabled: boolean;
  error: string | null;
  touched: boolean;
}

export interface FieldToggleOptions {
  initial?: boolean;
  disabled?: boolean;
  requiredTrue?: boolean;
  requiredTrueMessage?: string;
}

export interface FieldToggle {
  getState: () => FieldToggleState;
  toggle: () => void;
  setValue: (value: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  touch: () => void;
  validate: () => boolean;
  reset: () => void;
}

export function createFieldToggle(options: FieldToggleOptions = {}): FieldToggle {
  const {
    initial = false,
    disabled = false,
    requiredTrue = false,
    requiredTrueMessage = 'This field must be checked.',
  } = options;

  let state: FieldToggleState = {
    value: initial,
    disabled,
    error: null,
    touched: false,
  };

  function validate(): boolean {
    if (requiredTrue && !state.value) {
      state = { ...state, error: requiredTrueMessage };
      return false;
    }
    state = { ...state, error: null };
    return true;
  }

  return {
    getState: () => ({ ...state }),

    toggle() {
      if (state.disabled) return;
      state = { ...state, value: !state.value, touched: true };
      validate();
    },

    setValue(value: boolean) {
      if (state.disabled) return;
      state = { ...state, value, touched: true };
      validate();
    },

    setDisabled(value: boolean) {
      state = { ...state, disabled: value };
    },

    touch() {
      state = { ...state, touched: true };
      validate();
    },

    validate,

    reset() {
      state = { value: initial, disabled, error: null, touched: false };
    },
  };
}
