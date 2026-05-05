import type { Validator } from "./types";

/**
 * Built-in reusable validator factories.
 */

export function minLength(min: number): Validator<string> {
  return (value, fieldName) => {
    if (value.length < min) {
      return {
        valid: false,
        errors: [`${fieldName} must be at least ${min} characters long.`],
      };
    }
    return { valid: true, errors: [] };
  };
}

export function maxLength(max: number): Validator<string> {
  return (value, fieldName) => {
    if (value.length > max) {
      return {
        valid: false,
        errors: [`${fieldName} must be no more than ${max} characters long.`],
      };
    }
    return { valid: true, errors: [] };
  };
}

export function pattern(regex: RegExp, message?: string): Validator<string> {
  return (value, fieldName) => {
    if (!regex.test(value)) {
      return {
        valid: false,
        errors: [message ?? `${fieldName} has an invalid format.`],
      };
    }
    return { valid: true, errors: [] };
  };
}

export const email: Validator<string> = pattern(
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  undefined
);

export function range(
  min: number,
  max: number
): Validator<number> {
  return (value, fieldName) => {
    if (value < min || value > max) {
      return {
        valid: false,
        errors: [`${fieldName} must be between ${min} and ${max}.`],
      };
    }
    return { valid: true, errors: [] };
  };
}
