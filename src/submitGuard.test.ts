import { createSubmitGuard } from './submitGuard';

interface LoginForm {
  email: string;
  password: string;
}

const fields: (keyof LoginForm)[] = ['email', 'password'];

const makeValidate = (fail = false) =>
  (values: LoginForm): Record<string, string | null> => ({
    email: !values.email || fail ? 'Email required' : null,
    password: !values.password || fail ? 'Password required' : null,
  });

describe('createSubmitGuard', () => {
  it('should not submit when validation fails', async () => {
    const onSubmit = jest.fn();
    const guard = createSubmitGuard<LoginForm>(fields, {
      onSubmit,
      validate: makeValidate(true),
    });
    await guard.handleSubmit({ email: '', password: '' });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(guard.submitCount).toBe(0);
  });

  it('should submit when validation passes', async () => {
    const onSubmit = jest.fn();
    const guard = createSubmitGuard<LoginForm>(fields, {
      onSubmit,
      validate: makeValidate(false),
    });
    await guard.handleSubmit({ email: 'a@b.com', password: 'secret' });
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret' });
    expect(guard.submitCount).toBe(1);
  });

  it('canSubmit returns false when there are errors', () => {
    const guard = createSubmitGuard<LoginForm>(fields, {
      onSubmit: jest.fn(),
      validate: makeValidate(true),
    });
    expect(guard.canSubmit({ email: '', password: '' })).toBe(false);
  });

  it('canSubmit returns true when no errors', () => {
    const guard = createSubmitGuard<LoginForm>(fields, {
      onSubmit: jest.fn(),
      validate: makeValidate(false),
    });
    expect(guard.canSubmit({ email: 'a@b.com', password: 'secret' })).toBe(true);
  });

  it('sets errors on failed submit', async () => {
    const guard = createSubmitGuard<LoginForm>(fields, {
      onSubmit: jest.fn(),
      validate: makeValidate(true),
    });
    await guard.handleSubmit({ email: '', password: '' });
    expect(guard.errors.email).toBe('Email required');
    expect(guard.errors.password).toBe('Password required');
  });

  it('reset clears state', async () => {
    const onSubmit = jest.fn();
    const guard = createSubmitGuard<LoginForm>(fields, {
      onSubmit,
      validate: makeValidate(false),
    });
    await guard.handleSubmit({ email: 'a@b.com', password: 'secret' });
    expect(guard.submitCount).toBe(1);
    guard.reset();
    expect(guard.submitCount).toBe(0);
    expect(guard.errors).toEqual({});
  });

  it('increments submitCount on each successful submit', async () => {
    const guard = createSubmitGuard<LoginForm>(fields, {
      onSubmit: jest.fn(),
      validate: makeValidate(false),
    });
    await guard.handleSubmit({ email: 'a@b.com', password: 'secret' });
    await guard.handleSubmit({ email: 'a@b.com', password: 'secret' });
    expect(guard.submitCount).toBe(2);
  });
});
