import type { VerificationRequest, VerificationResult } from './shared.ts';

export const verifyAppleHouseholdUnlock = async (
  request: VerificationRequest
): Promise<VerificationResult> => {
  return {
    status: 'pending',
    message: `Apple verification stub accepted receipt evidence for household ${request.householdId}. App Store verification is the next backend slice.`,
  };
};
