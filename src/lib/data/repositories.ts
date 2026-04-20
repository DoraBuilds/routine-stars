import type { RoutineType } from '@/lib/types';
import type {
  ChildProfileRecord,
  DailyRoutineProgressRecord,
  DailyTaskProgressRecord,
  HouseholdMemberRecord,
  HouseholdEntitlementRecord,
  HouseholdRecord,
  PurchaseEventRecord,
  RoutineRecord,
  RoutineTaskRecord,
} from './models';

export interface HouseholdRepository {
  getCurrentHousehold(): Promise<HouseholdRecord | null>;
  createInitialHousehold(input: {
    householdName: string;
    timezone: string;
  }): Promise<HouseholdRecord>;
  listMembers(householdId: string): Promise<HouseholdMemberRecord[]>;
  updateHomeScene(householdId: string, homeScene: HouseholdRecord['homeScene']): Promise<HouseholdRecord>;
}

export interface HouseholdEntitlementRepository {
  getByHousehold(householdId: string): Promise<HouseholdEntitlementRecord | null>;
  upsert(
    entitlement: Omit<HouseholdEntitlementRecord, 'createdAt' | 'updatedAt'>
  ): Promise<HouseholdEntitlementRecord>;
  recordPurchaseEvent(
    event: Omit<PurchaseEventRecord, 'createdAt'>
  ): Promise<PurchaseEventRecord>;
}

export interface ChildProfileRepository {
  listByHousehold(householdId: string): Promise<ChildProfileRecord[]>;
  upsert(profile: Omit<ChildProfileRecord, 'createdAt' | 'updatedAt'>): Promise<ChildProfileRecord>;
  remove(childProfileId: string): Promise<void>;
}

export interface RoutineRepository {
  listByChild(childProfileId: string): Promise<{
    routines: RoutineRecord[];
    routineTasks: RoutineTaskRecord[];
  }>;
  upsertRoutine(input: Omit<RoutineRecord, 'createdAt' | 'updatedAt'>): Promise<RoutineRecord>;
  replaceRoutineTasks(input: {
    routineId: string;
    tasks: Array<Omit<RoutineTaskRecord, 'id' | 'routineId' | 'createdAt' | 'updatedAt'>>;
  }): Promise<RoutineTaskRecord[]>;
}

export interface ProgressRepository {
  getRoutineProgress(input: {
    childProfileId: string;
    routineType: RoutineType;
    progressDate: string;
  }): Promise<{
    dailyRoutineProgress: DailyRoutineProgressRecord | null;
    taskProgress: DailyTaskProgressRecord[];
  }>;
  upsertRoutineProgress(input: {
    childProfileId: string;
    routineType: RoutineType;
    progressDate: string;
    completedAt?: string | null;
  }): Promise<DailyRoutineProgressRecord>;
  setTaskCompletion(input: {
    dailyRoutineProgressId: string;
    routineTaskId: string;
    completed: boolean;
    completedAt?: string | null;
  }): Promise<DailyTaskProgressRecord>;
}
