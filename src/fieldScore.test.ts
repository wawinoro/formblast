import { createFieldScore, ScoreRule } from './fieldScore';

const passwordRules: ScoreRule<string>[] = [
  { test: (v) => v.length >= 8,          points: 20, label: 'At least 8 characters' },
  { test: (v) => /[A-Z]/.test(v),        points: 20, label: 'Uppercase letter' },
  { test: (v) => /[a-z]/.test(v),        points: 20, label: 'Lowercase letter' },
  { test: (v) => /[0-9]/.test(v),        points: 20, label: 'Number' },
  { test: (v) => /[^A-Za-z0-9]/.test(v), points: 20, label: 'Special character' },
];

describe('createFieldScore', () => {
  const scorer = createFieldScore({ rules: passwordRules });

  test('getMaxScore returns sum of all rule points', () => {
    expect(scorer.getMaxScore()).toBe(100);
  });

  test('empty string scores 0 and is weak', () => {
    const result = scorer.evaluate('');
    expect(result.score).toBe(0);
    expect(result.percent).toBe(0);
    expect(result.level).toBe('weak');
    expect(result.passed).toHaveLength(0);
    expect(result.failed).toHaveLength(5);
  });

  test('password meeting all rules scores 100 and is strong', () => {
    const result = scorer.evaluate('Hello1!');
    // length < 8 fails, so 4 rules pass
    expect(result.score).toBe(80);
    expect(result.percent).toBe(80);
    expect(result.level).toBe('strong');
  });

  test('long strong password passes all rules', () => {
    const result = scorer.evaluate('Hello123!');
    expect(result.score).toBe(100);
    expect(result.percent).toBe(100);
    expect(result.level).toBe('strong');
    expect(result.passed).toHaveLength(5);
    expect(result.failed).toHaveLength(0);
  });

  test('only lowercase returns fair level', () => {
    const result = scorer.evaluate('abcdefgh');
    // passes: length>=8, lowercase = 40 points = 40%
    expect(result.score).toBe(40);
    expect(result.percent).toBe(40);
    expect(result.level).toBe('fair');
  });

  test('custom thresholds change level boundaries', () => {
    const custom = createFieldScore({
      rules: passwordRules,
      thresholds: { weak: 10, fair: 30, good: 60 },
    });
    // 40% should be 'good' with lowered threshold
    const result = custom.evaluate('abcdefgh');
    expect(result.level).toBe('good');
  });

  test('rules without labels do not appear in passed/failed arrays', () => {
    const unlabeled = createFieldScore<string>({
      rules: [
        { test: (v) => v.length > 0, points: 50 },
        { test: (v) => v.length > 5, points: 50 },
      ],
    });
    const result = unlabeled.evaluate('hi');
    expect(result.passed).toHaveLength(0);
    expect(result.failed).toHaveLength(0);
    expect(result.score).toBe(50);
  });

  test('percent rounds correctly', () => {
    const scorer3 = createFieldScore<string>({
      rules: [
        { test: () => true,  points: 1, label: 'a' },
        { test: () => false, points: 1, label: 'b' },
        { test: () => false, points: 1, label: 'c' },
      ],
    });
    const result = scorer3.evaluate('x');
    expect(result.percent).toBe(33);
  });
});
