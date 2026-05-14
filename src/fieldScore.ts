/**
 * fieldScore — computes a numeric strength/completeness score for a field value.
 * Useful for password strength meters, profile completeness indicators, etc.
 */

export interface ScoreRule<T> {
  test: (value: T) => boolean;
  points: number;
  label?: string;
}

export interface FieldScoreState {
  score: number;
  maxScore: number;
  percent: number;
  passed: string[];
  failed: string[];
  level: 'weak' | 'fair' | 'good' | 'strong';
}

export interface FieldScoreConfig<T> {
  rules: ScoreRule<T>[];
  thresholds?: {
    weak?: number;   // default 25
    fair?: number;   // default 50
    good?: number;   // default 75
  };
}

function resolveLevel(
  percent: number,
  thresholds: Required<FieldScoreConfig<unknown>['thresholds']>
): FieldScoreState['level'] {
  if (percent >= thresholds.good!) return 'strong';
  if (percent >= thresholds.fair!) return 'good';
  if (percent >= thresholds.weak!) return 'fair';
  return 'weak';
}

export function createFieldScore<T>(config: FieldScoreConfig<T>) {
  const thresholds = {
    weak: config.thresholds?.weak ?? 25,
    fair: config.thresholds?.fair ?? 50,
    good: config.thresholds?.good ?? 75,
  };

  const maxScore = config.rules.reduce((sum, r) => sum + r.points, 0);

  function evaluate(value: T): FieldScoreState {
    let score = 0;
    const passed: string[] = [];
    const failed: string[] = [];

    for (const rule of config.rules) {
      if (rule.test(value)) {
        score += rule.points;
        if (rule.label) passed.push(rule.label);
      } else {
        if (rule.label) failed.push(rule.label);
      }
    }

    const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const level = resolveLevel(percent, thresholds);

    return { score, maxScore, percent, passed, failed, level };
  }

  function getMaxScore(): number {
    return maxScore;
  }

  return { evaluate, getMaxScore };
}
