import { FieldProgressState } from './fieldProgress';

export interface ProgressBarOptions {
  width?: number;
  filledChar?: string;
  emptyChar?: string;
  showPercent?: boolean;
}

export interface ProgressBarResult {
  bar: string;
  label: string;
  percent: number;
  ariaLabel: string;
}

export function renderProgressBar<T extends Record<string, unknown>>(
  state: FieldProgressState<T>,
  options: ProgressBarOptions = {}
): ProgressBarResult {
  const {
    width = 20,
    filledChar = '█',
    emptyChar = '░',
    showPercent = true,
  } = options;

  const filled = Math.round((state.percent / 100) * width);
  const empty = width - filled;
  const bar = filledChar.repeat(filled) + emptyChar.repeat(empty);
  const label = showPercent ? `${state.percent}%` : `${state.completed}/${state.total}`;
  const ariaLabel = `Form completion: ${state.percent}% (${state.completed} of ${state.total} fields completed)`;

  return { bar, label, percent: state.percent, ariaLabel };
}

export function getProgressColor(percent: number): 'error' | 'warning' | 'success' {
  if (percent < 34) return 'error';
  if (percent < 67) return 'warning';
  return 'success';
}
