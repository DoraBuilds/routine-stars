import { describe, expect, it, vi } from 'vitest';
import { SupabaseProgressRepository } from '@/lib/data/supabase-progress-repository';

const createSupabaseClient = (responses: Record<string, unknown>) =>
  ({
    from: vi.fn((table: string) => responses[table]),
  }) as never;

describe('SupabaseProgressRepository', () => {
  it('loads a routine progress record and its task progress rows', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'progress-1',
        child_profile_id: 'child-1',
        routine_type: 'morning',
        progress_date: '2026-04-20',
        completed_at: null,
        created_at: '2026-04-20T08:00:00Z',
        updated_at: '2026-04-20T08:00:00Z',
      },
      error: null,
    });
    const eqDate = vi.fn(() => ({ maybeSingle }));
    const eqType = vi.fn(() => ({ eq: eqDate }));
    const eqChild = vi.fn(() => ({ eq: eqType }));
    const eqRoutineProgressId = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'task-progress-1',
          daily_routine_progress_id: 'progress-1',
          routine_task_id: 'task-1',
          completed: true,
          completed_at: '2026-04-20T08:05:00Z',
          created_at: '2026-04-20T08:05:00Z',
          updated_at: '2026-04-20T08:05:00Z',
        },
      ],
      error: null,
    });
    const repository = new SupabaseProgressRepository(
      createSupabaseClient({
        daily_routine_progress: {
          select: vi.fn(() => ({ eq: eqChild })),
        },
        daily_task_progress: {
          select: vi.fn(() => ({ eq: eqRoutineProgressId })),
        },
      })
    );

    await expect(
      repository.getRoutineProgress({
        childProfileId: 'child-1',
        routineType: 'morning',
        progressDate: '2026-04-20',
      })
    ).resolves.toEqual({
      dailyRoutineProgress: expect.objectContaining({
        id: 'progress-1',
        childProfileId: 'child-1',
        routineType: 'morning',
      }),
      taskProgress: [
        expect.objectContaining({
          id: 'task-progress-1',
          routineTaskId: 'task-1',
          completed: true,
        }),
      ],
    });
  });

  it('upserts daily routine progress and task completion rows', async () => {
    const routineSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'progress-1',
        child_profile_id: 'child-1',
        routine_type: 'morning',
        progress_date: '2026-04-20',
        completed_at: null,
        created_at: '2026-04-20T08:00:00Z',
        updated_at: '2026-04-20T08:00:00Z',
      },
      error: null,
    });
    const routineSelect = vi.fn(() => ({ single: routineSingle }));
    const routineUpsert = vi.fn(() => ({ select: routineSelect }));
    const taskSingle = vi.fn().mockResolvedValue({
      data: {
        id: 'task-progress-1',
        daily_routine_progress_id: 'progress-1',
        routine_task_id: 'task-1',
        completed: true,
        completed_at: '2026-04-20T08:05:00Z',
        created_at: '2026-04-20T08:05:00Z',
        updated_at: '2026-04-20T08:05:00Z',
      },
      error: null,
    });
    const taskSelect = vi.fn(() => ({ single: taskSingle }));
    const taskUpsert = vi.fn(() => ({ select: taskSelect }));
    const repository = new SupabaseProgressRepository(
      createSupabaseClient({
        daily_routine_progress: { upsert: routineUpsert },
        daily_task_progress: { upsert: taskUpsert },
      })
    );

    await expect(
      repository.upsertRoutineProgress({
        childProfileId: 'child-1',
        routineType: 'morning',
        progressDate: '2026-04-20',
      })
    ).resolves.toMatchObject({
      id: 'progress-1',
      routineType: 'morning',
    });

    await expect(
      repository.setTaskCompletion({
        dailyRoutineProgressId: 'progress-1',
        routineTaskId: 'task-1',
        completed: true,
        completedAt: '2026-04-20T08:05:00Z',
      })
    ).resolves.toMatchObject({
      id: 'task-progress-1',
      routineTaskId: 'task-1',
      completed: true,
    });
  });
});
