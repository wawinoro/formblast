import {
  createVisibilityState,
  evaluateVisibility,
  isFieldVisible,
  filterHiddenErrors,
  getHiddenFieldKeys,
  getVisibleFieldKeys,
} from './fieldVisibility';

type FormValues = {
  accountType: string;
  companyName: string;
  vatNumber: string;
  personalId: string;
};

const rules = [
  {
    field: 'companyName' as const,
    condition: (v: FormValues) => v.accountType === 'business',
  },
  {
    field: 'vatNumber' as const,
    condition: (v: FormValues) => v.accountType === 'business',
  },
  {
    field: 'personalId' as const,
    condition: (v: FormValues) => v.accountType === 'personal',
  },
];

describe('createVisibilityState', () => {
  it('creates state with empty visible/hidden sets', () => {
    const state = createVisibilityState(rules);
    expect(state.visibleFields.size).toBe(0);
    expect(state.hiddenFields.size).toBe(0);
    expect(state.rules).toHaveLength(3);
  });
});

describe('evaluateVisibility', () => {
  it('marks business fields visible when accountType is business', () => {
    const state = createVisibilityState(rules);
    const values: FormValues = { accountType: 'business', companyName: '', vatNumber: '', personalId: '' };
    const updated = evaluateVisibility(state, values);
    expect(updated.visibleFields.has('companyName')).toBe(true);
    expect(updated.visibleFields.has('vatNumber')).toBe(true);
    expect(updated.hiddenFields.has('personalId')).toBe(true);
  });

  it('marks personal field visible when accountType is personal', () => {
    const state = createVisibilityState(rules);
    const values: FormValues = { accountType: 'personal', companyName: '', vatNumber: '', personalId: '' };
    const updated = evaluateVisibility(state, values);
    expect(updated.visibleFields.has('personalId')).toBe(true);
    expect(updated.hiddenFields.has('companyName')).toBe(true);
    expect(updated.hiddenFields.has('vatNumber')).toBe(true);
  });
});

describe('isFieldVisible', () => {
  it('returns false for hidden fields', () => {
    const state = createVisibilityState(rules);
    const values: FormValues = { accountType: 'personal', companyName: '', vatNumber: '', personalId: '' };
    const updated = evaluateVisibility(state, values);
    expect(isFieldVisible(updated, 'companyName')).toBe(false);
  });

  it('returns true for fields not referenced by any rule', () => {
    const state = createVisibilityState(rules);
    const values: FormValues = { accountType: 'personal', companyName: '', vatNumber: '', personalId: '' };
    const updated = evaluateVisibility(state, values);
    expect(isFieldVisible(updated, 'accountType')).toBe(true);
  });
});

describe('filterHiddenErrors', () => {
  it('removes errors for hidden fields', () => {
    const state = createVisibilityState(rules);
    const values: FormValues = { accountType: 'personal', companyName: '', vatNumber: '', personalId: '' };
    const updated = evaluateVisibility(state, values);
    const errors = { companyName: 'Required', vatNumber: 'Required', personalId: 'Required' };
    const filtered = filterHiddenErrors(updated, errors);
    expect(filtered.companyName).toBeUndefined();
    expect(filtered.vatNumber).toBeUndefined();
    expect(filtered.personalId).toBe('Required');
  });
});

describe('getHiddenFieldKeys / getVisibleFieldKeys', () => {
  it('returns correct arrays', () => {
    const state = createVisibilityState(rules);
    const values: FormValues = { accountType: 'business', companyName: '', vatNumber: '', personalId: '' };
    const updated = evaluateVisibility(state, values);
    expect(getVisibleFieldKeys(updated)).toEqual(expect.arrayContaining(['companyName', 'vatNumber']));
    expect(getHiddenFieldKeys(updated)).toEqual(['personalId']);
  });
});
