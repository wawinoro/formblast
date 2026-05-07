/**
 * Default validation error messages and message factory utilities.
 */

export type MessageKey =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'rangeMin'
  | 'rangeMax'
  | 'custom';

export type MessageFactory = (params: Record<string, unknown>) => string;

export const defaultMessages: Record<MessageKey, MessageFactory> = {
  required: () => 'This field is required.',
  minLength: ({ min }) => `Must be at least ${min} characters long.`,
  maxLength: ({ max }) => `Must be no more than ${max} characters long.`,
  pattern: () => 'Invalid format.',
  rangeMin: ({ min }) => `Must be greater than or equal to ${min}.`,
  rangeMax: ({ max }) => `Must be less than or equal to ${max}.`,
  custom: ({ message }) => (message as string) ?? 'Validation failed.',
};

let activeMessages: Record<MessageKey, MessageFactory> = { ...defaultMessages };

/**
 * Override one or more default messages globally.
 */
export function configureMessages(
  overrides: Partial<Record<MessageKey, MessageFactory>>
): void {
  activeMessages = { ...activeMessages, ...overrides };
}

/**
 * Reset messages back to built-in defaults.
 */
export function resetMessages(): void {
  activeMessages = { ...defaultMessages };
}

/**
 * Retrieve the current message for a given key.
 */
export function getMessage(
  key: MessageKey,
  params: Record<string, unknown> = {}
): string {
  const factory = activeMessages[key] ?? defaultMessages.custom;
  return factory(params);
}

/**
 * Returns a snapshot of all currently active message factories.
 * Useful for debugging or serialising the current message configuration.
 */
export function getActiveMessages(): Record<MessageKey, MessageFactory> {
  return { ...activeMessages };
}
