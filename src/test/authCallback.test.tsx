import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthCallback from '@/pages/AuthCallback';

const navigate = vi.fn();
const { finalizeSupabaseAuthFromUrl } = vi.hoisted(() => ({
  finalizeSupabaseAuthFromUrl: vi.fn(),
}));

const authState = {
  configured: true,
  status: 'loading',
  householdStatus: 'idle',
  error: null as string | null,
  clearError: vi.fn(),
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: () => authState,
}));

vi.mock('@/lib/supabase/client', () => ({
  finalizeSupabaseAuthFromUrl,
}));

describe('AuthCallback', () => {
  beforeEach(() => {
    vi.useRealTimers();
    navigate.mockReset();
    finalizeSupabaseAuthFromUrl.mockReset();
    finalizeSupabaseAuthFromUrl.mockResolvedValue({ handled: false, error: null });
    authState.status = 'loading';
    authState.householdStatus = 'idle';
    authState.error = null;
    authState.clearError.mockReset();
  });

  it('shows a finishing sign-in state while auth is settling', () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/finishing sign-in/i)).toBeInTheDocument();
    expect(screen.getByText(/opening your family account/i)).toBeInTheDocument();
  });

  it('shows a recovery path when the household bootstrap fails after sign-in', () => {
    authState.status = 'signed_in';
    authState.householdStatus = 'error';
    authState.error = 'Could not prepare the family household in Supabase.';

    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/we signed you in, but could not open the family space yet/i)).toBeInTheDocument();
    expect(screen.getByText(/could not prepare the family household/i)).toBeInTheDocument();
  });

  it('shows an auth-link problem when callback finalization fails', async () => {
    finalizeSupabaseAuthFromUrl.mockResolvedValue({ handled: true, error: 'Magic link expired.' });

    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/this sign-in link did not finish cleanly/i)).toBeInTheDocument();
    expect(screen.getByText(/magic link expired/i)).toBeInTheDocument();
  });

  it('uses device-neutral copy while a slow callback is still in progress', () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(20000);
    });

    expect(screen.getByText(/still connecting/i)).toBeInTheDocument();
    expect(screen.getByText(/we're still opening your family account/i)).toBeInTheDocument();
    expect(screen.queryByText(/this ipad is still opening your family account/i)).not.toBeInTheDocument();
  });

  it('shows a slower in-progress state before eventually showing timeout recovery', async () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(19000);
    });

    expect(screen.queryByText(/this device did not finish connecting/i)).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/still connecting/i)).toBeInTheDocument();
    expect(screen.getByText(/we're still opening your family account/i)).toBeInTheDocument();
    expect(screen.queryByText(/this device did not finish connecting/i)).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(40000);
    });

    expect(screen.getByText(/this device did not finish connecting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh and try again/i })).toBeInTheDocument();
  }, 10000);
});
