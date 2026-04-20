import { describe, expect, it, vi } from 'vitest';
import { SupabaseChildProfileRepository } from '@/lib/data/supabase-child-profile-repository';

const createSupabaseClient = (fromImpl: (table: string) => unknown) =>
  ({
    from: vi.fn(fromImpl),
  }) as never;

describe('SupabaseChildProfileRepository', () => {
  it('lists child profiles by household and maps the row shape', async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'child-1',
          household_id: 'house-1',
          name: 'Lily',
          age: 5,
          age_bucket: '4-6',
          avatar_animal: 'cat',
          avatar_seed: 'seed-1',
          created_at: '2026-04-20T10:00:00Z',
          updated_at: '2026-04-20T10:00:00Z',
        },
      ],
      error: null,
    });
    const eq = vi.fn(() => ({ order }));
    const select = vi.fn(() => ({ eq }));
    const repository = new SupabaseChildProfileRepository(
      createSupabaseClient(() => ({ select }))
    );

    await expect(repository.listByHousehold('house-1')).resolves.toEqual([
      {
        id: 'child-1',
        householdId: 'house-1',
        name: 'Lily',
        age: 5,
        ageBucket: '4-6',
        avatarAnimal: 'cat',
        avatarSeed: 'seed-1',
        createdAt: '2026-04-20T10:00:00Z',
        updatedAt: '2026-04-20T10:00:00Z',
      },
    ]);

    expect(eq).toHaveBeenCalledWith('household_id', 'house-1');
    expect(order).toHaveBeenCalledWith('created_at', { ascending: true });
  });

  it('upserts child profiles using snake_case payloads', async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: 'child-1',
        household_id: 'house-1',
        name: 'Lily',
        age: 5,
        age_bucket: '4-6',
        avatar_animal: null,
        avatar_seed: 'seed-1',
        created_at: '2026-04-20T10:00:00Z',
        updated_at: '2026-04-20T10:05:00Z',
      },
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const upsert = vi.fn(() => ({ select }));
    const repository = new SupabaseChildProfileRepository(
      createSupabaseClient(() => ({ upsert }))
    );

    await expect(
      repository.upsert({
        id: 'child-1',
        householdId: 'house-1',
        name: 'Lily',
        age: 5,
        ageBucket: '4-6',
        avatarAnimal: null,
        avatarSeed: 'seed-1',
      })
    ).resolves.toMatchObject({
      id: 'child-1',
      householdId: 'house-1',
      name: 'Lily',
    });

    expect(upsert).toHaveBeenCalledWith(
      {
        id: 'child-1',
        household_id: 'house-1',
        name: 'Lily',
        age: 5,
        age_bucket: '4-6',
        avatar_animal: null,
        avatar_seed: 'seed-1',
      },
      { onConflict: 'id' }
    );
  });
});
