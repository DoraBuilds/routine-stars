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
