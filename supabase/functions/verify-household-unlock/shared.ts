export interface VerificationPayload {
  platform: 'ios' | 'android';
  appProductId: string;
  storeProductId: string | null;
  sourceTransactionId: string | null;
  sourceOriginalTransactionId: string | null;
  receiptData: string | null;
  purchaseToken: string | null;
}

export interface VerificationRequest {
  householdId: string;
  eventType: string;
  verificationPayload: VerificationPayload;
}

export interface VerificationResult {
  status: 'verified' | 'pending' | 'unsupported' | 'error';
  message: string;
}

export interface ExistingEntitlementSnapshot {
  id: string;
  household_id: string;
  status: 'active' | 'pending' | 'revoked';
  platform: 'ios' | 'android' | 'web' | null;
  store_product_id: string | null;
  source_transaction_id: string | null;
  source_original_transaction_id: string | null;
  granted_at: string | null;
  revoked_at: string | null;
  verification_checked_at: string | null;
}

export interface PendingEntitlementMutation {
  status: 'active' | 'pending';
  platform: 'ios' | 'android';
  store_product_id: string | null;
  source_transaction_id: string | null;
  source_original_transaction_id: string | null;
  granted_at: string | null;
  revoked_at: null;
  verification_checked_at: string;
}

export interface VerificationHttpResponse {
  status: number;
  body: VerificationResult;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isVerificationPayload = (value: unknown): value is VerificationPayload => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;
  const platform = payload.platform;

  if (platform !== 'ios' && platform !== 'android') {
    return false;
  }

  if (!isNonEmptyString(payload.appProductId)) {
    return false;
  }

  if (
    platform === 'ios' &&
    !isNonEmptyString(payload.receiptData) &&
    !isNonEmptyString(payload.sourceTransactionId)
  ) {
    return false;
  }

  if (
    platform === 'android' &&
    !isNonEmptyString(payload.purchaseToken) &&
    !isNonEmptyString(payload.sourceTransactionId)
  ) {
    return false;
  }

  return true;
};

export const parseVerificationRequest = (input: unknown): VerificationRequest | null => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const request = input as Record<string, unknown>;
  if (!isNonEmptyString(request.householdId) || !isNonEmptyString(request.eventType)) {
    return null;
  }

  if (!isVerificationPayload(request.verificationPayload)) {
    return null;
  }

  return {
    householdId: request.householdId,
    eventType: request.eventType,
    verificationPayload: request.verificationPayload,
  };
};

export const handleVerificationRequest = (input: unknown): VerificationHttpResponse => {
  const request = parseVerificationRequest(input);
  if (!request) {
    return {
      status: 400,
      body: {
        status: 'error',
        message: 'Invalid billing verification request payload.',
      },
    };
  }

  return {
    status: 200,
    body: {
      status: 'pending',
      message: `Verification stub accepted ${request.verificationPayload.platform} evidence for household ${request.householdId}. Real store verification is the next backend slice.`,
    },
  };
};

export const buildPendingEntitlementMutation = (
  request: VerificationRequest,
  existingEntitlement: ExistingEntitlementSnapshot | null,
  nowIso: string
): PendingEntitlementMutation => ({
  status: existingEntitlement?.status === 'active' ? 'active' : 'pending',
  platform: request.verificationPayload.platform,
  store_product_id: request.verificationPayload.storeProductId,
  source_transaction_id: request.verificationPayload.sourceTransactionId,
  source_original_transaction_id: request.verificationPayload.sourceOriginalTransactionId,
  granted_at: existingEntitlement?.status === 'active' ? existingEntitlement.granted_at : null,
  revoked_at: null,
  verification_checked_at: nowIso,
});
