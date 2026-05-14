import { createFieldToggle } from './fieldToggle';

describe('createFieldToggle', () => {
  it('initialises with default state', () => {
    const toggle = createFieldToggle();
    const state = toggle.getState();
    expect(state.value).toBe(false);
    expect(state.disabled).toBe(false);
    expect(state.error).toBeNull();
    expect(state.touched).toBe(false);
  });

  it('respects custom initial value', () => {
    const toggle = createFieldToggle({ initial: true });
    expect(toggle.getState().value).toBe(true);
  });

  it('toggles value and marks touched', () => {
    const toggle = createFieldToggle();
    toggle.toggle();
    expect(toggle.getState().value).toBe(true);
    expect(toggle.getState().touched).toBe(true);
  });

  it('toggle is a no-op when disabled', () => {
    const toggle = createFieldToggle({ disabled: true });
    toggle.toggle();
    expect(toggle.getState().value).toBe(false);
  });

  it('setValue updates value', () => {
    const toggle = createFieldToggle();
    toggle.setValue(true);
    expect(toggle.getState().value).toBe(true);
  });

  it('setValue is a no-op when disabled', () => {
    const toggle = createFieldToggle({ disabled: true });
    toggle.setValue(true);
    expect(toggle.getState().value).toBe(false);
  });

  it('setDisabled updates disabled flag', () => {
    const toggle = createFieldToggle();
    toggle.setDisabled(true);
    expect(toggle.getState().disabled).toBe(true);
  });

  it('validates requiredTrue — fails when unchecked', () => {
    const toggle = createFieldToggle({ requiredTrue: true });
    const result = toggle.validate();
    expect(result).toBe(false);
    expect(toggle.getState().error).toBe('This field must be checked.');
  });

  it('validates requiredTrue — passes when checked', () => {
    const toggle = createFieldToggle({ requiredTrue: true, initial: true });
    const result = toggle.validate();
    expect(result).toBe(true);
    expect(toggle.getState().error).toBeNull();
  });

  it('uses custom error message for requiredTrue', () => {
    const toggle = createFieldToggle({
      requiredTrue: true,
      requiredTrueMessage: 'You must agree.',
    });
    toggle.validate();
    expect(toggle.getState().error).toBe('You must agree.');
  });

  it('touch triggers validation', () => {
    const toggle = createFieldToggle({ requiredTrue: true });
    toggle.touch();
    expect(toggle.getState().touched).toBe(true);
    expect(toggle.getState().error).not.toBeNull();
  });

  it('reset restores initial state', () => {
    const toggle = createFieldToggle({ initial: false, requiredTrue: true });
    toggle.toggle();
    toggle.reset();
    const state = toggle.getState();
    expect(state.value).toBe(false);
    expect(state.touched).toBe(false);
    expect(state.error).toBeNull();
  });
});
