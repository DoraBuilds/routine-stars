import { describe, expect, it } from 'vitest';
import { createDefaultBillingAdapter } from '@/lib/billing/default-billing-adapter';

describe('createDefaultBillingAdapter', () => {
  it('returns the household unlock product config', () => {
    const adapter = createDefaultBillingAdapter();

    expect(adapter.getHouseholdUnlockProduct()).toEqual(
      expect.objectContaining({
        id: 'household_lifetime_unlock',
        priceLabel: 'EUR 9.99',
      })
    );
  });

  it('gracefully reports unsupported purchase and restore flows in the browser build', async () => {
    const adapter = createDefaultBillingAdapter();

    await expect(adapter.purchaseHouseholdUnlock()).resolves.toEqual(
      expect.objectContaining({
        status: 'unsupported',
      })
    );

    await expect(adapter.restorePurchases()).resolves.toEqual(
      expect.objectContaining({
        status: 'unsupported',
      })
    );
  });
});
