import { renderProgressBar, getProgressColor } from './fieldProgressBar';
import { FieldProgressState } from './fieldProgress';

function makeState(percent: number, completed = 2, total = 4): FieldProgressState<Record<string, unknown>> {
  return {
    total,
    completed,
    percent,
    remaining: [],
    isComplete: percent === 100,
  };
}

describe('renderProgressBar', () => {
  it('renders a full bar at 100%', () => {
    const result = renderProgressBar(makeState(100, 4, 4));
    expect(result.bar).toBe('█'.repeat(20));
    expect(result.percent).toBe(100);
    expect(result.label).toBe('100%');
  });

  it('renders an empty bar at 0%', () => {
    const result = renderProgressBar(makeState(0, 0, 4));
    expect(result.bar).toBe('░'.repeat(20));
    expect(result.label).toBe('0%');
  });

  it('renders a partial bar at 50%', () => {
    const result = renderProgressBar(makeState(50, 2, 4));
    expect(result.bar).toBe('█'.repeat(10) + '░'.repeat(10));
  });

  it('respects custom width', () => {
    const result = renderProgressBar(makeState(50, 2, 4), { width: 10 });
    expect(result.bar.length).toBe(10);
    expect(result.bar).toBe('█'.repeat(5) + '░'.repeat(5));
  });

  it('respects custom chars', () => {
    const result = renderProgressBar(makeState(100, 4, 4), { filledChar: '#', emptyChar: '-', width: 5 });
    expect(result.bar).toBe('#####');
  });

  it('shows count label when showPercent is false', () => {
    const result = renderProgressBar(makeState(50, 2, 4), { showPercent: false });
    expect(result.label).toBe('2/4');
  });

  it('includes accessible ariaLabel', () => {
    const result = renderProgressBar(makeState(75, 3, 4));
    expect(result.ariaLabel).toContain('75%');
    expect(result.ariaLabel).toContain('3 of 4');
  });
});

describe('getProgressColor', () => {
  it('returns error for low progress', () => {
    expect(getProgressColor(0)).toBe('error');
    expect(getProgressColor(33)).toBe('error');
  });

  it('returns warning for mid progress', () => {
    expect(getProgressColor(34)).toBe('warning');
    expect(getProgressColor(66)).toBe('warning');
  });

  it('returns success for high progress', () => {
    expect(getProgressColor(67)).toBe('success');
    expect(getProgressColor(100)).toBe('success');
  });
});
