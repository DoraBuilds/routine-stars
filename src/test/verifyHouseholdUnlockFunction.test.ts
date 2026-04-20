import { describe, expect, it } from 'vitest';
import {
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
});
