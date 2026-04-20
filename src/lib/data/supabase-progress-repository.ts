import type { SupabaseClient } from '@supabase/supabase-js';
import type { DailyRoutineProgressRecord, DailyTaskProgressRecord } from './models';
import type { ProgressRepository } from './repositories';

const DAILY_ROUTINE_PROGRESS_TABLE = 'daily_routine_progress';
const DAILY_TASK_PROGRESS_TABLE = 'daily_task_progress';

const mapDailyRoutineProgress = (row: Record<string, unknown>): DailyRoutineProgressRecord => ({
  id: String(row.id),
  childProfileId: String(row.child_profile_id),
  routineType: String(row.routine_type) as DailyRoutineProgressRecord['routineType'],
  progressDate: String(row.progress_date),
  completedAt: row.completed_at === null || row.completed_at === undefined ? null : String(row.completed_at),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const mapDailyTaskProgress = (row: Record<string, unknown>): DailyTaskProgressRecord => ({
  id: String(row.id),
  dailyRoutineProgressId: String(row.daily_routine_progress_id),
  routineTaskId: String(row.routine_task_id),
  completed: Boolean(row.completed),
  completedAt: row.completed_at === null || row.completed_at === undefined ? null : String(row.completed_at),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

export class SupabaseProgressRepository implements ProgressRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getRoutineProgress(input: {
    childProfileId: string;
    routineType: 'morning' | 'evening';
    progressDate: string;
  }) {
    const { data: dailyRoutineRow, error: dailyRoutineError } = await this.supabase
      .from(DAILY_ROUTINE_PROGRESS_TABLE)
      .select('*')
      .eq('child_profile_id', input.childProfileId)
      .eq('routine_type', input.routineType)
      .eq('progress_date', input.progressDate)
      .maybeSingle();

    if (dailyRoutineError) {
      throw dailyRoutineError;
    }

    if (!dailyRoutineRow) {
      return {
        dailyRoutineProgress: null,
        taskProgress: [],
      };
    }

    const { data: taskProgressRows, error: taskProgressError } = await this.supabase
      .from(DAILY_TASK_PROGRESS_TABLE)
      .select('*')
      .eq('daily_routine_progress_id', dailyRoutineRow.id);

    if (taskProgressError) {
      throw taskProgressError;
    }

    return {
      dailyRoutineProgress: mapDailyRoutineProgress(dailyRoutineRow),
      taskProgress: (taskProgressRows ?? []).map(mapDailyTaskProgress),
    };
  }

  async upsertRoutineProgress(input: {
    childProfileId: string;
    routineType: 'morning' | 'evening';
    progressDate: string;
    completedAt?: string | null;
  }) {
    const { data, error } = await this.supabase
      .from(DAILY_ROUTINE_PROGRESS_TABLE)
      .upsert(
        {
          child_profile_id: input.childProfileId,
          routine_type: input.routineType,
          progress_date: input.progressDate,
          completed_at: input.completedAt ?? null,
        },
        { onConflict: 'child_profile_id,routine_type,progress_date' }
      )
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapDailyRoutineProgress(data);
  }

  async setTaskCompletion(input: {
    dailyRoutineProgressId: string;
    routineTaskId: string;
    completed: boolean;
    completedAt?: string | null;
  }) {
    const { data, error } = await this.supabase
      .from(DAILY_TASK_PROGRESS_TABLE)
      .upsert(
        {
          daily_routine_progress_id: input.dailyRoutineProgressId,
          routine_task_id: input.routineTaskId,
          completed: input.completed,
          completed_at: input.completed ? input.completedAt ?? null : null,
        },
        { onConflict: 'daily_routine_progress_id,routine_task_id' }
      )
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapDailyTaskProgress(data);
  }
}

export { mapDailyRoutineProgress, mapDailyTaskProgress };
