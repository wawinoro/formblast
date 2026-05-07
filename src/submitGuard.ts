import { createTouchedState, touchAll, allTouched } from './touched';

export interface SubmitGuardOptions<T extends Record<string, unknown>> {
  onSubmit: (values: T) => void | Promise<void>;
  validate: (values: T) => Record<string, string | null>;
  requireAllTouched?: boolean;
}

export interface SubmitGuardState<T extends Record<string, unknown>> {
  isSubmitting: boolean;
  submitCount: number;
  errors: Record<string, string | null>;
  canSubmit: (values: T) => boolean;
  handleSubmit: (values: T) => Promise<void>;
  reset: () => void;
}

export function createSubmitGuard<T extends Record<string, unknown>>(
  fields: (keyof T)[],
  options: SubmitGuardOptions<T>
): SubmitGuardState<T> {
  const touched = createTouchedState(fields as string[]);
  let isSubmitting = false;
  let submitCount = 0;
  let errors: Record<string, string | null> = {};

  const canSubmit = (values: T): boolean => {
    if (isSubmitting) return false;
    const validationErrors = options.validate(values);
    const hasErrors = Object.values(validationErrors).some((e) => e !== null);
    if (options.requireAllTouched && !allTouched(touched, fields as string[])) {
      return false;
    }
    return !hasErrors;
  };

  const handleSubmit = async (values: T): Promise<void> => {
    touchAll(touched, fields as string[]);
    const validationErrors = options.validate(values);
    errors = validationErrors;
    const hasErrors = Object.values(validationErrors).some((e) => e !== null);
    if (hasErrors) return;
    isSubmitting = true;
    submitCount += 1;
    try {
      await options.onSubmit(values);
    } finally {
      isSubmitting = false;
    }
  };

  const reset = (): void => {
    isSubmitting = false;
    submitCount = 0;
    errors = {};
    fields.forEach((f) => {
      touched.touched[f as string] = false;
      touched.dirty[f as string] = false;
    });
  };

  return {
    get isSubmitting() { return isSubmitting; },
    get submitCount() { return submitCount; },
    get errors() { return errors; },
    canSubmit,
    handleSubmit,
    reset,
  };
}
