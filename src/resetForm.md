# resetForm

The `resetForm` module provides utilities for resetting an entire form or individual fields back to their default (or specified) values.

## API

### `createResetForm(schema, defaults)`

Creates a reset controller bound to a set of default values.

**Parameters**
- `schema` — Field schema map (used for future validation hooks).
- `defaults` — The baseline values every field returns to on reset.

**Returns** `{ reset, resetField, getResetCount }`

---

### `reset(current, options?)`

Resets the entire form state.

| Option | Type | Default | Description |
|---|---|---|---|
| `initialValues` | `Partial<T>` | `{}` | Override specific fields instead of using defaults |
| `keepTouched` | `boolean` | `false` | Preserve the touched map |
| `keepErrors` | `boolean` | `false` | Preserve the errors map |

Always clears `dirty`. Increments an internal `resetCount`.

---

### `resetField(current, field, value?)`

Resets a single field. Clears its error, touched, and dirty flags. If `value` is omitted the field reverts to its entry in `defaults`.

---

### `getResetCount()`

Returns how many times `reset` has been called. Useful for keying components to force re-renders.

## Example

```ts
import { createResetForm } from 'formblast';

const { reset, resetField } = createResetForm(schema, {
  username: '',
  email: '',
});

// Full reset
const freshState = reset(currentState);

// Reset a single field
const partialState = resetField(currentState, 'username');
```
