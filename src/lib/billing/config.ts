export interface BillingProduct {
  id: string;
  displayName: string;
  description: string;
  priceLabel: string;
  platformProductIds: {
    ios: string;
    android: string;
  };
}

export const HOUSEHOLD_LIFETIME_UNLOCK: BillingProduct = {
  id: 'household_lifetime_unlock',
  displayName: 'Routine Stars Household Unlock',
  description: 'One-time lifetime unlock for one household account.',
  priceLabel: 'EUR 9.99',
  platformProductIds: {
    ios: 'routine_stars_household_unlock',
    android: 'routine_stars_household_unlock',
  },
};
