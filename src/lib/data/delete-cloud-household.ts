import type { HouseholdRecord } from './models';
import { SupabaseHouseholdRepository } from './supabase-household-repository';
import { getSupabaseClient } from '@/lib/supabase/client';

export const deleteCloudHousehold = async (household: HouseholdRecord) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const householdRepository = new SupabaseHouseholdRepository(supabase);
  await householdRepository.remove(household.id);
};
