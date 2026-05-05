import { validateForm, isFormValid, getFormErrors } from './schema';
import { minLength, maxLength, pattern } from './validators';
import { FormSchema } from './types';

interface LoginForm {
  username: string;
  email: string;
  password: string;
}

const loginSchema: FormSchema<LoginForm> = {
  username: {
    validators: [minLength(3), maxLength(20)],
    required: true,
    requiredMessage: 'Username is required',
  },
  email: {
    validators: [pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')],
    required: true,
  },
  password: {
    validators: [minLength(8)],
    required: true,
    requiredMessage: 'Password is required',
  },
};

describe('validateForm', () => {
  it('returns valid results for a correct form', () => {
    const data: LoginForm = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'securepass123',
    };
    const result = validateForm(data, loginSchema);
    expect(result.username.valid).toBe(true);
    expect(result.email.valid).toBe(true);
    expect(result.password.valid).toBe(true);
  });

  it('returns errors for invalid fields', () => {
    const data: LoginForm = {
      username: 'ab',
      email: 'not-an-email',
      password: 'short',
    };
    const result = validateForm(data, loginSchema);
    expect(result.username.valid).toBe(false);
    expect(result.email.valid).toBe(false);
    expect(result.password.valid).toBe(false);
  });

  it('flags required fields when empty', () => {
    const data: LoginForm = { username: '', email: '', password: '' };
    const result = validateForm(data, loginSchema);
    expect(result.username.valid).toBe(false);
    expect(result.username.errors).toContain('Username is required');
  });
});

describe('isFormValid', () => {
  it('returns true when all fields are valid', () => {
    const data: LoginForm = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'securepass123',
    };
    const result = validateForm(data, loginSchema);
    expect(isFormValid(result)).toBe(true);
  });

  it('returns false when any field is invalid', () => {
    const data: LoginForm = {
      username: 'ab',
      email: 'john@example.com',
      password: 'securepass123',
    };
    const result = validateForm(data, loginSchema);
    expect(isFormValid(result)).toBe(false);
  });
});

describe('getFormErrors', () => {
  it('returns first error per invalid field', () => {
    const data: LoginForm = { username: 'ab', email: 'bad', password: 'ok12345' };
    const result = validateForm(data, loginSchema);
    const errors = getFormErrors(result);
    expect(errors.username).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeUndefined();
  });
});
