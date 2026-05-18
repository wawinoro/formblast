# fieldRadio

A lightweight radio-button field controller with optional validation support.

## Usage

```ts
import { createFieldRadio } from 'formblast';

const radio = createFieldRadio(
  [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ],
  (value) =>
    value === null
      ? { valid: false, error: 'Please select a size' }
      : { valid: true }
);

radio.select('md');
console.log(radio.getState().value); // 'md'
console.log(radio.isSelected('md')); // true
```

## API

### `createFieldRadio<T>(options, validator?)`

Creates a radio field controller.

| Parameter   | Type                                    | Description                          |
|-------------|-----------------------------------------|--------------------------------------|
| `options`   | `FieldRadioOption<T>[]`                 | List of selectable options           |
| `validator` | `(value: T \| null) => ValidationResult` | Optional validation function         |

### Methods

| Method              | Description                                      |
|---------------------|--------------------------------------------------|
| `getState()`        | Returns a snapshot of the current field state    |
| `select(value)`     | Selects an option (skips disabled options)       |
| `clear()`           | Resets selection and clears errors               |
| `touch()`           | Marks the field as touched                       |
| `validate()`        | Runs the validator and updates state             |
| `isSelected(value)` | Returns `true` if the given value is selected    |
| `getOption(value)`  | Finds and returns the matching option object     |

### `FieldRadioState<T>`

```ts
{
  value: T | null;
  options: FieldRadioOption<T>[];
  touched: boolean;
  valid: boolean;
  error: string | null;
}
```
