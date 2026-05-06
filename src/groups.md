# Group Validation

The `groups` module provides utilities for validating multiple fields together as a named group, making it easy to handle entire forms or sub-sections.

## API

### `validateGroup(values, schema)`

Validates a record of values against a matching schema of field definitions.

```ts
import { validateGroup } from 'formblast';

const summary = validateGroup(
  { username: 'al', email: 'alice@example.com' },
  {
    username: { validators: [minLength(3)] },
    email: { validators: [emailValidator] },
  }
);

console.log(summary.valid);           // false
console.log(summary.errors.username); // ['Minimum length is 3']
```

### `getGroupErrors(summary)`

Returns a flat array of all error messages across all fields.

```ts
const allErrors = getGroupErrors(summary);
// ['Minimum length is 3']
```

### `getFieldError(summary, field)`

Returns the first error message for a specific field, or `undefined` if valid.

```ts
const err = getFieldError(summary, 'username');
// 'Minimum length is 3'
```

## Group Pipeline

Use `runGroupPipeline` to apply transforms before validation in a single step:

```ts
import { runGroupPipeline } from 'formblast';

const { transformed, summary } = runGroupPipeline(
  { username: '  alice  ', email: 'ALICE@EXAMPLE.COM' },
  schema,
  { transforms: { username: [trim], email: [lowercase] } }
);
```
