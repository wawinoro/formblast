# Field Dependency Graph

The `fieldDependencyGraph` module lets you declare which fields depend on other fields, then automatically revalidate downstream fields when an upstream value changes.

## Creating a Graph

```ts
import { createDependencyGraph } from 'formblast';

const graph = createDependencyGraph();
graph.addDependency('city', 'country');    // city depends on country
graph.addDependency('district', 'city');  // district depends on city
```

## Building from a Schema

Add a `dependsOn` array to any field definition and use `buildGraphFromSchema`:

```ts
import { buildGraphFromSchema } from 'formblast';

const schema = {
  country: {},
  city:    { dependsOn: ['country'] },
  district:{ dependsOn: ['city'] },
};

const graph = buildGraphFromSchema(schema);
```

## Revalidating Dependents

When a field changes, revalidate all downstream fields automatically:

```ts
import { revalidateDependents } from 'formblast';

const { revalidated, results } = revalidateDependents({
  graph,
  values,
  changedField: 'country',
  validateFn: (field, values) => validateField(schema[field], values[field]),
});

console.log(revalidated); // ['city', 'district']
console.log(results);     // { city: { valid: true, errors: [] }, ... }
```

## Cycle Detection

```ts
if (graph.hasCycle()) {
  throw new Error('Circular field dependency detected');
}
```

## Topological Order

Get fields in dependency-safe evaluation order:

```ts
const order = graph.getOrder();
// ['country', 'city', 'district']
```
