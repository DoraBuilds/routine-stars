import { describe, expect, it } from 'vitest';
import {
  buildPendingEntitlementMutation,
  handleVerificationRequest,
  parseVerificationRequest,
} from '../../supabase/functions/verify-household-unlock/shared';

describe('verify-household-unlock function contract', () => {
  it('accepts a valid iOS verification request', () => {
    const request = {
      householdId: 'house-1',
      eventType: 'household_unlock_purchase_completed',
      verificationPayload: {
        platform: 'ios',
        appProductId: 'household_lifetime_unlock',
        storeProductId: 'routine_stars_household_unlock',
        sourceTransactionId: 'tx-1',
        sourceOriginalTransactionId: 'orig-1',
        receiptData: 'signed-receipt',
        purchaseToken: null,
      },
    };

    expect(parseVerificationRequest(request)).toEqual(request);
    expect(handleVerificationRequest(request)).toEqual({
      status: 200,
      body: expect.objectContaining({
        status: 'pending',
      }),
    });
  });

  it('rejects invalid payloads with a structured error response', () => {
    expect(handleVerificationRequest({ foo: 'bar' })).toEqual({
      status: 400,
      body: {
        status: 'error',
        message: 'Invalid billing verification request payload.',
      },
    });
  });

  it('requires Android requests to carry purchase evidence', () => {
    expect(
      parseVerificationRequest({
        householdId: 'house-1',
        eventType: 'household_unlock_restore_completed',
        verificationPayload: {
          platform: 'android',
          appProductId: 'household_lifetime_unlock',
          storeProductId: 'routine_stars_household_unlock',
          sourceTransactionId: null,
          sourceOriginalTransactionId: null,
          receiptData: null,
          purchaseToken: null,
        },
      })
    ).toBeNull();
  });

  it('builds a pending entitlement mutation for first-time verification requests', () => {
    const request = parseVerificationRequest({
      householdId: 'house-1',
      eventType: 'household_unlock_purchase_completed',
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

    expect(request).not.toBeNull();
    expect(buildPendingEntitlementMutation(request!, null, '2026-04-20T20:00:00Z')).toEqual({
      status: 'pending',
      platform: 'ios',
      store_product_id: 'routine_stars_household_unlock',
      source_transaction_id: 'tx-1',
      source_original_transaction_id: 'orig-1',
      granted_at: null,
      revoked_at: null,
      verification_checked_at: '2026-04-20T20:00:00Z',
    });
  });

  it('preserves active access when refreshing verification evidence for an already active household', () => {
    const request = parseVerificationRequest({
      householdId: 'house-1',
      eventType: 'household_unlock_restore_completed',
      verificationPayload: {
        platform: 'android',
        appProductId: 'household_lifetime_unlock',
        storeProductId: 'routine_stars_household_unlock',
        sourceTransactionId: 'tx-2',
        sourceOriginalTransactionId: 'orig-2',
        receiptData: null,
        purchaseToken: 'purchase-token',
      },
    });

    expect(request).not.toBeNull();
    expect(
      buildPendingEntitlementMutation(
        request!,
        {
          id: 'ent-1',
          household_id: 'house-1',
          status: 'active',
          platform: 'android',
          store_product_id: 'routine_stars_household_unlock',
          source_transaction_id: 'old-tx',
          source_original_transaction_id: 'old-orig',
          granted_at: '2026-04-19T10:00:00Z',
          revoked_at: null,
          verification_checked_at: '2026-04-19T10:00:00Z',
        },
        '2026-04-20T20:00:00Z'
      )
    ).toEqual({
      status: 'active',
      platform: 'android',
      store_product_id: 'routine_stars_household_unlock',
      source_transaction_id: 'tx-2',
      source_original_transaction_id: 'orig-2',
      granted_at: '2026-04-19T10:00:00Z',
      revoked_at: null,
      verification_checked_at: '2026-04-20T20:00:00Z',
    });
  });
});
