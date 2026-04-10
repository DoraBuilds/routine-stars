import type { User } from '@supabase/supabase-js';
import { SupabaseHouseholdRepository } from '@/lib/data/supabase-household-repository';
import type { HouseholdRecord } from '@/lib/data/models';
import { getSupabaseClient } from '@/lib/supabase/client';

const getSuggestedHouseholdName = (user: User) => {
  const emailName = user.email?.split('@')[0]?.trim();
  if (!emailName) {
    return 'My Family';
  }

  const normalized = emailName.charAt(0).toUpperCase() + emailName.slice(1);
  return `${normalized}'s Family`;
};

export const ensureHousehold = async (user: User): Promise<HouseholdRecord> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const repository = new SupabaseHouseholdRepository(supabase);
  const currentHousehold = await repository.getCurrentHousehold();
  if (currentHousehold) {
    return currentHousehold;
  }

  return repository.createInitialHousehold({
    userId: user.id,
    householdName: getSuggestedHouseholdName(user),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  });
};
