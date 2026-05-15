# fieldPriority

Assigns a priority level to a field's value based on declarative rules.

## Overview

`createFieldPriority` lets you attach `low`, `medium`, `high`, or `critical` labels to a field depending on its current value. The highest matching priority wins.

## Usage

```ts
import { createFieldPriority } from './fieldPriority';

const fp = createFieldPriority(0);

fp.addRule({ level: 'low',      condition: (v) => v > 10,  message: 'Slightly elevated' });
fp.addRule({ level: 'high',     condition: (v) => v > 50,  message: 'High value detected' });
fp.addRule({ level: 'critical', condition: (v) => v > 90,  message: 'Critical threshold!' });

const state = fp.setValue(75);
console.log(state.level);   // 'high'
console.log(state.message); // 'High value detected'
```

## API

### `createFieldPriority<T>(initialValue: T)`

Returns a priority controller with the following methods:

| Method | Description |
|---|---|
| `addRule(rule)` | Register a new priority rule |
| `removeRule(level)` | Remove all rules for a given level |
| `setValue(value)` | Update the value and re-evaluate |
| `evaluate()` | Re-evaluate rules against current value |
| `getLevel()` | Return the current priority level |
| `getState()` | Return a snapshot of the full state |
| `reset()` | Restore initial value and clear level |

## Priority Order

`low` < `medium` < `high` < `critical`

When multiple rules match, the highest-ranked level is selected.
