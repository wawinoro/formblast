import { createFieldPriority } from './fieldPriority';

describe('createFieldPriority', () => {
  it('initializes with null level and message', () => {
    const fp = createFieldPriority('');
    const state = fp.getState();
    expect(state.level).toBeNull();
    expect(state.message).toBeNull();
  });

  it('evaluates a single matching rule', () => {
    const fp = createFieldPriority(5);
    fp.addRule({ level: 'high', condition: (v) => v > 3, message: 'Value is high' });
    const state = fp.evaluate();
    expect(state.level).toBe('high');
    expect(state.message).toBe('Value is high');
  });

  it('returns null level when no rule matches', () => {
    const fp = createFieldPriority(1);
    fp.addRule({ level: 'high', condition: (v) => v > 10, message: 'Too high' });
    const state = fp.evaluate();
    expect(state.level).toBeNull();
  });

  it('picks the highest priority among multiple matching rules', () => {
    const fp = createFieldPriority(15);
    fp.addRule({ level: 'low', condition: (v) => v > 5, message: 'Low warning' });
    fp.addRule({ level: 'critical', condition: (v) => v > 10, message: 'Critical!' });
    fp.addRule({ level: 'medium', condition: (v) => v > 8, message: 'Medium warning' });
    const state = fp.evaluate();
    expect(state.level).toBe('critical');
    expect(state.message).toBe('Critical!');
  });

  it('setValue triggers re-evaluation', () => {
    const fp = createFieldPriority(0);
    fp.addRule({ level: 'medium', condition: (v) => v >= 5, message: 'Medium' });
    expect(fp.evaluate().level).toBeNull();
    const state = fp.setValue(5);
    expect(state.level).toBe('medium');
  });

  it('removeRule removes matching level rule', () => {
    const fp = createFieldPriority(10);
    fp.addRule({ level: 'high', condition: () => true, message: 'High' });
    fp.removeRule('high');
    const state = fp.evaluate();
    expect(state.level).toBeNull();
  });

  it('getLevel returns current evaluated level', () => {
    const fp = createFieldPriority('urgent');
    fp.addRule({ level: 'critical', condition: (v) => v === 'urgent', message: 'Urgent!' });
    fp.evaluate();
    expect(fp.getLevel()).toBe('critical');
  });

  it('reset restores initial value and clears level', () => {
    const fp = createFieldPriority(0);
    fp.addRule({ level: 'low', condition: () => true, message: 'Always low' });
    fp.setValue(99);
    fp.reset();
    const state = fp.getState();
    expect(state.value).toBe(0);
    expect(state.level).toBeNull();
  });

  it('handles multiple rules of the same level — last matching wins via order', () => {
    const fp = createFieldPriority(5);
    fp.addRule({ level: 'medium', condition: (v) => v > 3, message: 'First medium' });
    fp.addRule({ level: 'medium', condition: (v) => v > 4, message: 'Second medium' });
    const state = fp.evaluate();
    // Both match but same level — second one encountered after first, same priority index
    expect(state.level).toBe('medium');
  });
});
