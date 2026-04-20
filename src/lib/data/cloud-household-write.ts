import type { Child, HomeScene, RoutineType } from '@/lib/types';
import type { HouseholdRecord } from './models';
import { TASK_CATALOG } from '@/lib/types';
import { SupabaseChildProfileRepository } from './supabase-child-profile-repository';
import { SupabaseHouseholdRepository } from './supabase-household-repository';
import { SupabaseRoutineRepository } from './supabase-routine-repository';
import { getSupabaseClient } from '@/lib/supabase/client';

const findTemplateForTask = (
  title: string,
  icon: string,
  routine: RoutineType
) =>
  TASK_CATALOG[routine].find((task) => task.title === title && task.icon === icon) ?? null;

export const saveHouseholdConfigToCloud = async (input: {
  household: HouseholdRecord;
  children: Child[];
  homeScene: HomeScene;
  removeMissingChildren?: boolean;
}) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const householdRepository = new SupabaseHouseholdRepository(supabase);
  const childRepository = new SupabaseChildProfileRepository(supabase);
  const routineRepository = new SupabaseRoutineRepository(supabase);

  await householdRepository.updateHomeScene(input.household.id, input.homeScene);

  if (input.removeMissingChildren) {
    const existingChildren = await childRepository.listByHousehold(input.household.id);
    const localChildIds = new Set(input.children.map((child) => child.id));

    await Promise.all(
      existingChildren
        .filter((childProfile) => !localChildIds.has(childProfile.id))
        .map((childProfile) => childRepository.remove(childProfile.id))
    );
  }

  for (const child of input.children) {
    const savedChild = await childRepository.upsert({
      id: child.id,
      householdId: input.household.id,
      name: child.name,
      age: child.age ?? null,
      ageBucket: child.ageBucket ?? null,
      avatarAnimal: child.avatarAnimal ?? null,
      avatarSeed: child.avatarSeed ?? null,
    });

    for (const routineType of ['morning', 'evening'] as const) {
      const routine = await routineRepository.upsertRoutine({
        id: `${savedChild.id}-${routineType}`,
        childProfileId: savedChild.id,
        type: routineType,
        startTime: child.schedule?.[routineType].start ?? (routineType === 'morning' ? '07:00' : '17:00'),
        endTime: child.schedule?.[routineType].end ?? (routineType === 'morning' ? '09:00' : '20:00'),
      });

      await routineRepository.replaceRoutineTasks({
        routineId: routine.id,
        tasks: child[routineType].map((task, index) => {
          const matchedTemplate = findTemplateForTask(task.title, task.icon, routineType);

          return {
            taskTemplateId: matchedTemplate?.id ?? null,
            customTitle: matchedTemplate ? null : task.title,
            customIcon: matchedTemplate ? null : task.icon,
            sortOrder: index,
            isArchived: false,
          };
        }),
      });
    }
  }
};
