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

const toRoutinePayload = (routine: Omit<RoutineRecord, 'id' | 'createdAt' | 'updatedAt'>) => ({
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

  async upsertRoutine(input: Omit<RoutineRecord, 'id' | 'createdAt' | 'updatedAt'>) {
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
    // Read existing tasks first. If the definitions haven't changed, skip the
    // dangerous delete-then-insert entirely. This prevents task loss when the
    // cloud sync fires on task completions (which don't change definitions).
    const { data: existingRows } = await this.supabase
      .from(ROUTINE_TASKS_TABLE)
      .select('*')
      .eq('routine_id', input.routineId)
      .order('sort_order', { ascending: true });

    const existingTasks = (existingRows ?? [])
      .map(mapRoutineTask)
      .filter((t) => !t.isArchived);

    const definitionsUnchanged =
      existingTasks.length === input.tasks.length &&
      input.tasks.every((next, i) => {
        const cur = existingTasks[i];
        return (
          cur &&
          cur.taskTemplateId === next.taskTemplateId &&
          cur.customTitle === next.customTitle &&
          String(cur.customIcon ?? '') === String(next.customIcon ?? '') &&
          cur.sortOrder === (next.sortOrder ?? i) &&
          cur.isArchived === next.isArchived
        );
      });

    if (definitionsUnchanged) {
      return existingTasks;
    }

    // Guard: never delete all tasks if there is nothing to replace them with.
    // A zero-length insert after a successful delete would permanently erase tasks.
    if (input.tasks.length === 0) {
      return existingTasks;
    }

    const { error: deleteError } = await this.supabase
      .from(ROUTINE_TASKS_TABLE)
      .delete()
      .eq('routine_id', input.routineId);

    if (deleteError) {
      throw deleteError;
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
      // Insert failed after the delete succeeded. Try to restore the previous
      // tasks so the child's routine isn't permanently empty.
      if (existingTasks.length > 0) {
        const restorePayload = existingTasks.map((t) => ({
          routine_id: input.routineId,
          task_template_id: t.taskTemplateId,
          custom_title: t.customTitle,
          custom_icon: t.customIcon,
          sort_order: t.sortOrder,
          is_archived: t.isArchived,
        }));
        await this.supabase.from(ROUTINE_TASKS_TABLE).insert(restorePayload);
      }
      throw error;
    }

    return (data ?? []).map(mapRoutineTask).sort((left, right) => left.sortOrder - right.sortOrder);
  }
}

export { mapRoutine, mapRoutineTask };
