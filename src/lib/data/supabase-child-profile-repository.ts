import type { SupabaseClient } from '@supabase/supabase-js';
import type { ChildProfileRecord } from './models';
import type { ChildProfileRepository } from './repositories';

const CHILD_PROFILES_TABLE = 'child_profiles';

const mapChildProfile = (row: Record<string, unknown>): ChildProfileRecord => ({
  id: String(row.id),
  householdId: String(row.household_id),
  name: String(row.name),
  age: row.age === null || row.age === undefined ? null : Number(row.age),
  ageBucket: (row.age_bucket === null || row.age_bucket === undefined ? null : String(row.age_bucket)) as ChildProfileRecord['ageBucket'],
  avatarAnimal:
    row.avatar_animal === null || row.avatar_animal === undefined ? null : String(row.avatar_animal),
  avatarSeed: row.avatar_seed === null || row.avatar_seed === undefined ? null : String(row.avatar_seed),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const toChildProfilePayload = (profile: Omit<ChildProfileRecord, 'createdAt' | 'updatedAt'>) => ({
  id: profile.id,
  household_id: profile.householdId,
  name: profile.name,
  age: profile.age,
  age_bucket: profile.ageBucket,
  avatar_animal: profile.avatarAnimal,
  avatar_seed: profile.avatarSeed,
});

export class SupabaseChildProfileRepository implements ChildProfileRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByHousehold(householdId: string) {
    const { data, error } = await this.supabase
      .from(CHILD_PROFILES_TABLE)
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapChildProfile);
  }

  async upsert(profile: Omit<ChildProfileRecord, 'createdAt' | 'updatedAt'>) {
    const { data, error } = await this.supabase
      .from(CHILD_PROFILES_TABLE)
      .upsert(toChildProfilePayload(profile), { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapChildProfile(data);
  }

  async remove(childProfileId: string) {
    const { error } = await this.supabase
      .from(CHILD_PROFILES_TABLE)
      .delete()
      .eq('id', childProfileId);

    if (error) {
      throw error;
    }
  }
}

export { mapChildProfile };
