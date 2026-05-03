import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthCallback from '@/pages/AuthCallback';

const navigate = vi.fn();

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

describe('AuthCallback', () => {
  it('shows a finishing sign-in state while auth is settling', () => {
    authState.status = 'loading';
    authState.householdStatus = 'idle';
    authState.error = null;

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
});
