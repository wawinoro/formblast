export interface DatePickerOptions<T> {
  validate?: (date: Date | null, ctx: T) => string | null;
  min?: Date;
  max?: Date;
  disabledDates?: Date[];
  required?: boolean;
}

export interface DatePickerState {
  value: Date | null;
  displayValue: string;
  error: string | null;
  touched: boolean;
  open: boolean;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function createFieldDatePicker<T = unknown>(options: DatePickerOptions<T> = {}) {
  let state: DatePickerState = {
    value: null,
    displayValue: "",
    error: null,
    touched: false,
    open: false,
  };

  function runValidation(date: Date | null, ctx: T): string | null {
    if (options.required && !date) return "Date is required.";
    if (date) {
      if (options.min && date < options.min) return `Date must be on or after ${formatDate(options.min)}.`;
      if (options.max && date > options.max) return `Date must be on or before ${formatDate(options.max)}.`;
      if (options.disabledDates?.some((d) => sameDay(d, date))) return "This date is not available.";
    }
    if (options.validate) return options.validate(date, ctx);
    return null;
  }

  return {
    getState(): DatePickerState {
      return { ...state };
    },
    setValue(date: Date | null, ctx: T): DatePickerState {
      state = {
        ...state,
        value: date,
        displayValue: formatDate(date),
        error: runValidation(date, ctx),
        touched: true,
      };
      return { ...state };
    },
    touch(): DatePickerState {
      state = { ...state, touched: true };
      return { ...state };
    },
    open(): DatePickerState {
      state = { ...state, open: true };
      return { ...state };
    },
    close(): DatePickerState {
      state = { ...state, open: false };
      return { ...state };
    },
    clear(ctx: T): DatePickerState {
      return this.setValue(null, ctx);
    },
    validate(ctx: T): DatePickerState {
      state = { ...state, error: runValidation(state.value, ctx), touched: true };
      return { ...state };
    },
    isValid(): boolean {
      return state.error === null && (!options.required || state.value !== null);
    },
  };
}
