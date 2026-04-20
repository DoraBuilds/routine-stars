import type { BillingPlatform } from '@/lib/data/models';
import type { BillingActionResult, BillingAdapter } from './types';
import { HOUSEHOLD_LIFETIME_UNLOCK } from './config';

export interface NativeBillingBridgeResult {
  status: 'ready' | 'error' | 'cancelled';
  message?: string;
  platform?: BillingPlatform;
  storeProductId?: string | null;
  sourceTransactionId?: string | null;
  sourceOriginalTransactionId?: string | null;
}

export interface NativeBillingBridge {
  purchaseHouseholdUnlock(input: {
    appProductId: string;
    iosProductId: string;
    androidProductId: string;
  }): Promise<NativeBillingBridgeResult>;
  restorePurchases(input: {
    appProductId: string;
    iosProductId: string;
    androidProductId: string;
  }): Promise<NativeBillingBridgeResult>;
}

declare global {
  interface Window {
    RoutineStarsBilling?: NativeBillingBridge;
    Capacitor?: {
      Plugins?: {
        RoutineStarsBilling?: NativeBillingBridge;
      };
    };
  }
}

const toBillingActionResult = (
  result: NativeBillingBridgeResult,
  fallbackMessage: string
): BillingActionResult => ({
  status: result.status,
  message: result.message ?? fallbackMessage,
  source: 'native_bridge',
  platform: result.platform,
  storeProductId: result.storeProductId ?? null,
  sourceTransactionId: result.sourceTransactionId ?? null,
  sourceOriginalTransactionId: result.sourceOriginalTransactionId ?? null,
});

export const getNativeBillingBridge = (): NativeBillingBridge | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    window.RoutineStarsBilling ??
    window.Capacitor?.Plugins?.RoutineStarsBilling ??
    null
  );
};

export const createNativeBillingAdapter = (bridge: NativeBillingBridge): BillingAdapter => ({
  getHouseholdUnlockProduct: () => HOUSEHOLD_LIFETIME_UNLOCK,
  purchaseHouseholdUnlock: async () =>
    toBillingActionResult(
      await bridge.purchaseHouseholdUnlock({
        appProductId: HOUSEHOLD_LIFETIME_UNLOCK.id,
        iosProductId: HOUSEHOLD_LIFETIME_UNLOCK.platformProductIds.ios,
        androidProductId: HOUSEHOLD_LIFETIME_UNLOCK.platformProductIds.android,
      }),
      'The native purchase flow returned without a message.'
    ),
  restorePurchases: async () =>
    toBillingActionResult(
      await bridge.restorePurchases({
        appProductId: HOUSEHOLD_LIFETIME_UNLOCK.id,
        iosProductId: HOUSEHOLD_LIFETIME_UNLOCK.platformProductIds.ios,
        androidProductId: HOUSEHOLD_LIFETIME_UNLOCK.platformProductIds.android,
      }),
      'The native restore flow returned without a message.'
    ),
});
