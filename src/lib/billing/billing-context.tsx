import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { createDefaultBillingAdapter } from './default-billing-adapter';
import type { BillingActionResult } from './types';

interface BillingContextValue {
  householdUnlockProduct: ReturnType<ReturnType<typeof createDefaultBillingAdapter>['getHouseholdUnlockProduct']>;
  isProcessing: boolean;
  purchaseHouseholdUnlock: () => Promise<BillingActionResult>;
  restorePurchases: () => Promise<BillingActionResult>;
}

const BillingContext = createContext<BillingContextValue | null>(null);

export const BillingProvider = ({ children }: PropsWithChildren) => {
  const adapter = useMemo(() => createDefaultBillingAdapter(), []);
  const [isProcessing, setIsProcessing] = useState(false);

  const value = useMemo<BillingContextValue>(
    () => ({
      householdUnlockProduct: adapter.getHouseholdUnlockProduct(),
      isProcessing,
      purchaseHouseholdUnlock: async () => {
        setIsProcessing(true);
        try {
          return await adapter.purchaseHouseholdUnlock();
        } finally {
          setIsProcessing(false);
        }
      },
      restorePurchases: async () => {
        setIsProcessing(true);
        try {
          return await adapter.restorePurchases();
        } finally {
          setIsProcessing(false);
        }
      },
    }),
    [adapter, isProcessing]
  );

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used inside BillingProvider');
  }

  return context;
};
