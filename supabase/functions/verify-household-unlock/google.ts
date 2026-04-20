import type { VerificationRequest, VerificationResult } from './shared.ts';

export const verifyGoogleHouseholdUnlock = async (
  request: VerificationRequest
): Promise<VerificationResult> => {
  return {
    status: 'pending',
    message: `Google Play verification stub accepted purchase evidence for household ${request.householdId}. Play verification is the next backend slice.`,
  };
};
