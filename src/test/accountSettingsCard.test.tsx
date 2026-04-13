import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountSettingsCard } from '@/components/AccountSettingsCard';

const sendEmailLink = vi.fn();
const signOut = vi.fn();
const clearError = vi.fn();
const retryHousehold = vi.fn();

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: () => ({
    configured: true,
    status: 'signed_out',
    user: null,
    householdStatus: 'idle',
    household: null,
    error: null,
    clearError,
    sendEmailLink,
    retryHousehold,
    signOut,
  }),
}));

describe('AccountSettingsCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendEmailLink.mockResolvedValue(true);
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
});
