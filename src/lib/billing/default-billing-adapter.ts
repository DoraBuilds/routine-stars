import { HOUSEHOLD_LIFETIME_UNLOCK } from './config';
import type { BillingAdapter } from './types';

const isNativeStoreRuntimeAvailable = () =>
  typeof window !== 'undefined' &&
  'Capacitor' in window;

export const createDefaultBillingAdapter = (): BillingAdapter => ({
  getHouseholdUnlockProduct: () => HOUSEHOLD_LIFETIME_UNLOCK,
  purchaseHouseholdUnlock: async () => {
    if (!isNativeStoreRuntimeAvailable()) {
      return {
        status: 'unsupported',
        message:
          'Native store billing is not connected in this build yet. The purchase button is wired and ready for the next integration slice.',
      };
    }

    return {
      status: 'ready',
      message:
        'Native billing runtime detected. The next slice will connect this button to the Apple and Google purchase SDKs.',
    };
  },
  restorePurchases: async () => {
    if (!isNativeStoreRuntimeAvailable()) {
      return {
        status: 'unsupported',
        message:
          'Restore purchases is not connected in this browser build yet. The restore entry point is ready for the native billing integration slice.',
      };
    }

    return {
      status: 'ready',
      message:
        'Native billing runtime detected. The next slice will connect this restore flow to Apple and Google purchase restoration.',
    };
  },
});
