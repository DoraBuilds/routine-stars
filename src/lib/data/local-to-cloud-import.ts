import type { Child, HomeScene } from '@/lib/types';
import type { HouseholdRecord } from './models';
import { saveHouseholdConfigToCloud } from './cloud-household-write';

export const importLocalFamilyToCloud = async (input: {
  household: HouseholdRecord;
  children: Child[];
  homeScene: HomeScene;
}) =>
  saveHouseholdConfigToCloud({
    ...input,
    removeMissingChildren: false,
  });
