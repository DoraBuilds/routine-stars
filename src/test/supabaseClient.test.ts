import { describe, expect, it, vi } from 'vitest';

describe('getSupabaseEmailRedirectUrl', () => {
  it('targets the dedicated auth callback route', async () => {
    vi.resetModules();

    const { getSupabaseEmailRedirectUrl } = await import('@/lib/supabase/client');

    expect(getSupabaseEmailRedirectUrl()).toBe(`${window.location.origin}/auth/callback`);
  });
});
