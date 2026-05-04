import { beforeEach, describe, expect, it, vi } from 'vitest';

const exchangeCodeForSession = vi.fn();
const verifyOtp = vi.fn();
const setSession = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      exchangeCodeForSession,
      verifyOtp,
      setSession,
    },
  }),
}));

describe('supabase client helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    exchangeCodeForSession.mockReset();
    verifyOtp.mockReset();
    setSession.mockReset();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
  });

  it('targets the dedicated auth callback route', async () => {
    const { getSupabaseEmailRedirectUrl } = await import('@/lib/supabase/client');

    expect(getSupabaseEmailRedirectUrl()).toBe(`${window.location.origin}/auth/callback`);
  });

  it('exchanges an auth code from the callback URL', async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    const { finalizeSupabaseAuthFromUrl } = await import('@/lib/supabase/client');

    await expect(finalizeSupabaseAuthFromUrl('https://example.com/auth/callback?code=abc123')).resolves.toEqual({
      handled: true,
      error: null,
    });
    expect(exchangeCodeForSession).toHaveBeenCalledWith('abc123');
  });

  it('verifies token-hash magic links from the callback URL', async () => {
    verifyOtp.mockResolvedValue({ error: null });
    const { finalizeSupabaseAuthFromUrl } = await import('@/lib/supabase/client');

    await expect(
      finalizeSupabaseAuthFromUrl('https://example.com/auth/callback?token_hash=hash123&type=magiclink')
    ).resolves.toEqual({
      handled: true,
      error: null,
    });
    expect(verifyOtp).toHaveBeenCalledWith({ token_hash: 'hash123', type: 'magiclink' });
  });

  it('sets the session from hash tokens when present', async () => {
    setSession.mockResolvedValue({ error: null });
    const { finalizeSupabaseAuthFromUrl } = await import('@/lib/supabase/client');

    await expect(
      finalizeSupabaseAuthFromUrl('https://example.com/auth/callback#access_token=token&refresh_token=refresh')
    ).resolves.toEqual({
      handled: true,
      error: null,
    });
    expect(setSession).toHaveBeenCalledWith({ access_token: 'token', refresh_token: 'refresh' });
  });
});
