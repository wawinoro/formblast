import { createFieldSlider } from './fieldSlider';

describe('createFieldSlider', () => {
  it('initialises with default value at min when no initialValue given', () => {
    const slider = createFieldSlider({ min: 0, max: 100 });
    expect(slider.getState().value).toBe(0);
  });

  it('initialises with provided initialValue', () => {
    const slider = createFieldSlider({ min: 0, max: 100, initialValue: 40 });
    expect(slider.getState().value).toBe(40);
  });

  it('clamps initialValue to range', () => {
    const slider = createFieldSlider({ min: 10, max: 50, initialValue: 200 });
    expect(slider.getState().value).toBe(50);
  });

  it('computes correct percent', () => {
    const slider = createFieldSlider({ min: 0, max: 200, initialValue: 50 });
    expect(slider.getState().percent).toBe(25);
  });

  it('setValue clamps to max', () => {
    const slider = createFieldSlider({ min: 0, max: 10 });
    slider.setValue(999);
    expect(slider.getState().value).toBe(10);
  });

  it('setValue clamps to min', () => {
    const slider = createFieldSlider({ min: 5, max: 20 });
    slider.setValue(-5);
    expect(slider.getState().value).toBe(5);
  });

  it('setValue snaps to step', () => {
    const slider = createFieldSlider({ min: 0, max: 100, step: 10 });
    slider.setValue(23);
    expect(slider.getState().value).toBe(20);
  });

  it('increment adds step', () => {
    const slider = createFieldSlider({ min: 0, max: 100, step: 5, initialValue: 10 });
    slider.increment();
    expect(slider.getState().value).toBe(15);
  });

  it('increment does not exceed max', () => {
    const slider = createFieldSlider({ min: 0, max: 10, step: 5, initialValue: 8 });
    slider.increment();
    expect(slider.getState().value).toBe(10);
  });

  it('decrement subtracts step', () => {
    const slider = createFieldSlider({ min: 0, max: 100, step: 5, initialValue: 20 });
    slider.decrement();
    expect(slider.getState().value).toBe(15);
  });

  it('decrement does not go below min', () => {
    const slider = createFieldSlider({ min: 0, max: 10, step: 5, initialValue: 2 });
    slider.decrement();
    expect(slider.getState().value).toBe(0);
  });

  it('reset restores initial state', () => {
    const slider = createFieldSlider({ min: 0, max: 100, initialValue: 30 });
    slider.setValue(80);
    slider.reset();
    const state = slider.getState();
    expect(state.value).toBe(30);
    expect(state.error).toBeNull();
    expect(state.valid).toBe(true);
  });

  it('validate returns true when no schema', () => {
    const slider = createFieldSlider({ min: 0, max: 100 });
    expect(slider.validate()).toBe(true);
  });

  it('percent is 0 when min equals max', () => {
    const slider = createFieldSlider({ min: 5, max: 5, initialValue: 5 });
    expect(slider.getState().percent).toBe(0);
  });
});
