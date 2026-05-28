import type { SupabaseClient } from '@supabase/supabase-js';
import type { HouseholdMemberRecord, HouseholdRecord } from './models';
import type { HouseholdRepository } from './repositories';

const HOUSEHOLDS_TABLE = 'households';
const HOUSEHOLD_MEMBERS_TABLE = 'household_members';

const shouldFallbackToDirectBootstrap = (error: unknown) => {
  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message).toLowerCase()
      : '';

  return (
    message.includes('bootstrap_household') ||
    message.includes('function') ||
    message.includes('could not find')
  );
};

const mapHousehold = (row: Record<string, unknown>): HouseholdRecord => ({
  id: String(row.id),
  name: String(row.name),
  timezone: String(row.timezone),
  homeScene: String(row.home_scene) as HouseholdRecord['homeScene'],
  createdByUserId: String(row.created_by_user_id),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const mapMember = (row: Record<string, unknown>): HouseholdMemberRecord => ({
  id: String(row.id),
  householdId: String(row.household_id),
  userId: String(row.user_id),
  role: String(row.role) as HouseholdMemberRecord['role'],
  createdAt: String(row.created_at),
});

export class SupabaseHouseholdRepository implements HouseholdRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getCurrentHousehold(userId: string) {
    // IMPORTANT: a parent account should resolve to one stable household.
    // If multiple households exist (due to earlier bugs or tests), we pick the
    // oldest owner membership to avoid randomly switching households across devices.
    const { data, error } = await this.supabase
      .from(HOUSEHOLD_MEMBERS_TABLE)
      .select('household:households(*)')
      .eq('user_id', userId)
      .eq('role', 'owner')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const householdRow = data && typeof data === 'object' && 'household' in data ? (data as any).household : null;
    return householdRow ? mapHousehold(householdRow) : null;
  }

  async createInitialHousehold(input: { householdName: string; timezone: string; userId: string }) {
    // Prefer the RPC bootstrap path: it's server-side, idempotent, and safe under
    // concurrent callback / tab transitions.
    const { data: rpcData, error: rpcError } = await this.supabase.rpc('bootstrap_household', {
      p_name: input.householdName,
      p_timezone: input.timezone,
    });

    if (!rpcError && rpcData) {
      return mapHousehold(rpcData);
    }

    // Fallback: older environments may not have the RPC yet.
    if (rpcError && !shouldFallbackToDirectBootstrap(rpcError)) {
      throw rpcError;
    }

    // Direct inserts are a fallback path only.
    const { data: householdRow, error: householdError } = await this.supabase
      .from(HOUSEHOLDS_TABLE)
      .insert({
        name: input.householdName,
        timezone: input.timezone,
        created_by_user_id: input.userId,
      })
      .select('*')
      .single();

    if (householdError) {
      // If another tab/device created the household first (unique constraint),
      // resolve the stable household and continue gracefully.
      const normalizedMessage =
        typeof householdError === 'object' && householdError !== null && 'message' in householdError
          ? String(householdError.message).toLowerCase()
          : '';

      if (normalizedMessage.includes('created_by_user_id') || normalizedMessage.includes('households_one_per_creator')) {
        const existing = await this.getCurrentHousehold(input.userId);
        if (existing) return existing;
      }

      throw householdError;
    }

    const household = mapHousehold(householdRow);

    const { error: membershipError } = await this.supabase
      .from(HOUSEHOLD_MEMBERS_TABLE)
      .insert({
        household_id: household.id,
        user_id: input.userId,
        role: 'owner',
      });

    if (!membershipError) {
      return household;
    }

    // Best-effort cleanup: avoid leaving an orphan household row behind.
    await this.supabase.from(HOUSEHOLDS_TABLE).delete().eq('id', household.id);

    throw membershipError;
  }

  async listMembers(householdId: string) {
    const { data, error } = await this.supabase
      .from(HOUSEHOLD_MEMBERS_TABLE)
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapMember);
  }

  async updateHomeScene(householdId: string, homeScene: HouseholdRecord['homeScene']) {
    const { data, error } = await this.supabase
      .from(HOUSEHOLDS_TABLE)
      .update({ home_scene: homeScene })
      .eq('id', householdId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapHousehold(data);
  }

  async remove(householdId: string) {
    const { error } = await this.supabase
      .from(HOUSEHOLDS_TABLE)
      .delete()
      .eq('id', householdId);

    if (error) {
      throw error;
    }
  }
}
