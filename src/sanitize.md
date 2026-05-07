# Sanitize

The `sanitize` module provides utilities for cleaning and normalising raw field
values **before** validation runs. Sanitizers are pure functions that accept a
value and return a cleaned version of that value.

## Built-in sanitizers

| Sanitizer | Description |
|---|---|
| `stripHtml` | Removes all HTML tags from a string |
| `collapseWhitespace` | Collapses consecutive whitespace into a single space and trims the result |
| `removeControlChars` | Strips ASCII control characters (0x00–0x1F, 0x7F) |
| `truncate(n)` | Returns a sanitizer that limits the string to `n` characters |

## `sanitizeValue`

Apply an ordered list of sanitizer functions to a value.

```ts
import { sanitizeValue, stripHtml, collapseWhitespace } from 'formblast';

const clean = sanitizeValue('<b>  Hello  </b>', {
  sanitizers: [stripHtml, collapseWhitespace],
});
// => 'Hello'
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `sanitizers` | `SanitizerFn<T>[]` | — | Ordered list of sanitizer functions |
| `stopOnNull` | `boolean` | `true` | Stop processing when the value is `null` or `undefined` |

## `withSanitizers`

Wrap an existing `FieldSchema` so that sanitizers run automatically inside its
`transform` step.

```ts
import { withSanitizers, stripHtml, truncate } from 'formblast';

const bioSchema = withSanitizers(
  { field: 'bio', rules: [minLength(10)] },
  [stripHtml, truncate(500)]
);
```

## Custom sanitizers

A sanitizer is just a function `(value: T) => T`, so you can easily add your own:

```ts
const removeEmoji: SanitizerFn<string> = (value) =>
  value.replace(/[\u{1F300}-\u{1FAFF}]/gu, '');
```
