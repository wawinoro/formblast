/**
 * Formatters: transform and normalize field values before or after validation.
 */

/** Trims whitespace from a string value */
export function trim(value: string): string {
  return value.trim();
}

/** Converts a string value to lowercase */
export function lowercase(value: string): string {
  return value.toLowerCase();
}

/** Converts a string value to uppercase */
export function uppercase(value: string): string {
  return value.toUpperCase();
}

/** Removes all non-numeric characters from a string */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Normalizes an email address: trims and lowercases */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** Truncates a string to a maximum length */
export function truncate(maxLength: number) {
  return (value: string): string => value.slice(0, maxLength);
}

/** Replaces multiple consecutive spaces with a single space */
export function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, ' ');
}

/** Applies a list of formatters in sequence to a value */
export function applyFormatters(
  value: string,
  formatters: Array<(v: string) => string>
): string {
  return formatters.reduce((acc, fn) => fn(acc), value);
}
