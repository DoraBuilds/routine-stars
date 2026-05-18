import { describe, expect, it, vi } from 'vitest';
import { SupabaseHouseholdRepository } from '@/lib/data/supabase-household-repository';

const createSupabaseClient = (rpcResult: { data: unknown; error: unknown }, tables: Record<string, unknown>) =>
  ({
    rpc: vi.fn().mockResolvedValue(rpcResult),
    from: vi.fn((table: string) => tables[table]),
  }) as never;

describe('SupabaseHouseholdRepository', () => {
  it('selects the oldest owner membership household for stable cross-device loads', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        household: {
          id: 'house-old',
          name: "Dora's Family",
          timezone: 'Europe/Madrid',
          home_scene: 'bike',
          created_by_user_id: 'user-1',
          created_at: '2026-05-01T12:00:00Z',
          updated_at: '2026-05-01T12:00:00Z',
        },
      },
      error: null,
    });
    const limit = vi.fn(() => ({
      maybeSingle,
    }));
    const order = vi.fn(() => ({
      limit,
    }));
    const eqRole = vi.fn(() => ({
      order,
    }));
    const eqUser = vi.fn(() => ({
      eq: eqRole,
    }));
    const select = vi.fn(() => ({
      eq: eqUser,
    }));

    const repository = new SupabaseHouseholdRepository({
      from: vi.fn(() => ({
        select,
      })),
    } as never);

    await expect(repository.getCurrentHousehold('user-1')).resolves.toEqual({
      id: 'house-old',
      name: "Dora's Family",
      timezone: 'Europe/Madrid',
      homeScene: 'bike',
      createdByUserId: 'user-1',
      createdAt: '2026-05-01T12:00:00Z',
      updatedAt: '2026-05-01T12:00:00Z',
    });

    expect(select).toHaveBeenCalledWith('household:households(*)');
    expect(eqUser).toHaveBeenCalledWith('user_id', 'user-1');
    expect(eqRole).toHaveBeenCalledWith('role', 'owner');
    expect(order).toHaveBeenCalledWith('created_at', { ascending: true });
    expect(limit).toHaveBeenCalledWith(1);
  });

  it('returns the RPC household when bootstrap_household succeeds', async () => {
    const repository = new SupabaseHouseholdRepository(
      createSupabaseClient(
        {
          data: {
            id: 'house-1',
            name: "Dora's Family",
            timezone: 'Europe/Madrid',
            home_scene: 'bike',
            created_by_user_id: 'user-1',
            created_at: '2026-05-03T12:00:00Z',
            updated_at: '2026-05-03T12:00:00Z',
          },
          error: null,
        },
        {}
      )
    );

    await expect(
      repository.createInitialHousehold({
        householdName: "Dora's Family",
        timezone: 'Europe/Madrid',
        userId: 'user-1',
      })
    ).resolves.toEqual({
      id: 'house-1',
      name: "Dora's Family",
      timezone: 'Europe/Madrid',
      homeScene: 'bike',
      createdByUserId: 'user-1',
      createdAt: '2026-05-03T12:00:00Z',
      updatedAt: '2026-05-03T12:00:00Z',
    });
  });

  it('falls back to direct inserts when the bootstrap RPC is unavailable', async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: 'house-2',
        name: "Dora's Family",
        timezone: 'Europe/Madrid',
        home_scene: 'bike',
        created_by_user_id: 'user-1',
        created_at: '2026-05-03T12:00:00Z',
        updated_at: '2026-05-03T12:00:00Z',
      },
      error: null,
    });
    const householdInsert = vi.fn(() => ({ select: vi.fn(() => ({ single })) }));
    const membershipInsert = vi.fn().mockResolvedValue({ error: null });

    const repository = new SupabaseHouseholdRepository(
      createSupabaseClient(
        {
          data: null,
          error: { message: 'Could not find the function public.bootstrap_household' },
        },
        {
          households: {
            insert: householdInsert,
          },
          household_members: {
            insert: membershipInsert,
          },
        }
      )
    );

    await expect(
      repository.createInitialHousehold({
        householdName: "Dora's Family",
        timezone: 'Europe/Madrid',
        userId: 'user-1',
      })
    ).resolves.toMatchObject({
      id: 'house-2',
      name: "Dora's Family",
      createdByUserId: 'user-1',
    });

    expect(householdInsert).toHaveBeenCalledWith({
      name: "Dora's Family",
      timezone: 'Europe/Madrid',
      created_by_user_id: 'user-1',
    });
    expect(membershipInsert).toHaveBeenCalledWith({
      household_id: 'house-2',
      user_id: 'user-1',
      role: 'owner',
    });
  });

  it('does not fall back when the RPC fails for a non-bootstrap reason', async () => {
    const repository = new SupabaseHouseholdRepository(
      createSupabaseClient(
        {
          data: null,
          error: { message: 'Not authenticated' },
        },
        {
          households: {
            insert: vi.fn(),
          },
          household_members: {
            insert: vi.fn(),
          },
        }
      )
    );

    await expect(
      repository.createInitialHousehold({
        householdName: "Dora's Family",
        timezone: 'Europe/Madrid',
        userId: 'user-1',
      })
    ).rejects.toEqual({ message: 'Not authenticated' });
  });

  it('deletes the household row by id', async () => {
    const deleteEq = vi.fn().mockResolvedValue({ error: null });
    const repository = new SupabaseHouseholdRepository(
      createSupabaseClient(
        {
          data: null,
          error: null,
        },
        {
          households: {
            delete: vi.fn(() => ({
              eq: deleteEq,
            })),
          },
        }
      )
    );

    await expect(repository.remove('house-1')).resolves.toBeUndefined();
    expect(deleteEq).toHaveBeenCalledWith('id', 'house-1');
  });
});
