# Dependent Fields

The `dependentFields` module allows you to declare field dependencies so that when one field changes, related fields are automatically re-validated.

## Use Case

Common scenarios include:
- `confirmPassword` depending on `password`
- `endDate` depending on `startDate`
- `age` depending on a `minAge` configuration field

## API

### `createDependencyMap(deps)`

Creates a dependency map describing which fields should be re-validated when a given field changes.

```ts
const depMap = createDependencyMap<MyForm>({
  password: ['confirmPassword'],
  startDate: ['endDate'],
});
```

### `validateDependents(changedField, values, schemas, dependencyMap)`

Re-validates all fields that depend on `changedField` using the current form `values` and their `schemas`.

Returns a `DependentValidationResult<T>` map of field names to `ValidationResult`.

```ts
const results = validateDependents('password', formValues, fieldSchemas, depMap);
if (!results.confirmPassword?.valid) {
  console.log(results.confirmPassword?.errors);
}
```

### `getDependents(field, dependencyMap)`

Returns the list of fields that depend on the given field.

```ts
const deps = getDependents('password', depMap);
// => ['confirmPassword']
```

### `hasDependents(field, dependencyMap)`

Returns `true` if the given field has any registered dependents.

```ts
if (hasDependents('password', depMap)) {
  // trigger re-validation of dependents
}
```

### `getAllDependents(fields, dependencyMap)`

Returns a deduplicated list of all dependents for multiple fields at once. Useful when several fields change simultaneously (e.g. on form reset or bulk update).

```ts
const deps = getAllDependents(['startDate', 'password'], depMap);
// => ['endDate', 'confirmPassword']
```

## Integration

Combine with `fieldWatch` to automatically trigger dependent re-validation when a watched field changes:

```ts
watchField('password', (newValue, allValues) => {
  const results = validateDependents('password', allValues, schemas, depMap);
  applyResults(results);
});
```
