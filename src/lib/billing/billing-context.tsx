import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { createBillingAdapter } from './create-billing-adapter';
import type { BillingActionResult } from './types';
import { useAuth } from '@/lib/auth/use-auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SupabaseHouseholdEntitlementRepository } from '@/lib/data/supabase-household-entitlement-repository';

interface BillingContextValue {
  householdUnlockProduct: ReturnType<ReturnType<typeof createBillingAdapter>['getHouseholdUnlockProduct']>;
  isProcessing: boolean;
  purchaseHouseholdUnlock: () => Promise<BillingActionResult>;
  restorePurchases: () => Promise<BillingActionResult>;
}

const BillingContext = createContext<BillingContextValue | null>(null);

export const BillingProvider = ({ children }: PropsWithChildren) => {
  const adapter = useMemo(() => createBillingAdapter(), []);
  const { household, retryHousehold, status: authStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const persistSuccessfulBillingResult = async (
    result: BillingActionResult,
    eventType: string
  ) => {
    if (
      result.status !== 'ready' ||
      result.source !== 'native_bridge' ||
      !household ||
      authStatus !== 'signed_in'
    ) {
      return result;
    }

    const supabase = getSupabaseClient();
    if (!supabase || !result.platform) {
      return result;
    }

    const repository = new SupabaseHouseholdEntitlementRepository(supabase);

    await repository.recordPurchaseEvent({
      id: crypto.randomUUID(),
      householdId: household.id,
      platform: result.platform,
      eventType,
      storeProductId: result.storeProductId ?? null,
      sourceTransactionId: result.sourceTransactionId ?? null,
      sourceOriginalTransactionId: result.sourceOriginalTransactionId ?? null,
      amountMinor: null,
      currency: null,
      rawPayload: {
        result,
        verificationPayload: result.verificationPayload ?? null,
      },
      occurredAt: new Date().toISOString(),
    });

    await retryHousehold();

    return {
      ...result,
      message: `${result.message} Household access was refreshed just now.`,
    } satisfies BillingActionResult;
  };

  const value = useMemo<BillingContextValue>(
    () => ({
      householdUnlockProduct: adapter.getHouseholdUnlockProduct(),
      isProcessing,
      purchaseHouseholdUnlock: async () => {
        setIsProcessing(true);
        try {
          const result = await adapter.purchaseHouseholdUnlock();
          return await persistSuccessfulBillingResult(result, 'household_unlock_purchase_completed');
        } finally {
          setIsProcessing(false);
        }
      },
      restorePurchases: async () => {
        setIsProcessing(true);
        try {
          const result = await adapter.restorePurchases();
          return await persistSuccessfulBillingResult(result, 'household_unlock_restore_completed');
        } finally {
          setIsProcessing(false);
        }
      },
    }),
    [adapter, authStatus, household, isProcessing, retryHousehold]
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
