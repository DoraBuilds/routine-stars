import type { SupabaseClient } from '@supabase/supabase-js';
import type { HouseholdEntitlementRecord, PurchaseEventRecord } from './models';
import type { HouseholdEntitlementRepository } from './repositories';

const HOUSEHOLD_ENTITLEMENTS_TABLE = 'household_entitlements';
const PURCHASE_EVENTS_TABLE = 'purchase_events';

const mapHouseholdEntitlement = (row: Record<string, unknown>): HouseholdEntitlementRecord => ({
  id: String(row.id),
  householdId: String(row.household_id),
  status: String(row.status) as HouseholdEntitlementRecord['status'],
  platform:
    row.platform === null || row.platform === undefined
      ? null
      : (String(row.platform) as HouseholdEntitlementRecord['platform']),
  storeProductId:
    row.store_product_id === null || row.store_product_id === undefined
      ? null
      : String(row.store_product_id),
  sourceTransactionId:
    row.source_transaction_id === null || row.source_transaction_id === undefined
      ? null
      : String(row.source_transaction_id),
  sourceOriginalTransactionId:
    row.source_original_transaction_id === null || row.source_original_transaction_id === undefined
      ? null
      : String(row.source_original_transaction_id),
  grantedAt: row.granted_at === null || row.granted_at === undefined ? null : String(row.granted_at),
  revokedAt: row.revoked_at === null || row.revoked_at === undefined ? null : String(row.revoked_at),
  verificationCheckedAt:
    row.verification_checked_at === null || row.verification_checked_at === undefined
      ? null
      : String(row.verification_checked_at),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const mapPurchaseEvent = (row: Record<string, unknown>): PurchaseEventRecord => ({
  id: String(row.id),
  householdId: String(row.household_id),
  platform: String(row.platform) as PurchaseEventRecord['platform'],
  eventType: String(row.event_type),
  storeProductId:
    row.store_product_id === null || row.store_product_id === undefined
      ? null
      : String(row.store_product_id),
  sourceTransactionId:
    row.source_transaction_id === null || row.source_transaction_id === undefined
      ? null
      : String(row.source_transaction_id),
  sourceOriginalTransactionId:
    row.source_original_transaction_id === null || row.source_original_transaction_id === undefined
      ? null
      : String(row.source_original_transaction_id),
  amountMinor:
    row.amount_minor === null || row.amount_minor === undefined ? null : Number(row.amount_minor),
  currency: row.currency === null || row.currency === undefined ? null : String(row.currency),
  rawPayload: row.raw_payload ?? null,
  occurredAt: String(row.occurred_at),
  createdAt: String(row.created_at),
});

const toEntitlementPayload = (
  entitlement: Omit<HouseholdEntitlementRecord, 'createdAt' | 'updatedAt'>
) => ({
  id: entitlement.id,
  household_id: entitlement.householdId,
  status: entitlement.status,
  platform: entitlement.platform,
  store_product_id: entitlement.storeProductId,
  source_transaction_id: entitlement.sourceTransactionId,
  source_original_transaction_id: entitlement.sourceOriginalTransactionId,
  granted_at: entitlement.grantedAt,
  revoked_at: entitlement.revokedAt,
  verification_checked_at: entitlement.verificationCheckedAt,
});

const toPurchaseEventPayload = (event: Omit<PurchaseEventRecord, 'createdAt'>) => ({
  id: event.id,
  household_id: event.householdId,
  platform: event.platform,
  event_type: event.eventType,
  store_product_id: event.storeProductId,
  source_transaction_id: event.sourceTransactionId,
  source_original_transaction_id: event.sourceOriginalTransactionId,
  amount_minor: event.amountMinor,
  currency: event.currency,
  raw_payload: event.rawPayload,
  occurred_at: event.occurredAt,
});

export class SupabaseHouseholdEntitlementRepository implements HouseholdEntitlementRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getByHousehold(householdId: string) {
    const { data, error } = await this.supabase
      .from(HOUSEHOLD_ENTITLEMENTS_TABLE)
      .select('*')
      .eq('household_id', householdId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapHouseholdEntitlement(data) : null;
  }

  async upsert(entitlement: Omit<HouseholdEntitlementRecord, 'createdAt' | 'updatedAt'>) {
    const { data, error } = await this.supabase
      .from(HOUSEHOLD_ENTITLEMENTS_TABLE)
      .upsert(toEntitlementPayload(entitlement), { onConflict: 'household_id' })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapHouseholdEntitlement(data);
  }

  async recordPurchaseEvent(event: Omit<PurchaseEventRecord, 'createdAt'>) {
    const { data, error } = await this.supabase
      .from(PURCHASE_EVENTS_TABLE)
      .upsert(toPurchaseEventPayload(event), { onConflict: 'platform,event_type,source_transaction_id' })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapPurchaseEvent(data);
  }
}

export { mapHouseholdEntitlement, mapPurchaseEvent };
