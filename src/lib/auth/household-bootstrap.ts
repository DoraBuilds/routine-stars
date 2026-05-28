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
  // Always capture the raw message — code, details, and hint from PostgREST errors are
  // useful for debugging and are surfaced to the user so they can be shared with support.
  let message = '';
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null) {
    const e = error as Record<string, unknown>;
    const parts = [e.message, e.code, e.details, e.hint].filter(Boolean);
    message = parts.map(String).join(' — ') || JSON.stringify(error);
  }

  return (
    `Could not set up the family space. Please tap "Try again". ` +
    `If it keeps failing, send this to support: ${message || 'no error detail'}`
  );
};

export const ensureHousehold = async (user: User): Promise<HouseholdRecord> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const repository = new SupabaseHouseholdRepository(supabase);
  const currentHousehold = await repository.getCurrentHousehold(user.id);
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
