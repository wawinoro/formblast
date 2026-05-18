import { createFieldCheckbox } from './fieldCheckbox';

describe('createFieldCheckbox', () => {
  it('initialises with default state', () => {
    const cb = createFieldCheckbox();
    const s = cb.getState();
    expect(s.checked).toBe(false);
    expect(s.indeterminate).toBe(false);
    expect(s.error).toBeNull();
    expect(s.dirty).toBe(false);
    expect(s.touched).toBe(false);
  });

  it('respects initial value', () => {
    const cb = createFieldCheckbox({ initial: true });
    expect(cb.getState().checked).toBe(true);
  });

  it('toggle flips checked and marks dirty', () => {
    const cb = createFieldCheckbox();
    cb.toggle();
    expect(cb.getState().checked).toBe(true);
    expect(cb.getState().dirty).toBe(true);
  });

  it('setChecked updates value', () => {
    const cb = createFieldCheckbox();
    cb.setChecked(true);
    expect(cb.getState().checked).toBe(true);
    cb.setChecked(false);
    expect(cb.getState().checked).toBe(false);
  });

  it('required validation fails when unchecked', () => {
    const cb = createFieldCheckbox({ required: true });
    const err = cb.validate();
    expect(err).toBe('This field is required.');
    expect(cb.getState().error).toBe('This field is required.');
  });

  it('required validation passes when checked', () => {
    const cb = createFieldCheckbox({ required: true, initial: true });
    const err = cb.validate();
    expect(err).toBeNull();
  });

  it('uses custom requiredMessage', () => {
    const cb = createFieldCheckbox({ required: true, requiredMessage: 'Must accept.' });
    expect(cb.validate()).toBe('Must accept.');
  });

  it('runs custom validators', () => {
    const cb = createFieldCheckbox({
      validators: [() => 'always fails'],
    });
    cb.setChecked(true);
    expect(cb.getState().error).toBe('always fails');
  });

  it('setIndeterminate clears checked', () => {
    const cb = createFieldCheckbox({ initial: true });
    cb.setIndeterminate(true);
    const s = cb.getState();
    expect(s.indeterminate).toBe(true);
    expect(s.checked).toBe(false);
  });

  it('toggle clears indeterminate', () => {
    const cb = createFieldCheckbox();
    cb.setIndeterminate(true);
    cb.toggle();
    expect(cb.getState().indeterminate).toBe(false);
    expect(cb.getState().checked).toBe(true);
  });

  it('touch marks field as touched', () => {
    const cb = createFieldCheckbox();
    cb.touch();
    expect(cb.getState().touched).toBe(true);
  });

  it('reset restores initial state', () => {
    const cb = createFieldCheckbox({ initial: false, required: true });
    cb.setChecked(true);
    cb.touch();
    cb.validate();
    cb.reset();
    const s = cb.getState();
    expect(s.checked).toBe(false);
    expect(s.dirty).toBe(false);
    expect(s.touched).toBe(false);
    expect(s.error).toBeNull();
    expect(s.indeterminate).toBe(false);
  });
});
