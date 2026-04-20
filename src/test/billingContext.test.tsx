import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BillingProvider, useBilling } from '@/lib/billing/billing-context';

const { purchaseHouseholdUnlock, restorePurchases, recordPurchaseEvent, getSupabaseClient, verifyHouseholdUnlock } = vi.hoisted(() => ({
  purchaseHouseholdUnlock: vi.fn(),
  restorePurchases: vi.fn(),
  recordPurchaseEvent: vi.fn(),
  getSupabaseClient: vi.fn(() => ({})),
  verifyHouseholdUnlock: vi.fn(),
}));

const authState = {
  status: 'signed_in',
  household: { id: 'house-1', name: 'Family' },
  retryHousehold: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: () => authState,
}));

vi.mock('@/lib/billing/create-billing-adapter', () => ({
  createBillingAdapter: () => ({
    getHouseholdUnlockProduct: () => ({
      id: 'household_lifetime_unlock',
      displayName: 'Routine Stars Household Unlock',
      description: 'One-time lifetime unlock for one household account.',
      priceLabel: 'EUR 9.99',
      platformProductIds: {
        ios: 'routine_stars_household_unlock',
        android: 'routine_stars_household_unlock',
      },
    }),
    purchaseHouseholdUnlock,
    restorePurchases,
  }),
}));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient,
}));

vi.mock('@/lib/data/supabase-household-entitlement-repository', () => ({
  SupabaseHouseholdEntitlementRepository: class {
    recordPurchaseEvent = recordPurchaseEvent;
  },
}));

vi.mock('@/lib/billing/verification-client', () => ({
  createBillingVerificationClient: () => ({
    verifyHouseholdUnlock,
  }),
}));

const Probe = () => {
  const billing = useBilling();

  return (
    <div>
      <div data-testid="price">{billing.householdUnlockProduct.priceLabel}</div>
      <button type="button" onClick={() => void billing.purchaseHouseholdUnlock()}>
        purchase
      </button>
      <button type="button" onClick={() => void billing.restorePurchases()}>
        restore
      </button>
    </div>
  );
};

describe('BillingProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.status = 'signed_in';
    authState.household = { id: 'house-1', name: 'Family' };
    purchaseHouseholdUnlock.mockResolvedValue({
      status: 'ready',
      source: 'native_bridge',
      message: 'Purchase completed.',
      platform: 'ios',
      storeProductId: 'routine_stars_household_unlock',
      sourceTransactionId: 'tx-1',
      sourceOriginalTransactionId: 'orig-1',
      verificationPayload: {
        platform: 'ios',
        appProductId: 'household_lifetime_unlock',
        storeProductId: 'routine_stars_household_unlock',
        sourceTransactionId: 'tx-1',
        sourceOriginalTransactionId: 'orig-1',
        receiptData: 'signed-receipt',
        purchaseToken: null,
      },
    });
    restorePurchases.mockResolvedValue({
      status: 'unsupported',
      source: 'fallback',
      message: 'Restore unavailable.',
      verificationPayload: null,
    });
    recordPurchaseEvent.mockResolvedValue({
      id: 'event-1',
    });
    verifyHouseholdUnlock.mockResolvedValue({
      status: 'pending',
      message: 'Verification queued.',
    });
  });

  it('records successful native purchases and refreshes household access', async () => {
    render(
      <BillingProvider>
        <Probe />
      </BillingProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'purchase' }));

    await waitFor(() => {
      expect(verifyHouseholdUnlock).toHaveBeenCalledWith({
        householdId: 'house-1',
        eventType: 'household_unlock_purchase_completed',
        verificationPayload: expect.objectContaining({
          platform: 'ios',
          receiptData: 'signed-receipt',
        }),
      });
      expect(recordPurchaseEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          householdId: 'house-1',
          platform: 'ios',
          eventType: 'household_unlock_purchase_completed',
          sourceTransactionId: 'tx-1',
          rawPayload: expect.objectContaining({
            verificationRequest: expect.objectContaining({
              householdId: 'house-1',
            }),
            verificationResponse: expect.objectContaining({
              status: 'pending',
            }),
            verificationPayload: expect.objectContaining({
              platform: 'ios',
              receiptData: 'signed-receipt',
            }),
          }),
        })
      );
      expect(authState.retryHousehold).toHaveBeenCalled();
    });
  });

  it('does not record fallback restore results', async () => {
    render(
      <BillingProvider>
        <Probe />
      </BillingProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'restore' }));

    await waitFor(() => {
      expect(restorePurchases).toHaveBeenCalled();
    });

    expect(recordPurchaseEvent).not.toHaveBeenCalled();
    expect(verifyHouseholdUnlock).not.toHaveBeenCalled();
    expect(authState.retryHousehold).not.toHaveBeenCalled();
  });
});
