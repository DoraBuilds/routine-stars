import { describe, expect, it, vi } from 'vitest';
import { SupabaseRoutineRepository } from '@/lib/data/supabase-routine-repository';

const createSupabaseClient = (responses: Record<string, unknown>) =>
  ({
    from: vi.fn((table: string) => responses[table]),
  }) as never;

describe('SupabaseRoutineRepository', () => {
  it('lists routines and their tasks for a child profile', async () => {
    const routineOrder = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'routine-1',
          child_profile_id: 'child-1',
          type: 'morning',
          start_time: '07:00',
          end_time: '09:00',
          created_at: '2026-04-20T10:00:00Z',
          updated_at: '2026-04-20T10:00:00Z',
        },
      ],
      error: null,
    });
    const taskOrder = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'task-1',
          routine_id: 'routine-1',
          task_template_id: 'brush-teeth',
          custom_title: null,
          custom_icon: null,
          sort_order: 0,
          is_archived: false,
          created_at: '2026-04-20T10:00:00Z',
          updated_at: '2026-04-20T10:00:00Z',
        },
      ],
      error: null,
    });
    const repository = new SupabaseRoutineRepository(
      createSupabaseClient({
        routines: {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({ order: routineOrder })),
          })),
        },
        routine_tasks: {
          select: vi.fn(() => ({
            in: vi.fn(() => ({ order: taskOrder })),
          })),
        },
      })
    );

    await expect(repository.listByChild('child-1')).resolves.toEqual({
      routines: [
        {
          id: 'routine-1',
          childProfileId: 'child-1',
          type: 'morning',
          startTime: '07:00',
          endTime: '09:00',
          createdAt: '2026-04-20T10:00:00Z',
          updatedAt: '2026-04-20T10:00:00Z',
        },
      ],
      routineTasks: [
        {
          id: 'task-1',
          routineId: 'routine-1',
          taskTemplateId: 'brush-teeth',
          customTitle: null,
          customIcon: null,
          sortOrder: 0,
          isArchived: false,
          createdAt: '2026-04-20T10:00:00Z',
          updatedAt: '2026-04-20T10:00:00Z',
        },
      ],
    });
  });

  it('upserts routines using the child/type unique key', async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: 'routine-1',
        child_profile_id: 'child-1',
        type: 'morning',
        start_time: '07:00',
        end_time: '09:00',
        created_at: '2026-04-20T10:00:00Z',
        updated_at: '2026-04-20T10:05:00Z',
      },
      error: null,
    });
    const select = vi.fn(() => ({ single }));
    const upsert = vi.fn(() => ({ select }));
    const repository = new SupabaseRoutineRepository(
      createSupabaseClient({
        routines: { upsert },
      })
    );

    await expect(
      repository.upsertRoutine({
        id: 'routine-1',
        childProfileId: 'child-1',
        type: 'morning',
        startTime: '07:00',
        endTime: '09:00',
      })
    ).resolves.toMatchObject({
      id: 'routine-1',
      childProfileId: 'child-1',
      type: 'morning',
    });

    expect(upsert).toHaveBeenCalledWith(
      {
        id: 'routine-1',
        child_profile_id: 'child-1',
        type: 'morning',
        start_time: '07:00',
        end_time: '09:00',
      },
      { onConflict: 'child_profile_id,type' }
    );
  });

  it('replaces routine tasks by clearing old rows and inserting the new set', async () => {
    const deleteEq = vi.fn().mockResolvedValue({ error: null });
    const insertSelect = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'task-2',
          routine_id: 'routine-1',
          task_template_id: null,
          custom_title: 'Pack lunch',
          custom_icon: 'chef-hat',
          sort_order: 1,
          is_archived: false,
          created_at: '2026-04-20T10:00:00Z',
          updated_at: '2026-04-20T10:00:00Z',
        },
        {
          id: 'task-1',
          routine_id: 'routine-1',
          task_template_id: 'brush-teeth',
          custom_title: null,
          custom_icon: null,
          sort_order: 0,
          is_archived: false,
          created_at: '2026-04-20T10:00:00Z',
          updated_at: '2026-04-20T10:00:00Z',
        },
      ],
      error: null,
    });
    const insert = vi.fn(() => ({ select: insertSelect }));
    const repository = new SupabaseRoutineRepository(
      createSupabaseClient({
        routine_tasks: {
          delete: vi.fn(() => ({ eq: deleteEq })),
          insert,
        },
      })
    );

    await expect(
      repository.replaceRoutineTasks({
        routineId: 'routine-1',
        tasks: [
          {
            taskTemplateId: 'brush-teeth',
            customTitle: null,
            customIcon: null,
            sortOrder: 0,
            isArchived: false,
          },
          {
            taskTemplateId: null,
            customTitle: 'Pack lunch',
            customIcon: 'chef-hat',
            sortOrder: 1,
            isArchived: false,
          },
        ],
      })
    ).resolves.toEqual([
      expect.objectContaining({ id: 'task-1', sortOrder: 0 }),
      expect.objectContaining({ id: 'task-2', sortOrder: 1 }),
    ]);

    expect(deleteEq).toHaveBeenCalledWith('routine_id', 'routine-1');
    expect(insert).toHaveBeenCalledWith([
      {
        routine_id: 'routine-1',
        task_template_id: 'brush-teeth',
        custom_title: null,
        custom_icon: null,
        sort_order: 0,
        is_archived: false,
      },
      {
        routine_id: 'routine-1',
        task_template_id: null,
        custom_title: 'Pack lunch',
        custom_icon: 'chef-hat',
        sort_order: 1,
        is_archived: false,
      },
    ]);
  });
});
