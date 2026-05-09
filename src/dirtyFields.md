# dirtyFields

Track which form fields have been modified from their initial values.

## Overview

`dirtyFields` provides a pure, immutable state machine for comparing current field values against their original values, enabling UI indicators, submit guards, and change summaries.

## API

### `createDirtyFields<T>(initialValues)`

Creates a new dirty-fields state from a set of initial values.

```ts
const state = createDirtyFields({ name: 'Alice', email: 'alice@example.com' });
```

### `updateField(state, field, value)`

Returns a new state reflecting the updated value. Automatically marks the field dirty if the value differs from the initial, or clears it if the value is restored.

```ts
const next = updateField(state, 'name', 'Bob');
```

### `isDirtyField(state, field)`

Returns `true` if the given field has been changed from its initial value.

### `getDirtyFields(state)`

Returns an array of all field keys currently marked as dirty.

### `hasAnyDirty(state)`

Returns `true` if at least one field is dirty. Useful for enabling/disabling a Save button.

### `getDirtyValues(state)`

Returns a partial object containing only the fields that have changed, along with their current values.

```ts
const changes = getDirtyValues(state);
// { name: 'Bob' }
```

### `resetDirtyFields(state, newInitial?)`

Clears all dirty tracking. If `newInitial` is provided it becomes the new baseline; otherwise the current values are used.

```ts
// After a successful save, treat current values as the new baseline:
const clean = resetDirtyFields(state);
```

## Notes

- All functions are pure and return new state objects — safe to use with React `useState` or any immutable store.
- Comparison is done with strict equality (`!==`), so object/array fields should be serialized or compared by reference intentionally.
