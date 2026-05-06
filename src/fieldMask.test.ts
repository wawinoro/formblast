import { applyMask, stripMask, createMaskedField, MaskOptions } from './fieldMask';

describe('applyMask', () => {
  const phoneMask: MaskOptions = { pattern: '(999) 999-9999' };

  it('applies phone mask to digits', () => {
    expect(applyMask('1234567890', phoneMask)).toBe('(123) 456-7890');
  });

  it('uses placeholder for missing characters', () => {
    expect(applyMask('123', phoneMask)).toBe('(123) ___-____');
  });

  it('uses custom placeholder', () => {
    const opts: MaskOptions = { pattern: '999-9999', placeholder: '#' };
    expect(applyMask('123', opts)).toBe('123-####');
  });

  it('skips non-matching characters', () => {
    const opts: MaskOptions = { pattern: '99/99/9999' };
    expect(applyMask('12345678', opts)).toBe('12/34/5678');
  });

  it('handles alphanumeric mask', () => {
    const opts: MaskOptions = { pattern: 'aaa-999' };
    expect(applyMask('abc123', opts)).toBe('abc-123');
  });

  it('handles wildcard mask', () => {
    const opts: MaskOptions = { pattern: '***-***' };
    expect(applyMask('abc123', opts)).toBe('abc-123');
  });

  it('returns placeholder-filled pattern for empty string', () => {
    expect(applyMask('', phoneMask)).toBe('(___) ___-____');
  });
});

describe('stripMask', () => {
  it('strips mask and returns raw digits', () => {
    const opts: MaskOptions = { pattern: '(999) 999-9999' };
    expect(stripMask('(123) 456-7890', opts)).toBe('1234567890');
  });

  it('strips date mask', () => {
    const opts: MaskOptions = { pattern: '99/99/9999' };
    expect(stripMask('12/34/5678', opts)).toBe('12345678');
  });

  it('returns empty string for empty input', () => {
    const opts: MaskOptions = { pattern: '999' };
    expect(stripMask('', opts)).toBe('');
  });
});

describe('createMaskedField', () => {
  it('attaches mask options to schema field', () => {
    const schema = { phone: { required: true } };
    const opts: MaskOptions = { pattern: '(999) 999-9999' };
    const result = createMaskedField<{ phone: string }>('phone', opts)(schema as any);
    expect((result.phone as any).mask).toEqual(opts);
  });

  it('preserves existing field properties', () => {
    const schema = { email: { required: true, label: 'Email' } };
    const opts: MaskOptions = { pattern: '***@***.***' };
    const result = createMaskedField<{ email: string }>('email', opts)(schema as any);
    expect((result.email as any).required).toBe(true);
    expect((result.email as any).label).toBe('Email');
  });

  it('preserves other schema fields', () => {
    const schema = { name: { required: true }, phone: { required: false } };
    const opts: MaskOptions = { pattern: '(999) 999-9999' };
    const result = createMaskedField<{ name: string; phone: string }>('phone', opts)(schema as any);
    expect(result.name).toEqual({ required: true });
  });
});
