import type { AgeBucket, HomeScene, IconKey, RoutineType } from '@/lib/types';

export type HouseholdRole = 'owner' | 'parent';

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
