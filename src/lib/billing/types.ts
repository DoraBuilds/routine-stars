import type { BillingProduct } from './config';

export interface BillingActionResult {
  status: 'ready' | 'unsupported' | 'error';
  message: string;
}

export interface BillingAdapter {
  getHouseholdUnlockProduct(): BillingProduct;
  purchaseHouseholdUnlock(): Promise<BillingActionResult>;
  restorePurchases(): Promise<BillingActionResult>;
}
