# fieldAutocomplete

Provides a lightweight, framework-agnostic autocomplete field with optional validation.

## API

### `createFieldAutocomplete<T>(options, schema?)`

Creates a single autocomplete field instance.

```ts
import { createFieldAutocomplete } from 'formblast';

const ac = createFieldAutocomplete([
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]);

ac.setQuery('ap');        // filters to ['Apple']
ac.select({ label: 'Apple', value: 'apple' });
console.log(ac.getState().selected); // { label: 'Apple', value: 'apple' }
ac.clear();
```

### State shape

| Property   | Type                        | Description                          |
|------------|-----------------------------|--------------------------------------|
| `query`    | `string`                    | Current text input value             |
| `options`  | `AutocompleteOption<T>[]`   | Full option list                     |
| `filtered` | `AutocompleteOption<T>[]`   | Options matching the current query   |
| `selected` | `AutocompleteOption<T> \| null` | Currently selected option        |
| `isOpen`   | `boolean`                   | Whether the dropdown is open         |
| `error`    | `string \| null`            | Validation error message             |

### `createFieldAutocompleteGroup()`

Manages multiple named autocomplete fields as a group.

```ts
import { createFieldAutocompleteGroup } from 'formblast';

const group = createFieldAutocompleteGroup();
const color = group.register('color', colorOptions);
const size  = group.register('size', sizeOptions);

group.validateAll();
const { fields, errors, isValid } = group.getState();

group.resetAll(); // clears all fields
```
