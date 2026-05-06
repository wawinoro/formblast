# Field Masking

The `fieldMask` module provides utilities for applying input masks to form fields — useful for phone numbers, dates, credit cards, and other formatted inputs.

## Functions

### `applyMask(value, options)`

Formats a raw string value according to a mask pattern.

```ts
import { applyMask } from 'formblast';

const formatted = applyMask('1234567890', { pattern: '(999) 999-9999' });
// => '(123) 456-7890'
```

### `stripMask(value, options)`

Removes mask characters and returns only the raw input characters.

```ts
import { stripMask } from 'formblast';

const raw = stripMask('(123) 456-7890', { pattern: '(999) 999-9999' });
// => '1234567890'
```

### `createMaskedField(field, options)`

Attaches mask options to a field in a schema using a composable, curried API.

```ts
import { createMaskedField } from 'formblast';

const withPhoneMask = createMaskedField<MyForm>('phone', {
  pattern: '(999) 999-9999',
});

const maskedSchema = withPhoneMask(mySchema);
```

## Mask Pattern Characters

| Character | Matches         |
|-----------|-----------------|
| `9`       | Digits `[0-9]`  |
| `a`       | Letters `[a-zA-Z]` |
| `*`       | Alphanumeric `[a-zA-Z0-9]` |
| Other     | Literal (separator) |

## Custom Characters

You can extend or override the default character map:

```ts
applyMask('abc', {
  pattern: 'LLL',
  chars: { L: /[a-z]/ },
});
```

## Placeholder

Unfilled positions are shown with `_` by default. Override with the `placeholder` option:

```ts
applyMask('12', { pattern: '999', placeholder: '#' });
// => '12#'
```
