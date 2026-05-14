# fieldStatus

Track per-field lifecycle status across your form: `idle`, `validating`, `valid`, `invalid`, or `disabled`.

## API

### `createFieldStatusState<T>()`
Returns a fresh `FieldStatusState<T>` with no statuses set.

### `setFieldStatus(state, field, status)`
Returns a new state with the given field's status updated. Immutable — original state is not modified.

### `getFieldStatus(state, field)`
Returns the current `FieldStatus` for a field, defaulting to `'idle'`.

### `applyValidationResult(state, field, result)`
Convenience helper that maps a `ValidationResult` to `'valid'` or `'invalid'` and updates the field.

### `disableField(state, field)`
Sets the field status to `'disabled'`.

### `isFieldDisabled(state, field)`
Returns `true` if the field's status is `'disabled'`.

### `getStatusSummary(state)`
Returns an object grouping all field keys by their current status.

## Example

```ts
import { createFieldStatusState, setFieldStatus, applyValidationResult, getStatusSummary } from 'formblast';

type LoginForm = { email: string; password: string };

let status = createFieldStatusState<LoginForm>();

// Mark field as validating during async check
status = setFieldStatus(status, 'email', 'validating');

// Apply result once validation resolves
status = applyValidationResult(status, 'email', { valid: false, error: 'Email already taken' });

console.log(getStatusSummary(status));
// { idle: ['password'], validating: [], valid: [], invalid: ['email'], disabled: [] }
```
