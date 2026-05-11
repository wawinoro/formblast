# fieldVisibility

Conditionally show or hide form fields based on other field values. Hidden fields are automatically excluded from error reporting.

## API

### `createVisibilityState(rules)`

Creates a new visibility state from an array of rules.

```ts
const state = createVisibilityState([
  { field: 'companyName', condition: (v) => v.accountType === 'business' },
  { field: 'vatNumber',   condition: (v) => v.accountType === 'business' },
  { field: 'personalId', condition: (v) => v.accountType === 'personal' },
]);
```

### `evaluateVisibility(state, values)`

Re-evaluates all rules against the current form values and returns an updated state.

```ts
const updated = evaluateVisibility(state, formValues);
```

### `isFieldVisible(state, field)`

Returns `true` if the field should be rendered. Fields not referenced by any rule are visible by default.

```ts
if (isFieldVisible(state, 'companyName')) { /* render field */ }
```

### `filterHiddenErrors(state, errors)`

Strips validation errors that belong to hidden fields so they don't block form submission.

```ts
const safeErrors = filterHiddenErrors(state, allErrors);
```

### `getVisibleFieldKeys(state)` / `getHiddenFieldKeys(state)`

Return arrays of field keys that are currently visible or hidden.

## Full example

```ts
import { createVisibilityState, evaluateVisibility, filterHiddenErrors } from 'formblast';

let visState = createVisibilityState(rules);

function onValuesChange(values: FormValues) {
  visState = evaluateVisibility(visState, values);
  const safeErrors = filterHiddenErrors(visState, currentErrors);
  renderForm(visState, safeErrors);
}
```
