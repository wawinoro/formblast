import { FieldSchema } from './types';

export interface AutocompleteOption<T = string> {
  label: string;
  value: T;
}

export interface FieldAutocompleteState<T = string> {
  query: string;
  options: AutocompleteOption<T>[];
  filtered: AutocompleteOption<T>[];
  selected: AutocompleteOption<T> | null;
  isOpen: boolean;
  error: string | null;
}

export interface FieldAutocomplete<T = string> {
  getState: () => FieldAutocompleteState<T>;
  setQuery: (q: string) => void;
  select: (option: AutocompleteOption<T>) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  validate: () => boolean;
}

export function createFieldAutocomplete<T = string>(
  initialOptions: AutocompleteOption<T>[],
  schema?: FieldSchema<T | null, Record<string, unknown>>
): FieldAutocomplete<T> {
  let state: FieldAutocompleteState<T> = {
    query: '',
    options: initialOptions,
    filtered: initialOptions,
    selected: null,
    isOpen: false,
    error: null,
  };

  function filterOptions(q: string): AutocompleteOption<T>[] {
    const lower = q.toLowerCase();
    return state.options.filter(o => o.label.toLowerCase().includes(lower));
  }

  return {
    getState: () => ({ ...state, filtered: [...state.filtered] }),

    setQuery(q: string) {
      state.query = q;
      state.filtered = filterOptions(q);
      state.isOpen = q.length > 0;
      state.selected = null;
      state.error = null;
    },

    select(option: AutocompleteOption<T>) {
      state.selected = option;
      state.query = option.label;
      state.isOpen = false;
      state.error = null;
    },

    clear() {
      state.query = '';
      state.filtered = state.options;
      state.selected = null;
      state.isOpen = false;
      state.error = null;
    },

    open() { state.isOpen = true; },
    close() { state.isOpen = false; },

    validate(): boolean {
      if (!schema) return true;
      const result = schema.validators?.every(v => {
        const r = v(state.selected?.value ?? null, {});
        if (r && !r.valid) { state.error = r.message ?? 'Invalid'; return false; }
        return true;
      }) ?? true;
      return result;
    },
  };
}
