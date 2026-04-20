import { describe, expect, it, vi, beforeEach } from 'vitest';
import { importLocalFamilyToCloud } from '@/lib/data/local-to-cloud-import';

const {
  getSupabaseClient,
  updateHomeScene,
  upsertChildProfile,
  upsertRoutine,
  replaceRoutineTasks,
} = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  updateHomeScene: vi.fn(),
  upsertChildProfile: vi.fn(),
  upsertRoutine: vi.fn(),
  replaceRoutineTasks: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient,
}));

vi.mock('@/lib/data/supabase-household-repository', () => ({
  SupabaseHouseholdRepository: class {
    updateHomeScene = updateHomeScene;
  },
}));

vi.mock('@/lib/data/supabase-child-profile-repository', () => ({
  SupabaseChildProfileRepository: class {
    upsert = upsertChildProfile;
  },
}));

vi.mock('@/lib/data/supabase-routine-repository', () => ({
  SupabaseRoutineRepository: class {
    upsertRoutine = upsertRoutine;
    replaceRoutineTasks = replaceRoutineTasks;
  },
}));

describe('importLocalFamilyToCloud', () => {
  beforeEach(() => {
    getSupabaseClient.mockReturnValue({});
    updateHomeScene.mockReset();
    upsertChildProfile.mockReset();
    upsertRoutine.mockReset();
    replaceRoutineTasks.mockReset();
    updateHomeScene.mockResolvedValue(undefined);
    upsertChildProfile.mockResolvedValue({
      id: 'cloud-child-1',
    });
    upsertRoutine
      .mockResolvedValueOnce({ id: 'cloud-routine-morning' })
      .mockResolvedValueOnce({ id: 'cloud-routine-evening' });
    replaceRoutineTasks.mockResolvedValue([]);
  });

  it('imports local children, schedules, and tasks into the cloud household', async () => {
    await importLocalFamilyToCloud({
      household: {
        id: 'house-1',
        name: 'Routine Stars Family',
        timezone: 'Europe/Madrid',
        homeScene: 'bike',
        createdByUserId: 'user-1',
        createdAt: '2026-04-20T10:00:00Z',
        updatedAt: '2026-04-20T10:00:00Z',
      },
      homeScene: 'school',
      children: [
        {
          id: 'local-child-1',
          name: 'Lily',
          age: 5,
          ageBucket: '4-6',
          avatarAnimal: 'cat',
          avatarSeed: 'seed-1',
          schedule: {
            morning: { start: '07:30', end: '08:30' },
            evening: { start: '18:00', end: '19:30' },
          },
          morning: [
            { id: 'm1', title: 'Brush teeth', icon: 'brush', completed: true },
            { id: 'm2', title: 'Water plant', icon: 'sparkles', completed: false },
          ],
          evening: [{ id: 'e1', title: 'Go to bed', icon: 'moon-star', completed: false }],
        },
      ],
    });

    expect(updateHomeScene).toHaveBeenCalledWith('house-1', 'school');
    expect(upsertChildProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        householdId: 'house-1',
        name: 'Lily',
      })
    );
    expect(upsertRoutine).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        childProfileId: 'cloud-child-1',
        type: 'morning',
        startTime: '07:30',
        endTime: '08:30',
      })
    );
    expect(replaceRoutineTasks).toHaveBeenNthCalledWith(1, {
      routineId: 'cloud-routine-morning',
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
          customTitle: 'Water plant',
          customIcon: 'sparkles',
          sortOrder: 1,
          isArchived: false,
        },
      ],
    });
  });
});
