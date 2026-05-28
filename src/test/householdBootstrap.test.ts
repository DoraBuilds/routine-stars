import { describe, expect, it, vi } from 'vitest';

const getCurrentHousehold = vi.fn();
const createInitialHousehold = vi.fn();
const getSupabaseClient = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient,
}));

vi.mock('@/lib/data/supabase-household-repository', () => ({
  SupabaseHouseholdRepository: class {
    getCurrentHousehold = getCurrentHousehold;
    createInitialHousehold = createInitialHousehold;
  },
}));

describe('ensureHousehold', () => {
  it('turns schema-missing Supabase failures into actionable setup guidance', async () => {
    vi.resetModules();
    getSupabaseClient.mockReturnValue({} as never);
    getCurrentHousehold.mockResolvedValue(null);
    createInitialHousehold.mockRejectedValue({
      message: 'relation "public.households" does not exist',
    });

    const { ensureHousehold } = await import('@/lib/auth/household-bootstrap');

    await expect(
      ensureHousehold({
        id: 'user-1',
        email: 'parent@example.com',
      } as never)
    ).rejects.toThrow(/could not set up the family space/i);
  });
});
