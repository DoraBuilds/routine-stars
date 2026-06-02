import type { User } from '@supabase/supabase-js';
import { SupabaseHouseholdRepository } from '@/lib/data/supabase-household-repository';
import type { HouseholdRecord } from '@/lib/data/models';
import { getSupabaseClient } from '@/lib/supabase/client';

const getSuggestedHouseholdName = (user: User) => {
  const parentName = (user.user_metadata && (user.user_metadata as Record<string, unknown>).parent_name)
    ? String((user.user_metadata as Record<string, unknown>).parent_name).trim()
    : '';
  if (parentName) {
    const normalized = parentName.charAt(0).toUpperCase() + parentName.slice(1);
    return `${normalized}'s Family`;
  }

  const emailName = user.email?.split('@')[0]?.trim();
  if (!emailName) {
    return 'My Family';
  }

  const normalized = emailName.charAt(0).toUpperCase() + emailName.slice(1);
  return `${normalized}'s Family`;
};

const getBootstrapErrorMessage = (error: unknown) => {
  // Log full details (code, hint, constraint names) for debugging without
  // exposing them to the user.
  console.error('[household-bootstrap]', error);

  return 'Could not set up the family space. Please tap "Try again", or contact support if it keeps failing.';
};

export const ensureHousehold = async (user: User): Promise<HouseholdRecord> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const repository = new SupabaseHouseholdRepository(supabase);

  let currentHousehold: HouseholdRecord | null;
  try {
    currentHousehold = await repository.getCurrentHousehold(user.id);
  } catch (error) {
    throw new Error(getBootstrapErrorMessage(error));
  }

  if (currentHousehold) {
    return currentHousehold;
  }

  try {
    return await repository.createInitialHousehold({
      householdName: getSuggestedHouseholdName(user),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      userId: user.id,
    });
  } catch (error) {
    throw new Error(getBootstrapErrorMessage(error));
  }
};
