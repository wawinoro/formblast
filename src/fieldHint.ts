import { FieldState } from './types';

export interface HintRule<T> {
  when: (value: T) => boolean;
  message: string;
}

export interface FieldHintState<T> {
  value: T;
  hints: string[];
  activeHint: string | null;
}

export interface FieldHint<T> {
  addRule: (rule: HintRule<T>) => void;
  removeRule: (message: string) => void;
  evaluate: (value: T) => FieldHintState<T>;
  getActiveHints: (value: T) => string[];
  clear: () => void;
}

export function createFieldHint<T>(
  initialRules: HintRule<T>[] = []
): FieldHint<T> {
  let rules: HintRule<T>[] = [...initialRules];

  function addRule(rule: HintRule<T>): void {
    rules.push(rule);
  }

  function removeRule(message: string): void {
    rules = rules.filter((r) => r.message !== message);
  }

  function getActiveHints(value: T): string[] {
    return rules
      .filter((rule) => rule.when(value))
      .map((rule) => rule.message);
  }

  function evaluate(value: T): FieldHintState<T> {
    const hints = getActiveHints(value);
    return {
      value,
      hints,
      activeHint: hints.length > 0 ? hints[0] : null,
    };
  }

  function clear(): void {
    rules = [];
  }

  return { addRule, removeRule, evaluate, getActiveHints, clear };
}
