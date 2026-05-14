# fieldRating

Provides a numeric rating field with configurable range, step, labels, and validation.

## Usage

```ts
import { createFieldRating } from 'formblast';

const rating = createFieldRating({
  min: 1,
  max: 5,
  step: 1,
  required: true,
  labels: {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  },
});

rating.setValue(4);
const state = rating.getState();
// { value: 4, isValid: true, label: 'Very Good', percent: 75, error: null }
```

## API

### `createFieldRating(config)`

| Option     | Type                        | Description                          |
|------------|-----------------------------|--------------------------------------|
| `min`      | `number`                    | Minimum allowed value (required)     |
| `max`      | `number`                    | Maximum allowed value (required)     |
| `step`     | `number`                    | Increment step (default: `1`)        |
| `required` | `boolean`                   | Whether a value must be set          |
| `labels`   | `Record<number, string>`    | Optional label per numeric value     |

### Methods

- **`setValue(value)`** — Set the current rating value.
- **`increment()`** — Increase value by one step (capped at `max`).
- **`decrement()`** — Decrease value by one step (floored at `min`).
- **`reset()`** — Clear the current value back to `null`.
- **`getState()`** — Return the current `RatingState`.
- **`validate(value)`** — Run validation without updating state.

### `RatingState`

```ts
{
  value: number | null;
  min: number;
  max: number;
  step: number;
  isValid: boolean;
  error: string | null;
  label: string | null;  // from labels map
  percent: number;       // 0–100
}
```
