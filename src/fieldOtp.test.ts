import { createFieldOtp } from './fieldOtp';

describe('createFieldOtp', () => {
  it('initializes with empty slots', () => {
    const otp = createFieldOtp({ length: 4 });
    const state = otp.getState();
    expect(state.slots).toEqual(['', '', '', '']);
    expect(state.filled).toBe(false);
    expect(state.activeIndex).toBe(0);
  });

  it('sets a single slot value and advances activeIndex', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setValue(0, '3');
    const state = otp.getState();
    expect(state.slots[0]).toBe('3');
    expect(state.activeIndex).toBe(1);
  });

  it('ignores non-digit input by default', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setValue(0, 'a');
    expect(otp.getState().slots[0]).toBe('');
  });

  it('allows alphanumeric when allowAlpha is true', () => {
    const otp = createFieldOtp({ length: 4, allowAlpha: true });
    otp.setValue(0, 'b');
    expect(otp.getState().slots[0]).toBe('B');
  });

  it('fills all slots via setSlots', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setSlots('1234');
    expect(otp.getState().filled).toBe(true);
    expect(otp.getValue()).toBe('1234');
  });

  it('truncates input longer than length in setSlots', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setSlots('123456');
    expect(otp.getValue()).toBe('1234');
  });

  it('clears all slots and resets activeIndex', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setSlots('1234');
    otp.clear();
    const state = otp.getState();
    expect(state.slots).toEqual(['', '', '', '']);
    expect(state.activeIndex).toBe(0);
  });

  it('handles backspace on filled slot', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setSlots('1234');
    otp.backspace(2);
    expect(otp.getState().slots[2]).toBe('');
  });

  it('handles backspace on empty slot by moving to previous', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setSlots('120');
    otp.backspace(2);
    const state = otp.getState();
    expect(state.slots[1]).toBe('');
    expect(state.activeIndex).toBe(1);
  });

  it('validates returns false when not fully filled', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setValue(0, '1');
    expect(otp.validate()).toBe(false);
    expect(otp.getState().error).toMatch(/4 digits/);
  });

  it('validates returns true when fully filled', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.setSlots('5678');
    expect(otp.validate()).toBe(true);
    expect(otp.getState().error).toBeNull();
  });

  it('calls onComplete callback when all slots are filled', () => {
    const onComplete = jest.fn();
    const otp = createFieldOtp({ length: 3, onComplete });
    otp.setSlots('999');
    expect(onComplete).toHaveBeenCalledWith('999');
  });

  it('focus updates activeIndex', () => {
    const otp = createFieldOtp({ length: 4 });
    otp.focus(3);
    expect(otp.getState().activeIndex).toBe(3);
  });
});
