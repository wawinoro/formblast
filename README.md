# formblast

Lightweight library for declarative form validation with zero dependencies.

## Installation

```bash
npm install formblast
```

## Usage

Define a schema, pass your form data, and get back validation results instantly.

```typescript
import { createSchema, validate } from "formblast";

const schema = createSchema({
  username: { required: true, minLength: 3, maxLength: 20 },
  email: { required: true, pattern: "email" },
  age: { required: true, min: 18 },
});

const result = validate(schema, {
  username: "jo",
  email: "not-an-email",
  age: 16,
});

if (!result.valid) {
  console.log(result.errors);
  // {
  //   username: "Must be at least 3 characters",
  //   email: "Must be a valid email address",
  //   age: "Must be at least 18"
  // }
}
```

### Custom Validators

```typescript
const schema = createSchema({
  password: {
    required: true,
    validate: (value) =>
      /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
  },
});
```

## API

| Function       | Description                              |
| -------------- | ---------------------------------------- |
| `createSchema` | Defines validation rules for each field  |
| `validate`     | Runs validation and returns a result object |

## License

MIT