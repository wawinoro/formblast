# fieldMultiSelect

Manages a multi-select field with optional min/max constraints and custom validation.

## API

### `createFieldMultiSelect<T>(config)`

Creates a multi-select controller.

**Config options:**

| Property   | Type                          | Description                          |
|------------|-------------------------------|--------------------------------------|
| `options`  | `T[]`                         | Full list of available options       |
| `initial`  | `T[]`                         | Initially selected values            |
| `min`      | `number`                      | Minimum number of selections         |
| `max`      | `number`                      | Maximum number of selections         |
| `validate` | `(selected: T[]) => string \| null` | Custom validation function   |

**Returns:**

- `toggle(option)` — Add or remove an option from the selection.
- `selectAll()` — Select all available options.
- `clearAll()` — Deselect all options.
- `isSelected(option)` — Check whether an option is currently selected.
- `validate()` — Run validation and return `{ valid, error }`.
- `getState()` — Return a snapshot of the current state.
- `reset()` — Restore initial values and clear errors.

## Example

```ts
import { createFieldMultiSelect } from 'formblast';

const tags = createFieldMultiSelect({
  options: ['ts', 'js', 'rust', 'go'],
  min: 1,
  max: 3,
});

tags.toggle('ts');
tags.toggle('rust');
console.log(tags.validate()); // { valid: true, error: null }

tags.selectAll();
console.log(tags.validate()); // { valid: false, error: 'Select no more than 3 option(s).' }
```
