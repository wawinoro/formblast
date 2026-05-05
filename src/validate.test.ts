import { validateField, validateForm } from "./validate";
import { minLength, maxLength, email, range } from "./validators";
import type { FormSchema } from "./types";

describe("validateField", () => {
  it("returns valid when required field has a value", () => {
    const result = validateField("hello", "name", { required: true });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns error when required field is empty string", () => {
    const result = validateField("", "name", { required: true, label: "Name" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name is required.");
  });

  it("runs custom validators", () => {
    const result = validateField("hi", "username", {
      validators: [minLength(5)],
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/at least 5 characters/);
  });

  it("skips validators when value is null", () => {
    const result = validateField(null, "username", {
      validators: [minLength(5) as never],
    });
    expect(result.valid).toBe(true);
  });
});

describe("validateForm", () => {
  type SignupForm = { email: string; age: number; username: string };

  const schema: FormSchema<SignupForm> = {
    email: { required: true, validators: [email], label: "Email" },
    age: { required: true, validators: [range(18, 99)], label: "Age" },
    username: { required: true, validators: [minLength(3), maxLength(20)] },
  };

  it("returns valid for a correct form", () => {
    const result = validateForm(
      { email: "user@example.com", age: 25, username: "alice" },
      schema
    );
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("collects errors for multiple invalid fields", () => {
    const result = validateForm(
      { email: "not-an-email", age: 15, username: "" },
      schema
    );
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.age).toBeDefined();
    expect(result.errors.username).toBeDefined();
  });

  it("only reports errors for invalid fields", () => {
    const result = validateForm(
      { email: "user@example.com", age: 15, username: "bob" },
      schema
    );
    expect(result.errors.email).toBeUndefined();
    expect(result.errors.age).toBeDefined();
  });
});
