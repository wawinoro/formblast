# Field Array

The `fieldArray` module provides utilities for managing and validating dynamic lists of form items, each validated against a shared schema.

## API

### `createFieldArray<T>(schema)`

Creates a stateful field array manager bound to a validation schema.

```ts
import { createFieldArray } from 'formblast';
import { minLength, maxLength } from 'formblast';

const schema = {
  name: [minLength(2), maxLength(50)],
  email: [minLength(5), maxLength(100)],
};

const fa = createFieldArray(schema);

fa.add({ name: 'Alice', email: 'alice@example.com' });
fa.add({ name: 'Bob', email: 'bob@example.com' });

const isValid = fa.validate();
// true if all items pass, false otherwise

const errors = fa.getErrors(0);
// ValidationResult for item at index 0, or undefined if valid

fa.update(0, { name: 'Alicia', email: 'alicia@example.com' });
fa.remove(1);
fa.reset(); // clears all items and errors
```

### `validateFieldArray<T>(schema, items)`

A stateless utility that validates an array of items against a schema in one call.

```ts
import { validateFieldArray } from 'formblast';

const { valid, errors } = validateFieldArray(schema, [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'A', email: 'a@b' }, // invalid
]);

console.log(valid);     // false
console.log(errors[1]); // ValidationResult for second item
```

## Notes

- Removing an item automatically re-indexes remaining errors.
- `validate()` clears previous errors before re-running.
- Each item is validated independently using `validateSchema`.
