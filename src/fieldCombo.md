# fieldCombo

A lightweight combo-box (searchable select) field module for **formblast**.

## Usage

```ts
import { createFieldCombo } from 'formblast';

const combo = createFieldCombo({
  options: [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ],
  required: true,
});

// Filter options as the user types
combo.setQuery('app');
const visible = combo.getFiltered(); // [{ label: 'Apple', value: 'apple' }]

// Confirm a selection
combo.select('apple');

// Validate
const result = combo.validate(); // { valid: true }
```

## API

### `createFieldCombo<T>(config)`

| Option | Type | Description |
|---|---|---|
| `options` | `ComboOption<T>[]` | List of selectable options |
| `required` | `boolean` | Whether a selection is required |
| `validate` | `(value: T \| null) => ValidationResult` | Custom validation function |

### Instance methods

| Method | Description |
|---|---|
| `getFiltered()` | Returns options matching the current query (excludes disabled) |
| `select(value)` | Sets the selected value and closes the dropdown |
| `setQuery(q)` | Updates the search query and opens the dropdown |
| `open()` / `close()` | Manually control dropdown visibility |
| `validate()` | Runs validation and returns `ValidationResult` |
| `getState()` | Returns a snapshot of the current state |
| `reset()` | Clears selection, query, and error |

## Group usage

```ts
import { createFieldComboGroup } from 'formblast';

const group = createFieldComboGroup({
  country: { options: countryOptions, required: true },
  language: { options: langOptions },
});

group.getField('country').select('us');
const errors = group.validateAll();
const ok = group.isValid();
```
