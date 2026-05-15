import { createFieldMultiSelect } from './fieldMultiSelect';

const OPTIONS = ['apple', 'banana', 'cherry', 'date'];

describe('createFieldMultiSelect', () => {
  it('initialises with empty selection by default', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS });
    expect(ms.getState().selected).toEqual([]);
  });

  it('initialises with provided initial values', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS, initial: ['apple'] });
    expect(ms.getState().selected).toEqual(['apple']);
  });

  it('toggles an option on', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS });
    ms.toggle('banana');
    expect(ms.isSelected('banana')).toBe(true);
  });

  it('toggles an option off', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS, initial: ['banana'] });
    ms.toggle('banana');
    expect(ms.isSelected('banana')).toBe(false);
  });

  it('marks touched on toggle', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS });
    ms.toggle('apple');
    expect(ms.getState().touched).toBe(true);
  });

  it('selectAll selects every option', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS });
    ms.selectAll();
    expect(ms.getState().selected).toEqual(OPTIONS);
  });

  it('clearAll empties selection', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS, initial: OPTIONS });
    ms.clearAll();
    expect(ms.getState().selected).toEqual([]);
  });

  it('validates min constraint', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS, min: 2 });
    ms.toggle('apple');
    const result = ms.validate();
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/at least 2/);
  });

  it('validates max constraint', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS, max: 2 });
    ms.selectAll();
    const result = ms.validate();
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/no more than 2/);
  });

  it('passes validation when constraints satisfied', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS, min: 1, max: 3 });
    ms.toggle('apple');
    ms.toggle('banana');
    expect(ms.validate().valid).toBe(true);
  });

  it('uses custom validate function', () => {
    const ms = createFieldMultiSelect({
      options: OPTIONS,
      validate: (sel) => sel.includes('cherry') ? null : 'Cherry required',
    });
    ms.toggle('apple');
    expect(ms.validate().error).toBe('Cherry required');
    ms.toggle('cherry');
    expect(ms.validate().valid).toBe(true);
  });

  it('reset restores initial state', () => {
    const ms = createFieldMultiSelect({ options: OPTIONS, initial: ['date'] });
    ms.selectAll();
    ms.reset();
    const s = ms.getState();
    expect(s.selected).toEqual(['date']);
    expect(s.touched).toBe(false);
    expect(s.error).toBeNull();
  });
});
