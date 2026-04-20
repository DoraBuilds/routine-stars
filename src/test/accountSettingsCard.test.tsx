import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountSettingsCard } from '@/components/AccountSettingsCard';

const sendEmailLink = vi.fn();
const signOut = vi.fn();
const clearError = vi.fn();
const retryHousehold = vi.fn();
const purchaseHouseholdUnlock = vi.fn();
const restorePurchases = vi.fn();
const authState = {
  configured: true,
  status: 'signed_out',
  user: null,
  householdStatus: 'idle',
  household: null,
  entitlementStatus: 'idle',
  householdEntitlement: null,
  error: null,
  clearError,
  sendEmailLink,
  retryHousehold,
  signOut,
};

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: () => authState,
}));

vi.mock('@/lib/billing/billing-context', () => ({
  useBilling: () => ({
    householdUnlockProduct: {
      priceLabel: 'EUR 9.99',
    },
    isProcessing: false,
    purchaseHouseholdUnlock,
    restorePurchases,
  }),
}));

describe('AccountSettingsCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.configured = true;
    authState.status = 'signed_out';
    authState.user = null;
    authState.householdStatus = 'idle';
    authState.household = null;
    authState.entitlementStatus = 'idle';
    authState.householdEntitlement = null;
    authState.error = null;
    sendEmailLink.mockResolvedValue(true);
    purchaseHouseholdUnlock.mockResolvedValue({
      status: 'unsupported',
      message: 'Billing unavailable in this build.',
    });
    restorePurchases.mockResolvedValue({
      status: 'unsupported',
      message: 'Restore unavailable in this build.',
    });
  });

  it('uses email link copy instead of password fields', () => {
    render(<AccountSettingsCard />);

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByRole('button', { name: /email me a sign-up link/i })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/at least 6 characters/i)).toBeNull();
  });

  it('shows a success message after sending the sign-up link', async () => {
    render(<AccountSettingsCard />);

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    fireEvent.change(screen.getByPlaceholderText(/parent@example.com/i), {
      target: { value: 'parent@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /email me a sign-up link/i }));

    await waitFor(() => {
      expect(sendEmailLink).toHaveBeenCalledWith('parent@example.com', 'signup');
    });

    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    expect(screen.getByText(/parent@example.com/i)).toBeInTheDocument();
  });

  it('shows unpaid access copy for a signed-in household without an entitlement yet', () => {
    authState.status = 'signed_in';
    authState.user = { email: 'parent@example.com' };
    authState.householdStatus = 'ready';
    authState.household = { name: 'Parent Family' };
    authState.entitlementStatus = 'ready';
    authState.householdEntitlement = null;

    render(<AccountSettingsCard />);

    expect(screen.getByText(/not purchased yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unlock routine stars for eur 9.99/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restore purchases/i })).toBeInTheDocument();
    expect(
      screen.getByText(/signed in and ready for the eur 9.99 parent-only purchase flow/i)
    ).toBeInTheDocument();
  });

  it('shows active access without purchase prompts for paid households', () => {
    authState.status = 'signed_in';
    authState.user = { email: 'parent@example.com' };
    authState.householdStatus = 'ready';
    authState.household = { name: 'Parent Family' };
    authState.entitlementStatus = 'ready';
    authState.householdEntitlement = { status: 'active', platform: 'ios' };

    render(<AccountSettingsCard />);

    expect(screen.getByText(/lifetime unlock active/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /unlock routine stars/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /restore purchases/i })).toBeNull();
  });

  it('shows pending verification copy when the household is awaiting verification', () => {
    authState.status = 'signed_in';
    authState.user = { email: 'parent@example.com' };
    authState.householdStatus = 'ready';
    authState.household = { name: 'Parent Family' };
    authState.entitlementStatus = 'ready';
    authState.householdEntitlement = { status: 'pending', platform: 'ios' };

    render(<AccountSettingsCard />);

    expect(screen.getByText(/purchase verification in progress/i)).toBeInTheDocument();
    expect(
      screen.getByText(/captured the purchase evidence and the household is waiting for verification/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry purchase check/i })).toBeInTheDocument();
  });

  it('calls the billing adapter when the parent taps unlock', async () => {
    authState.status = 'signed_in';
    authState.user = { email: 'parent@example.com' };
    authState.householdStatus = 'ready';
    authState.household = { name: 'Parent Family' };
    authState.entitlementStatus = 'ready';
    authState.householdEntitlement = null;

    render(<AccountSettingsCard />);

    fireEvent.click(screen.getByRole('button', { name: /unlock routine stars for eur 9.99/i }));

    await waitFor(() => {
      expect(purchaseHouseholdUnlock).toHaveBeenCalled();
    });

    expect(screen.getByText(/billing unavailable in this build/i)).toBeInTheDocument();
  });
});
