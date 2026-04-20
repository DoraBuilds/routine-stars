import type { Child, HomeScene, IconKey, RoutineType, Task } from '@/lib/types';
import { TASK_CATALOG_BY_ID } from '@/lib/types';
import type { ChildProfileRecord, HouseholdRecord, RoutineRecord, RoutineTaskRecord } from './models';
import { SupabaseChildProfileRepository } from './supabase-child-profile-repository';
import { SupabaseProgressRepository } from './supabase-progress-repository';
import { SupabaseRoutineRepository } from './supabase-routine-repository';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface CloudHouseholdState {
  children: Child[];
  homeScene: HomeScene;
}

const getLocalProgressDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const DEFAULT_SCHEDULE = {
  morning: { start: '07:00', end: '09:00' },
  evening: { start: '17:00', end: '20:00' },
} as const;

const buildTaskFromCloud = (task: RoutineTaskRecord): Task => {
  if (task.taskTemplateId) {
    const template = TASK_CATALOG_BY_ID[task.taskTemplateId];
    if (template) {
      return {
        id: task.id,
        title: template.title,
        icon: template.icon,
        completed: false,
      };
    }
  }

  return {
    id: task.id,
    title: task.customTitle ?? 'Custom task',
    icon: (task.customIcon ?? 'sparkles') as IconKey,
    completed: false,
  };
};

export const mapCloudHouseholdToChildren = (input: {
  childProfiles: ChildProfileRecord[];
  routinesByChildId: Record<string, { routines: RoutineRecord[]; routineTasks: RoutineTaskRecord[] }>;
}) =>
  input.childProfiles.map((profile) => {
    const childRoutines = input.routinesByChildId[profile.id] ?? { routines: [], routineTasks: [] };
    const routines = Object.fromEntries(
      childRoutines.routines.map((routine) => [routine.type, routine])
    ) as Partial<Record<RoutineType, RoutineRecord>>;
    const tasksByRoutineId = Object.fromEntries(
      childRoutines.routines.map((routine) => [
        routine.id,
        childRoutines.routineTasks
          .filter((task) => task.routineId === routine.id && !task.isArchived)
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map(buildTaskFromCloud),
      ])
    ) as Record<string, Task[]>;

    return {
      id: profile.id,
      name: profile.name,
      age: profile.age ?? undefined,
      ageBucket: profile.ageBucket ?? undefined,
      avatarAnimal: profile.avatarAnimal ?? undefined,
      avatarSeed: profile.avatarSeed ?? profile.id,
      schedule: {
        morning: routines.morning
          ? { start: routines.morning.startTime, end: routines.morning.endTime }
          : { ...DEFAULT_SCHEDULE.morning },
        evening: routines.evening
          ? { start: routines.evening.startTime, end: routines.evening.endTime }
          : { ...DEFAULT_SCHEDULE.evening },
      },
      morning: routines.morning ? tasksByRoutineId[routines.morning.id] ?? [] : [],
      evening: routines.evening ? tasksByRoutineId[routines.evening.id] ?? [] : [],
    };
  });

export const loadCloudHouseholdState = async (
  household: HouseholdRecord
): Promise<CloudHouseholdState> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const childRepository = new SupabaseChildProfileRepository(supabase);
  const progressRepository = new SupabaseProgressRepository(supabase);
  const routineRepository = new SupabaseRoutineRepository(supabase);
  const childProfiles = await childRepository.listByHousehold(household.id);
  const progressDate = getLocalProgressDate(new Date());
  const routinePairs = await Promise.all(
    childProfiles.map(async (profile) => [profile.id, await routineRepository.listByChild(profile.id)] as const)
  );
  const progressPairs = await Promise.all(
    childProfiles.flatMap((profile) =>
      (['morning', 'evening'] as const).map(async (routineType) => [
        `${profile.id}:${routineType}`,
        await progressRepository.getRoutineProgress({
          childProfileId: profile.id,
          routineType,
          progressDate,
        }),
      ] as const)
    )
  );

  const children = mapCloudHouseholdToChildren({
    childProfiles,
    routinesByChildId: Object.fromEntries(routinePairs),
  }).map((child) => {
    const applyProgress = (routineType: RoutineType) => {
      const progress = Object.fromEntries(progressPairs)[`${child.id}:${routineType}`];
      const completedTaskIds = new Set(
        (progress?.taskProgress ?? []).filter((taskProgress) => taskProgress.completed).map((taskProgress) => taskProgress.routineTaskId)
      );

      return child[routineType].map((task) => ({
        ...task,
        completed: completedTaskIds.has(task.id),
      }));
    };

    return {
      ...child,
      morning: applyProgress('morning'),
      evening: applyProgress('evening'),
    };
  });

  return {
    homeScene: household.homeScene,
    children,
  };
};

export { getLocalProgressDate };
