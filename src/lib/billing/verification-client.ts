import type { BillingVerificationPayload } from './types';

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

export const createBillingVerificationClient = (): BillingVerificationClient => ({
  verifyHouseholdUnlock: async (_request) => ({
    status: 'unsupported',
    message:
      'Backend verification is not connected in this build yet. The app captured the store evidence and is ready for the next server integration slice.',
  }),
});
