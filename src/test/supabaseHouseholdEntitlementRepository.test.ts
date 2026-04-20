import { describe, expect, it, vi } from 'vitest';
import { SupabaseHouseholdEntitlementRepository } from '@/lib/data/supabase-household-entitlement-repository';

const createSupabaseClient = (responses: Record<string, unknown>) =>
  ({
    from: vi.fn((table: string) => responses[table]),
  }) as never;

describe('SupabaseHouseholdEntitlementRepository', () => {
  it('loads the current household entitlement when present', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'entitlement-1',
        household_id: 'house-1',
        status: 'active',
        platform: 'ios',
        store_product_id: 'routine_stars_household_unlock',
        source_transaction_id: 'tx-1',
        source_original_transaction_id: 'orig-tx-1',
        granted_at: '2026-04-20T18:00:00Z',
        revoked_at: null,
        verification_checked_at: '2026-04-20T18:01:00Z',
        created_at: '2026-04-20T18:00:00Z',
        updated_at: '2026-04-20T18:01:00Z',
      },
      error: null,
    });
    const eq = vi.fn(() => ({ maybeSingle }));
    const repository = new SupabaseHouseholdEntitlementRepository(
      createSupabaseClient({
        household_entitlements: {
          select: vi.fn(() => ({ eq })),
        },
      })
    );

    await expect(repository.getByHousehold('house-1')).resolves.toEqual(
      expect.objectContaining({
        id: 'entitlement-1',
        householdId: 'house-1',
        status: 'active',
        platform: 'ios',
      })
    );
  });

  it('upserts household entitlement and purchase event rows using snake_case payloads', async () => {
    const entitlementSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'entitlement-1',
        household_id: 'house-1',
        status: 'active',
        platform: 'android',
        store_product_id: 'routine_stars_household_unlock',
        source_transaction_id: 'tx-1',
        source_original_transaction_id: null,
        granted_at: '2026-04-20T18:00:00Z',
        revoked_at: null,
        verification_checked_at: '2026-04-20T18:01:00Z',
        created_at: '2026-04-20T18:00:00Z',
        updated_at: '2026-04-20T18:01:00Z',
      },
      error: null,
    });
    const entitlementSelect = vi.fn(() => ({ single: entitlementSingle }));
    const entitlementUpsert = vi.fn(() => ({ select: entitlementSelect }));

    const purchaseEventSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'event-1',
        household_id: 'house-1',
        platform: 'android',
        event_type: 'purchase_verified',
        store_product_id: 'routine_stars_household_unlock',
        source_transaction_id: 'tx-1',
        source_original_transaction_id: null,
        amount_minor: 999,
        currency: 'EUR',
        raw_payload: { test: true },
        occurred_at: '2026-04-20T18:00:00Z',
        created_at: '2026-04-20T18:01:00Z',
      },
      error: null,
    });
    const purchaseEventSelect = vi.fn(() => ({ single: purchaseEventSingle }));
    const purchaseEventUpsert = vi.fn(() => ({ select: purchaseEventSelect }));

    const repository = new SupabaseHouseholdEntitlementRepository(
      createSupabaseClient({
        household_entitlements: {
          upsert: entitlementUpsert,
        },
        purchase_events: {
          upsert: purchaseEventUpsert,
        },
      })
    );

    await expect(
      repository.upsert({
        id: 'entitlement-1',
        householdId: 'house-1',
        status: 'active',
        platform: 'android',
        storeProductId: 'routine_stars_household_unlock',
        sourceTransactionId: 'tx-1',
        sourceOriginalTransactionId: null,
        grantedAt: '2026-04-20T18:00:00Z',
        revokedAt: null,
        verificationCheckedAt: '2026-04-20T18:01:00Z',
      })
    ).resolves.toMatchObject({
      id: 'entitlement-1',
      householdId: 'house-1',
      platform: 'android',
    });

    expect(entitlementUpsert).toHaveBeenCalledWith(
      {
        id: 'entitlement-1',
        household_id: 'house-1',
        status: 'active',
        platform: 'android',
        store_product_id: 'routine_stars_household_unlock',
        source_transaction_id: 'tx-1',
        source_original_transaction_id: null,
        granted_at: '2026-04-20T18:00:00Z',
        revoked_at: null,
        verification_checked_at: '2026-04-20T18:01:00Z',
      },
      { onConflict: 'household_id' }
    );

    await expect(
      repository.recordPurchaseEvent({
        id: 'event-1',
        householdId: 'house-1',
        platform: 'android',
        eventType: 'purchase_verified',
        storeProductId: 'routine_stars_household_unlock',
        sourceTransactionId: 'tx-1',
        sourceOriginalTransactionId: null,
        amountMinor: 999,
        currency: 'EUR',
        rawPayload: { test: true },
        occurredAt: '2026-04-20T18:00:00Z',
      })
    ).resolves.toMatchObject({
      id: 'event-1',
      householdId: 'house-1',
      platform: 'android',
    });

    expect(purchaseEventUpsert).toHaveBeenCalledWith(
      {
        id: 'event-1',
        household_id: 'house-1',
        platform: 'android',
        event_type: 'purchase_verified',
        store_product_id: 'routine_stars_household_unlock',
        source_transaction_id: 'tx-1',
        source_original_transaction_id: null,
        amount_minor: 999,
        currency: 'EUR',
        raw_payload: { test: true },
        occurred_at: '2026-04-20T18:00:00Z',
      },
      { onConflict: 'platform,event_type,source_transaction_id' }
    );
  });
});
