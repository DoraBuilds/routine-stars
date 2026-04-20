import type { BillingProduct } from './config';
import type { BillingPlatform } from '@/lib/data/models';

export interface BillingActionResult {
  status: 'ready' | 'unsupported' | 'error' | 'cancelled';
  message: string;
  source: 'native_bridge' | 'fallback';
  platform?: BillingPlatform;
  storeProductId?: string | null;
  sourceTransactionId?: string | null;
  sourceOriginalTransactionId?: string | null;
}

export interface BillingAdapter {
  getHouseholdUnlockProduct(): BillingProduct;
  purchaseHouseholdUnlock(): Promise<BillingActionResult>;
  restorePurchases(): Promise<BillingActionResult>;
}
