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
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : '';

  const normalized = message.toLowerCase();

  if (
    normalized.includes('bootstrap_household') ||
    normalized.includes('households') ||
    normalized.includes('household_members') ||
    normalized.includes('relation') ||
    normalized.includes('schema cache')
  ) {
    // This bucket historically meant "schema is missing", but in practice it can also include
    // permission/RLS errors. Keep the guidance user-friendly, but include the raw error so
    // we can debug support tickets without requiring console access.
    return `Could not prepare the family space in Supabase yet. Please press "Try again". If it keeps failing, share this error with support: ${message || 'unknown error'}`;
  }

  return message || 'Could not prepare the family household in Supabase.';
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
