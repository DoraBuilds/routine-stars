import type { User } from '@supabase/supabase-js';

const HOUSEHOLD_BOOTSTRAP_PREFIX = 'routine_stars_household_bootstrap:';

export type HouseholdBootstrapState = {
  householdId: string;
  householdName: string;
  createdAt: string;
  status: 'provisional';
};

const getBootstrapKey = (userId: string) => `${HOUSEHOLD_BOOTSTRAP_PREFIX}${userId}`;

const getSuggestedHouseholdName = (user: User) => {
  const emailName = user.email?.split('@')[0]?.trim();
  if (!emailName) {
    return 'My Family';
  }

  const normalized = emailName.charAt(0).toUpperCase() + emailName.slice(1);
  return `${normalized}'s Family`;
};

export const readProvisionedHousehold = (userId: string): HouseholdBootstrapState | null => {
  const raw = localStorage.getItem(getBootstrapKey(userId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as HouseholdBootstrapState;
  } catch {
    return null;
  }
};

export const ensureProvisionedHousehold = async (user: User) => {
  const existing = readProvisionedHousehold(user.id);
  if (existing) return existing;

  const provisioned: HouseholdBootstrapState = {
    householdId: crypto.randomUUID(),
    householdName: getSuggestedHouseholdName(user),
    createdAt: new Date().toISOString(),
    status: 'provisional',
  };

  localStorage.setItem(getBootstrapKey(user.id), JSON.stringify(provisioned));
  return provisioned;
};
