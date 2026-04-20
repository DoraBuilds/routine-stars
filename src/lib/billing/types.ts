import type { BillingProduct } from './config';
import type { BillingPlatform } from '@/lib/data/models';

export interface BillingVerificationPayload {
  platform: Extract<BillingPlatform, 'ios' | 'android'>;
  appProductId: string;
  storeProductId: string | null;
  sourceTransactionId: string | null;
  sourceOriginalTransactionId: string | null;
  receiptData: string | null;
  purchaseToken: string | null;
}

export interface BillingActionResult {
  status: 'ready' | 'unsupported' | 'error' | 'cancelled';
  message: string;
  source: 'native_bridge' | 'fallback';
  platform?: BillingPlatform;
  storeProductId?: string | null;
  sourceTransactionId?: string | null;
  sourceOriginalTransactionId?: string | null;
  verificationPayload?: BillingVerificationPayload | null;
}

export interface BillingAdapter {
  getHouseholdUnlockProduct(): BillingProduct;
  purchaseHouseholdUnlock(): Promise<BillingActionResult>;
  restorePurchases(): Promise<BillingActionResult>;
}
