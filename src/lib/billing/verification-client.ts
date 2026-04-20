import type { BillingVerificationPayload } from './types';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface BillingVerificationRequest {
  householdId: string;
  eventType: string;
  verificationPayload: BillingVerificationPayload;
}

export interface BillingVerificationResponse {
  status: 'verified' | 'pending' | 'unsupported' | 'error';
  message: string;
}

export interface BillingVerificationClient {
  verifyHouseholdUnlock(request: BillingVerificationRequest): Promise<BillingVerificationResponse>;
}

export const BILLING_VERIFICATION_FUNCTION = 'verify-household-unlock';

export const createBillingVerificationClient = (): BillingVerificationClient => ({
  verifyHouseholdUnlock: async (request) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        status: 'unsupported',
        message:
          'Supabase is not connected in this build yet, so backend billing verification is unavailable.',
      };
    }

    if (!('functions' in supabase) || !supabase.functions?.invoke) {
      return {
        status: 'unsupported',
        message:
          'Supabase Edge Functions are not available in this runtime yet. The verification request is ready for the next backend slice.',
      };
    }

    const { data, error } = await supabase.functions.invoke(BILLING_VERIFICATION_FUNCTION, {
      body: request,
    });

    if (error) {
      return {
        status: 'error',
        message: error.message || 'Billing verification failed before the backend could confirm the purchase.',
      };
    }

    return {
      status:
        data?.status === 'verified' ||
        data?.status === 'pending' ||
        data?.status === 'unsupported' ||
        data?.status === 'error'
          ? data.status
          : 'error',
      message:
        typeof data?.message === 'string'
          ? data.message
          : 'Billing verification returned without a message.',
    };
  },
});
