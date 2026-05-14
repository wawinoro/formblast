# fieldProgress

Track completion progress across form fields declaratively.

## Usage

```ts
import { createFieldProgress } from 'formblast';

const progress = createFieldProgress({
  schema,
  required: ['name', 'email', 'phone'],
});

const state = progress.evaluate(formValues);
console.log(state.percent);    // e.g. 66
console.log(state.remaining);  // ['phone']
console.log(state.isComplete); // false
```

## API

### `createFieldProgress(options)`

Returns a progress tracker bound to the provided schema.

**Options**

| Option     | Type                  | Description                                          |
|------------|-----------------------|------------------------------------------------------|
| `schema`   | `FieldSchema<T>[]`    | Full field schema used to derive tracked fields.     |
| `required` | `(keyof T)[]`         | Optional subset of fields to track. Defaults to all. |

### `.evaluate(values)`

Returns a `FieldProgressState` object:

| Property    | Type           | Description                                 |
|-------------|----------------|---------------------------------------------|
| `total`     | `number`       | Total number of tracked fields.             |
| `completed` | `number`       | Number of non-empty fields.                 |
| `percent`   | `number`       | Completion percentage (0–100).              |
| `remaining` | `(keyof T)[]`  | Fields that are still empty.                |
| `isComplete`| `boolean`      | `true` when all tracked fields are filled.  |

### `.getPercent(values)`

Shorthand that returns the completion percentage as a number.

### `.isComplete(values)`

Shorthand that returns `true` when all tracked fields have values.

## Notes

- A field is considered **empty** if its value is `undefined`, `null`, or a whitespace-only string.
- Numeric `0` and boolean `false` are treated as **filled**.
