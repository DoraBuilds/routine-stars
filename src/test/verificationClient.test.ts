import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BILLING_VERIFICATION_FUNCTION,
  createBillingVerificationClient,
} from '@/lib/billing/verification-client';

const { getSupabaseClient, invoke } = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  invoke: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient,
}));

const request = {
  householdId: 'house-1',
  eventType: 'household_unlock_purchase_completed',
  verificationPayload: {
    platform: 'ios' as const,
    appProductId: 'household_lifetime_unlock',
    storeProductId: 'routine_stars_household_unlock',
    sourceTransactionId: 'tx-1',
    sourceOriginalTransactionId: 'orig-1',
    receiptData: 'signed-receipt',
    purchaseToken: null,
  },
};

describe('createBillingVerificationClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns unsupported when Supabase is unavailable', async () => {
    getSupabaseClient.mockReturnValue(null);

    await expect(createBillingVerificationClient().verifyHouseholdUnlock(request)).resolves.toEqual(
      expect.objectContaining({
        status: 'unsupported',
      })
    );
  });

  it('invokes the verification edge function when available', async () => {
    invoke.mockResolvedValue({
      data: {
        status: 'pending',
        message: 'Verification queued.',
      },
      error: null,
    });
    getSupabaseClient.mockReturnValue({
      functions: {
        invoke,
      },
    });

    await expect(createBillingVerificationClient().verifyHouseholdUnlock(request)).resolves.toEqual({
      status: 'pending',
      message: 'Verification queued.',
    });

    expect(invoke).toHaveBeenCalledWith(BILLING_VERIFICATION_FUNCTION, {
      body: request,
    });
  });

  it('normalizes function errors into an error response', async () => {
    invoke.mockResolvedValue({
      data: null,
      error: {
        message: 'Function not deployed.',
      },
    });
    getSupabaseClient.mockReturnValue({
      functions: {
        invoke,
      },
    });

    await expect(createBillingVerificationClient().verifyHouseholdUnlock(request)).resolves.toEqual({
      status: 'error',
      message: 'Function not deployed.',
    });
  });
});
