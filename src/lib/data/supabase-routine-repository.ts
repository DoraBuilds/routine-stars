import type { SupabaseClient } from '@supabase/supabase-js';
import type { RoutineRecord, RoutineTaskRecord } from './models';
import type { RoutineRepository } from './repositories';

const ROUTINES_TABLE = 'routines';
const ROUTINE_TASKS_TABLE = 'routine_tasks';

const mapRoutine = (row: Record<string, unknown>): RoutineRecord => ({
  id: String(row.id),
  childProfileId: String(row.child_profile_id),
  type: String(row.type) as RoutineRecord['type'],
  startTime: String(row.start_time),
  endTime: String(row.end_time),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const mapRoutineTask = (row: Record<string, unknown>): RoutineTaskRecord => ({
  id: String(row.id),
  routineId: String(row.routine_id),
  taskTemplateId:
    row.task_template_id === null || row.task_template_id === undefined ? null : String(row.task_template_id),
  customTitle: row.custom_title === null || row.custom_title === undefined ? null : String(row.custom_title),
  customIcon: row.custom_icon === null || row.custom_icon === undefined ? null : String(row.custom_icon) as RoutineTaskRecord['customIcon'],
  sortOrder: Number(row.sort_order),
  isArchived: Boolean(row.is_archived),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const toRoutinePayload = (routine: Omit<RoutineRecord, 'createdAt' | 'updatedAt'>) => ({
  id: routine.id,
  child_profile_id: routine.childProfileId,
  type: routine.type,
  start_time: routine.startTime,
  end_time: routine.endTime,
});

export class SupabaseRoutineRepository implements RoutineRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByChild(childProfileId: string) {
    const { data: routineRows, error: routineError } = await this.supabase
      .from(ROUTINES_TABLE)
      .select('*')
      .eq('child_profile_id', childProfileId)
      .order('created_at', { ascending: true });

    if (routineError) {
      throw routineError;
    }

    const routines = (routineRows ?? []).map(mapRoutine);
    if (routines.length === 0) {
      return { routines, routineTasks: [] };
    }

    const { data: taskRows, error: taskError } = await this.supabase
      .from(ROUTINE_TASKS_TABLE)
      .select('*')
      .in('routine_id', routines.map((routine) => routine.id))
      .order('sort_order', { ascending: true });

    if (taskError) {
      throw taskError;
    }

    return {
      routines,
      routineTasks: (taskRows ?? []).map(mapRoutineTask),
    };
  }

  async upsertRoutine(input: Omit<RoutineRecord, 'createdAt' | 'updatedAt'>) {
    const { data, error } = await this.supabase
      .from(ROUTINES_TABLE)
      .upsert(toRoutinePayload(input), { onConflict: 'child_profile_id,type' })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapRoutine(data);
  }

  async replaceRoutineTasks(input: {
    routineId: string;
    tasks: Array<Omit<RoutineTaskRecord, 'id' | 'routineId' | 'createdAt' | 'updatedAt'>>;
  }) {
    const { error: deleteError } = await this.supabase
      .from(ROUTINE_TASKS_TABLE)
      .delete()
      .eq('routine_id', input.routineId);

    if (deleteError) {
      throw deleteError;
    }

    if (input.tasks.length === 0) {
      return [];
    }

    const payload = input.tasks.map((task, index) => ({
      routine_id: input.routineId,
      task_template_id: task.taskTemplateId,
      custom_title: task.customTitle,
      custom_icon: task.customIcon,
      sort_order: task.sortOrder ?? index,
      is_archived: task.isArchived,
    }));

    const { data, error } = await this.supabase
      .from(ROUTINE_TASKS_TABLE)
      .insert(payload)
      .select('*');

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapRoutineTask).sort((left, right) => left.sortOrder - right.sortOrder);
  }
}

export { mapRoutine, mapRoutineTask };
