# errorSummary

The `errorSummary` module aggregates validation results from one or more fields into a structured summary object. It is useful for displaying error lists, counting issues, or checking overall form validity.

## API

### `createErrorSummary(results)`

Builds an `ErrorSummary` from a flat map of field names to error messages (or `null`/`undefined` for no error).

```ts
import { createErrorSummary } from 'formblast';

const summary = createErrorSummary({
  name: 'Required',
  email: null,
  age: 'Must be at least 18',
});

console.log(summary.hasErrors); // true
console.log(summary.count);     // 2
console.log(summary.firstError); // { field: 'name', message: 'Required' }
console.log(summary.byField['age']); // 'Must be at least 18'
```

### `mergeErrorSummaries(...summaries)`

Combines multiple `ErrorSummary` objects into one. The first error for a given field wins.

```ts
const merged = mergeErrorSummaries(stepOneSummary, stepTwoSummary);
```

### `filterErrorSummary(summary, fields)`

Returns a new `ErrorSummary` containing only errors for the specified field names.

```ts
const addressErrors = filterErrorSummary(summary, ['street', 'city', 'zip']);
```

## ErrorSummary shape

```ts
interface ErrorSummary {
  hasErrors: boolean;
  count: number;
  errors: { field: string; message: string }[];
  firstError: { field: string; message: string } | null;
  byField: Record<string, string>;
}
```
