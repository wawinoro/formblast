# fieldHint

Provides contextual inline hints for a field based on its current value. Hints differ from validation errors — they are informational nudges shown while the user is typing, not blockers.

## Usage

```ts
import { createFieldHint } from 'formblast';

const passwordHint = createFieldHint<string>([
  { when: (v) => v.length < 8, message: 'Use at least 8 characters' },
  { when: (v) => !/[A-Z]/.test(v), message: 'Add an uppercase letter' },
  { when: (v) => !/[0-9]/.test(v), message: 'Include a number' },
]);

const state = passwordHint.evaluate('hello');
// state.hints   => ['Use at least 8 characters', 'Add an uppercase letter', 'Include a number']
// state.activeHint => 'Use at least 8 characters'
```

## API

### `createFieldHint<T>(rules?)`

Creates a hint manager for a field of type `T`.

| Method | Description |
|---|---|
| `evaluate(value)` | Returns `FieldHintState` with all active hints and the first `activeHint`. |
| `getActiveHints(value)` | Returns an array of matching hint messages. |
| `addRule(rule)` | Adds a new `HintRule` at runtime. |
| `removeRule(message)` | Removes a rule by its message string. |
| `clear()` | Removes all registered rules. |

## Types

```ts
interface HintRule<T> {
  when: (value: T) => boolean;
  message: string;
}

interface FieldHintState<T> {
  value: T;
  hints: string[];
  activeHint: string | null;
}
```
