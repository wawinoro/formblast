import { createFieldDatePicker } from "./fieldDatePicker";

const ctx = {};

describe("createFieldDatePicker", () => {
  it("initialises with empty state", () => {
    const field = createFieldDatePicker();
    const s = field.getState();
    expect(s.value).toBeNull();
    expect(s.displayValue).toBe("");
    expect(s.error).toBeNull();
    expect(s.touched).toBe(false);
    expect(s.open).toBe(false);
  });

  it("sets a date and formats display value", () => {
    const field = createFieldDatePicker();
    const date = new Date(2024, 5, 15);
    const s = field.setValue(date, ctx);
    expect(s.value).toBe(date);
    expect(s.displayValue).toBe("2024-06-15");
    expect(s.touched).toBe(true);
  });

  it("validates required", () => {
    const field = createFieldDatePicker({ required: true });
    const s = field.setValue(null, ctx);
    expect(s.error).toBe("Date is required.");
    expect(field.isValid()).toBe(false);
  });

  it("passes when required and date provided", () => {
    const field = createFieldDatePicker({ required: true });
    const s = field.setValue(new Date(2024, 0, 1), ctx);
    expect(s.error).toBeNull();
    expect(field.isValid()).toBe(true);
  });

  it("validates min date", () => {
    const min = new Date(2024, 0, 10);
    const field = createFieldDatePicker({ min });
    const s = field.setValue(new Date(2024, 0, 5), ctx);
    expect(s.error).toMatch(/on or after/);
  });

  it("validates max date", () => {
    const max = new Date(2024, 0, 10);
    const field = createFieldDatePicker({ max });
    const s = field.setValue(new Date(2024, 0, 15), ctx);
    expect(s.error).toMatch(/on or before/);
  });

  it("validates disabled dates", () => {
    const disabled = [new Date(2024, 3, 20)];
    const field = createFieldDatePicker({ disabledDates: disabled });
    const s = field.setValue(new Date(2024, 3, 20), ctx);
    expect(s.error).toBe("This date is not available.");
  });

  it("runs custom validator", () => {
    const field = createFieldDatePicker({
      validate: (d) => (d && d.getDay() === 0 ? "No Sundays." : null),
    });
    const sunday = new Date(2024, 5, 16);
    const s = field.setValue(sunday, ctx);
    expect(s.error).toBe("No Sundays.");
  });

  it("opens and closes", () => {
    const field = createFieldDatePicker();
    expect(field.open().open).toBe(true);
    expect(field.close().open).toBe(false);
  });

  it("clears the value", () => {
    const field = createFieldDatePicker();
    field.setValue(new Date(2024, 0, 1), ctx);
    const s = field.clear(ctx);
    expect(s.value).toBeNull();
    expect(s.displayValue).toBe("");
  });

  it("touch marks field as touched without changing value", () => {
    const field = createFieldDatePicker();
    const s = field.touch();
    expect(s.touched).toBe(true);
    expect(s.value).toBeNull();
  });

  it("validate triggers error without setting value", () => {
    const field = createFieldDatePicker({ required: true });
    const s = field.validate(ctx);
    expect(s.error).toBe("Date is required.");
    expect(s.touched).toBe(true);
  });
});
