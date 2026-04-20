import { HOUSEHOLD_LIFETIME_UNLOCK } from './config';
import type { BillingAdapter } from './types';

export const createDefaultBillingAdapter = (): BillingAdapter => ({
  getHouseholdUnlockProduct: () => HOUSEHOLD_LIFETIME_UNLOCK,
  purchaseHouseholdUnlock: async () => {
    return {
      status: 'unsupported',
      message:
        'Native store billing is not connected in this build yet. The purchase button is wired and ready for the next integration slice.',
      source: 'fallback',
    };
  },
  restorePurchases: async () => {
    return {
      status: 'unsupported',
      message:
        'Restore purchases is not connected in this browser build yet. The restore entry point is ready for the native billing integration slice.',
      source: 'fallback',
    };
  },
});
