# fieldSlider

A numeric range slider field with step snapping, clamping, and optional schema validation.

## Usage

```ts
import { createFieldSlider } from './fieldSlider';

const slider = createFieldSlider({
  min: 0,
  max: 100,
  step: 5,
  initialValue: 20,
});

slider.setValue(47);       // snaps to 45
slider.increment();        // 50
slider.decrement();        // 45

const state = slider.getState();
// { value: 45, min: 0, max: 100, step: 5, percent: 45, valid: true, error: null }
```

## API

### `createFieldSlider(options)`

| Option | Type | Description |
|---|---|---|
| `min` | `number` | Minimum allowed value |
| `max` | `number` | Maximum allowed value |
| `step` | `number` | Snap interval (default `1`) |
| `initialValue` | `number` | Starting value (defaults to `min`) |
| `schema` | `FieldSchema` | Optional validation schema |

### Methods

| Method | Description |
|---|---|
| `getState()` | Returns current `FieldSliderState` |
| `setValue(val)` | Sets value, clamps and snaps to step |
| `increment()` | Adds one step |
| `decrement()` | Subtracts one step |
| `reset()` | Restores initial value and clears errors |
| `validate()` | Runs schema validation, returns `boolean` |

### `FieldSliderState`

```ts
{
  value: number;
  min: number;
  max: number;
  step: number;
  percent: number;   // 0–100
  valid: boolean;
  error: string | null;
}
```
