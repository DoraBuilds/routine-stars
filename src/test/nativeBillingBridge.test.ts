import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBillingAdapter } from '@/lib/billing/create-billing-adapter';
import { getNativeBillingBridge } from '@/lib/billing/native-billing-bridge';

describe('native billing bridge', () => {
  afterEach(() => {
    delete window.RoutineStarsBilling;
    delete window.Capacitor;
  });

  it('returns null when no native billing bridge is present', () => {
    expect(getNativeBillingBridge()).toBeNull();
  });

  it('selects the window bridge when present and normalizes purchase results', async () => {
    window.RoutineStarsBilling = {
      purchaseHouseholdUnlock: vi.fn().mockResolvedValue({
        status: 'ready',
        message: 'Purchase completed.',
        platform: 'ios',
        storeProductId: 'routine_stars_household_unlock',
        sourceTransactionId: 'tx-1',
        sourceOriginalTransactionId: 'orig-1',
      }),
      restorePurchases: vi.fn().mockResolvedValue({
        status: 'ready',
        message: 'Purchases restored.',
        platform: 'ios',
      }),
    };

    const adapter = createBillingAdapter();
    const result = await adapter.purchaseHouseholdUnlock();

    expect(window.RoutineStarsBilling.purchaseHouseholdUnlock).toHaveBeenCalledWith({
      appProductId: 'household_lifetime_unlock',
      iosProductId: 'routine_stars_household_unlock',
      androidProductId: 'routine_stars_household_unlock',
    });
    expect(result).toEqual(
      expect.objectContaining({
        status: 'ready',
        source: 'native_bridge',
        platform: 'ios',
        storeProductId: 'routine_stars_household_unlock',
        sourceTransactionId: 'tx-1',
      })
    );
  });

  it('falls back to the Capacitor plugin bridge when present', async () => {
    window.Capacitor = {
      Plugins: {
        RoutineStarsBilling: {
          purchaseHouseholdUnlock: vi.fn().mockResolvedValue({
            status: 'cancelled',
            message: 'Purchase cancelled.',
            platform: 'android',
          }),
          restorePurchases: vi.fn().mockResolvedValue({
            status: 'ready',
            message: 'Restore completed.',
            platform: 'android',
          }),
        },
      },
    };

    const adapter = createBillingAdapter();
    const result = await adapter.restorePurchases();

    expect(window.Capacitor.Plugins.RoutineStarsBilling.restorePurchases).toHaveBeenCalledWith({
      appProductId: 'household_lifetime_unlock',
      iosProductId: 'routine_stars_household_unlock',
      androidProductId: 'routine_stars_household_unlock',
    });
    expect(result).toEqual(
      expect.objectContaining({
        status: 'ready',
        source: 'native_bridge',
        platform: 'android',
      })
    );
  });
});
