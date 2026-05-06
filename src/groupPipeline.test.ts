import { runGroupPipeline } from './groupPipeline';
import { minLength } from './validators';
import { trim, lowercase } from './formatters';

const schema = {
  username: { validators: [minLength(3)] },
  email: {
    validators: [{
      validate: (v: unknown) => typeof v === 'string' && v.includes('@'),
      message: 'Invalid email',
    }],
  },
};

describe('runGroupPipeline', () => {
  it('validates without transforms', () => {
    const values = { username: 'alice', email: 'alice@example.com' };
    const { transformed, summary } = runGroupPipeline(values, schema);
    expect(summary.valid).toBe(true);
    expect(transformed.username).toBe('alice');
  });

  it('applies transforms before validation', () => {
    const values = { username: '  bob  ', email: 'BOB@EXAMPLE.COM' };
    const { transformed, summary } = runGroupPipeline(values, schema, {
      transforms: {
        username: [trim as any],
        email: [lowercase as any],
      },
    });
    expect(transformed.username).toBe('bob');
    expect(transformed.email).toBe('bob@example.com');
    expect(summary.valid).toBe(true);
  });

  it('fails validation after transform if still invalid', () => {
    const values = { username: '  ab  ', email: 'x@y.com' };
    const { summary } = runGroupPipeline(values, schema, {
      transforms: { username: [trim as any] },
    });
    expect(summary.valid).toBe(false);
    expect(summary.errors.username).toBeDefined();
  });

  it('does not mutate original values', () => {
    const values = { username: '  carol  ', email: 'carol@example.com' };
    runGroupPipeline(values, schema, {
      transforms: { username: [trim as any] },
    });
    expect(values.username).toBe('  carol  ');
  });
});
