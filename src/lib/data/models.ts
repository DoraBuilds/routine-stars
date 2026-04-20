import type { AgeBucket, HomeScene, IconKey, RoutineType } from '@/lib/types';

export type HouseholdRole = 'owner' | 'parent';
export type BillingPlatform = 'ios' | 'android' | 'web';
export type HouseholdEntitlementStatus = 'active' | 'revoked';

export interface HouseholdRecord {
  id: string;
  name: string;
  timezone: string;
  homeScene: HomeScene;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HouseholdMemberRecord {
  id: string;
  householdId: string;
  userId: string;
  role: HouseholdRole;
  createdAt: string;
}

export interface HouseholdEntitlementRecord {
  id: string;
  householdId: string;
  status: HouseholdEntitlementStatus;
  platform: BillingPlatform | null;
  storeProductId: string | null;
  sourceTransactionId: string | null;
  sourceOriginalTransactionId: string | null;
  grantedAt: string | null;
  revokedAt: string | null;
  verificationCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseEventRecord {
  id: string;
  householdId: string;
  platform: BillingPlatform;
  eventType: string;
  storeProductId: string | null;
  sourceTransactionId: string | null;
  sourceOriginalTransactionId: string | null;
  amountMinor: number | null;
  currency: string | null;
  rawPayload: unknown;
  occurredAt: string;
  createdAt: string;
}

export interface ChildProfileRecord {
  id: string;
  householdId: string;
  name: string;
  age: number | null;
  ageBucket: AgeBucket | null;
  avatarAnimal: string | null;
  avatarSeed: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineRecord {
  id: string;
  childProfileId: string;
  type: RoutineType;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineTaskRecord {
  id: string;
  routineId: string;
  taskTemplateId: string | null;
  customTitle: string | null;
  customIcon: IconKey | null;
  sortOrder: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyRoutineProgressRecord {
  id: string;
  childProfileId: string;
  routineType: RoutineType;
  progressDate: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyTaskProgressRecord {
  id: string;
  dailyRoutineProgressId: string;
  routineTaskId: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
