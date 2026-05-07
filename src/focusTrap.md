# focusTrap

The `focusTrap` module provides keyboard-friendly focus management for forms, allowing you to programmatically navigate between fields.

## API

### `createFocusTrap(fields, options?)`

Creates a new focus trap state for the given ordered list of field keys.

```ts
const trap = createFocusTrap<MyForm>(['name', 'email', 'age'], {
  skipInvalid: true, // skip fields that have validation errors
});
```

### `focusNext(state, invalidFields?)`

Advances focus to the next field. Returns `{ state, field }` where `field` is `null` if already at the last field.

```ts
const { state: next, field } = focusNext(trap, new Set(['email']));
```

### `focusPrev(state, invalidFields?)`

Moves focus to the previous field. Returns `{ state, field }` where `field` is `null` if already at the first field.

### `focusFirst(state)` / `focusLast(state)`

Jump directly to the first or last field in the trap.

```ts
const { field } = focusFirst(trap); // 'name'
const { field } = focusLast(trap);  // 'age'
```

### `getCurrentField(state)`

Returns the currently focused field key.

## Notes

- State is immutable — all functions return a new state object.
- Use `skipInvalid: true` with a live set of invalid field keys to automatically skip fields with errors during Tab navigation.
- Integrate with `touched.ts` to mark fields as touched when focus leaves them.
