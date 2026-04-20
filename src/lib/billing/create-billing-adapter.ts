import type { BillingAdapter } from './types';
import { createDefaultBillingAdapter } from './default-billing-adapter';
import { createNativeBillingAdapter, getNativeBillingBridge } from './native-billing-bridge';

export const createBillingAdapter = (): BillingAdapter => {
  const nativeBridge = getNativeBillingBridge();
  if (nativeBridge) {
    return createNativeBillingAdapter(nativeBridge);
  }

  return createDefaultBillingAdapter();
};
