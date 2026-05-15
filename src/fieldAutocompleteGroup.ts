import { createFieldAutocomplete, AutocompleteOption, FieldAutocomplete } from './fieldAutocomplete';

export interface AutocompleteGroupState {
  fields: Record<string, ReturnType<FieldAutocomplete<unknown>['getState']>>;
  errors: Record<string, string | null>;
  isValid: boolean;
}

export interface FieldAutocompleteGroup {
  getState: () => AutocompleteGroupState;
  getField: <T>(name: string) => FieldAutocomplete<T> | undefined;
  register: <T>(name: string, options: AutocompleteOption<T>[]) => FieldAutocomplete<T>;
  unregister: (name: string) => void;
  validateAll: () => boolean;
  resetAll: () => void;
}

export function createFieldAutocompleteGroup(): FieldAutocompleteGroup {
  const registry = new Map<string, FieldAutocomplete<unknown>>();

  return {
    getState(): AutocompleteGroupState {
      const fields: AutocompleteGroupState['fields'] = {};
      const errors: AutocompleteGroupState['errors'] = {};
      let isValid = true;
      for (const [name, ac] of registry) {
        const s = ac.getState();
        fields[name] = s;
        errors[name] = s.error;
        if (s.error) isValid = false;
      }
      return { fields, errors, isValid };
    },

    getField<T>(name: string): FieldAutocomplete<T> | undefined {
      return registry.get(name) as FieldAutocomplete<T> | undefined;
    },

    register<T>(name: string, options: AutocompleteOption<T>[]): FieldAutocomplete<T> {
      const ac = createFieldAutocomplete<T>(options);
      registry.set(name, ac as unknown as FieldAutocomplete<unknown>);
      return ac;
    },

    unregister(name: string) {
      registry.delete(name);
    },

    validateAll(): boolean {
      let allValid = true;
      for (const ac of registry.values()) {
        if (!ac.validate()) allValid = false;
      }
      return allValid;
    },

    resetAll() {
      for (const ac of registry.values()) {
        ac.clear();
      }
    },
  };
}
