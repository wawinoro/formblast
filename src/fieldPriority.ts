export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface PriorityRule<T> {
  level: PriorityLevel;
  condition: (value: T) => boolean;
  message: string;
}

export interface FieldPriorityState<T> {
  value: T;
  level: PriorityLevel | null;
  message: string | null;
  rules: PriorityRule<T>[];
}

const PRIORITY_ORDER: PriorityLevel[] = ['low', 'medium', 'high', 'critical'];

export function createFieldPriority<T>(initialValue: T): {
  getState: () => FieldPriorityState<T>;
  addRule: (rule: PriorityRule<T>) => void;
  removeRule: (level: PriorityLevel) => void;
  setValue: (value: T) => FieldPriorityState<T>;
  evaluate: () => FieldPriorityState<T>;
  getLevel: () => PriorityLevel | null;
  reset: () => void;
} {
  let state: FieldPriorityState<T> = {
    value: initialValue,
    level: null,
    message: null,
    rules: [],
  };

  function evaluate(): FieldPriorityState<T> {
    let topLevel: PriorityLevel | null = null;
    let topMessage: string | null = null;

    for (const rule of state.rules) {
      if (rule.condition(state.value)) {
        const current = topLevel ? PRIORITY_ORDER.indexOf(topLevel) : -1;
        const candidate = PRIORITY_ORDER.indexOf(rule.level);
        if (candidate > current) {
          topLevel = rule.level;
          topMessage = rule.message;
        }
      }
    }

    state = { ...state, level: topLevel, message: topMessage };
    return state;
  }

  return {
    getState: () => ({ ...state }),
    addRule(rule) {
      state = { ...state, rules: [...state.rules, rule] };
    },
    removeRule(level) {
      state = { ...state, rules: state.rules.filter((r) => r.level !== level) };
    },
    setValue(value) {
      state = { ...state, value };
      return evaluate();
    },
    evaluate,
    getLevel: () => state.level,
    reset() {
      state = { ...state, value: initialValue, level: null, message: null };
    },
  };
}
