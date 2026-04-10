import { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, Moon, Plus, Sparkles, Sun, UserRound } from 'lucide-react';
import type { Child, RoutineType, Task } from '@/lib/types';
import { AGE_BUCKETS, groupTasksByAge, TASK_CATALOG } from '@/lib/types';
import { TaskIcon } from './TaskIcon';
import { ChildProfileAvatar } from './ChildProfileAvatar';
import { ANIMAL_AVATARS } from './animal-avatars';

interface InitialSetupProps {
  children: Child[];
  onComplete: (children: Child[]) => void;
}

type SelectionState = Record<string, Record<RoutineType, string[]>>;
type SetupTab = 'profile' | 'routines';

const STARTER_TASKS: Record<RoutineType, string[]> = {
  morning: ['Use the toilet', 'Eat breakfast', 'Brush teeth'],
  evening: ['Use the toilet', 'Put on pajamas', 'Brush teeth'],
};

const DEFAULT_SCHEDULE = {
  morning: { start: '07:00', end: '09:00' },
  evening: { start: '17:00', end: '20:00' },
} as const;

const createChildDraft = (count: number): Child => ({
  id: crypto.randomUUID(),
  name: `Child ${count}`,
  age: 5,
  ageBucket: '4-6',
  avatarSeed: crypto.randomUUID(),
  avatarAnimal: ANIMAL_AVATARS[count % ANIMAL_AVATARS.length]?.key,
  schedule: {
    morning: { ...DEFAULT_SCHEDULE.morning },
    evening: { ...DEFAULT_SCHEDULE.evening },
  },
  morning: [],
  evening: [],
});

const buildSelectionState = (children: Child[]): SelectionState =>
  Object.fromEntries(
    children.map((child) => [
      child.id,
      {
        morning: child.morning.length > 0 ? child.morning.map((task) => task.title) : [...STARTER_TASKS.morning],
        evening: child.evening.length > 0 ? child.evening.map((task) => task.title) : [...STARTER_TASKS.evening],
      },
    ])
  );

const ensureChildSelection = (state: SelectionState, childId: string): SelectionState => {
  if (state[childId]) return state;

  return {
    ...state,
    [childId]: {
      morning: [...STARTER_TASKS.morning],
      evening: [...STARTER_TASKS.evening],
    },
  };
};

const buildRoutineTasks = (childId: string, routine: RoutineType, selectedTitles: string[]): Task[] =>
  TASK_CATALOG[routine]
    .filter((task) => selectedTitles.includes(task.title))
    .map((task, index) => ({
      id: `${childId}-${routine}-${task.id}-${index}`,
      title: task.title,
      icon: task.icon,
      completed: false,
    }));

export const InitialSetup = ({ children, onComplete }: InitialSetupProps) => {
  const [draftChildren, setDraftChildren] = useState(children);
  const [selectionState, setSelectionState] = useState<SelectionState>(() => buildSelectionState(children));
  const [activeChildId, setActiveChildId] = useState<string | null>(children[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState<SetupTab>('profile');
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');

  useEffect(() => {
    if (draftChildren.length === 0) {
      setActiveChildId(null);
      return;
    }

    setActiveChildId((current) =>
      current && draftChildren.some((child) => child.id === current) ? current : draftChildren[0].id
    );
  }, [draftChildren]);

  const activeChild = draftChildren.find((child) => child.id === activeChildId) ?? null;
  const selectedTitles = activeChild ? selectionState[activeChild.id]?.[activeRoutine] ?? [] : [];
  const readyChildren = useMemo(
    () =>
      draftChildren.filter((child) => {
        const hasProfile = child.name.trim().length > 0;
        const morningCount = selectionState[child.id]?.morning.length ?? 0;
        const eveningCount = selectionState[child.id]?.evening.length ?? 0;
        return hasProfile && morningCount > 0 && eveningCount > 0;
      }).length,
    [draftChildren, selectionState]
  );

  const updateChild = (id: string, updater: (child: Child) => Child) => {
    setDraftChildren((current) => current.map((child) => (child.id === id ? updater(child) : child)));
  };

  const addChild = () => {
    const nextChild = createChildDraft(draftChildren.length + 1);
    setDraftChildren((current) => [...current, nextChild]);
    setSelectionState((current) => ensureChildSelection(current, nextChild.id));
    setActiveChildId(nextChild.id);
    setActiveTab('profile');
  };

  const removeChild = (childId: string) => {
    setDraftChildren((current) => current.filter((child) => child.id !== childId));
    setSelectionState((current) => {
      const next = { ...current };
      delete next[childId];
      return next;
    });
  };

  const toggleTask = (childId: string, routine: RoutineType, title: string) => {
    setSelectionState((current) => {
      const resolved = ensureChildSelection(current, childId);
      const selected = resolved[childId][routine];
      const nextSelected = selected.includes(title)
        ? selected.filter((item) => item !== title)
        : [...selected, title];

      return {
        ...resolved,
        [childId]: {
          ...resolved[childId],
          [routine]: nextSelected,
        },
      };
    });
  };

  const applyCommonTasks = (childId: string, routine: RoutineType) => {
    setSelectionState((current) => {
      const resolved = ensureChildSelection(current, childId);

      return {
        ...resolved,
        [childId]: {
          ...resolved[childId],
          [routine]: TASK_CATALOG[routine].filter((task) => task.featured).map((task) => task.title),
        },
      };
    });
  };

  const handleComplete = () => {
    const configuredChildren = draftChildren.map((child) => ({
      ...child,
      name: child.name.trim() || 'Child',
      morning: buildRoutineTasks(child.id, 'morning', selectionState[child.id]?.morning ?? []),
      evening: buildRoutineTasks(child.id, 'evening', selectionState[child.id]?.evening ?? []),
    }));

    onComplete(configuredChildren);
  };

  return (
    <div className="relative min-h-svh overflow-hidden px-5 py-10 md:px-6 md:py-14">
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-64 w-[38rem] max-w-full rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute left-6 top-24 -z-10 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
      <div className="absolute right-8 top-16 -z-10 h-32 w-32 rounded-full bg-success/15 blur-2xl" />

      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-primary">Parent Setup</p>
          <h1 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">Set up your children first</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start with each child&apos;s profile, then switch to routines when you&apos;re ready to choose tasks.
          </p>
        </header>

        <div className="mt-10 grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[32px] border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-muted-foreground">Profiles</p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  {readyChildren}/{draftChildren.length} ready
                </h2>
              </div>
              <button
                type="button"
                onClick={addChild}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
              >
                <Plus size={16} /> Add child
              </button>
            </div>

            {draftChildren.length === 0 ? (
              <div className="mt-6 rounded-[28px] border border-dashed border-primary/35 bg-primary/5 p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound size={26} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">Create your first child profile</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a child first, then you can customize their name, age, avatar, and routines.
                </p>
                <button
                  type="button"
                  onClick={addChild}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
                >
                  <Plus size={16} /> Create first profile
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {draftChildren.map((child) => {
                  const isActive = child.id === activeChild?.id;
                  const isReady =
                    child.name.trim().length > 0 &&
                    (selectionState[child.id]?.morning.length ?? 0) > 0 &&
                    (selectionState[child.id]?.evening.length ?? 0) > 0;

                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setActiveChildId(child.id)}
                      className={`flex w-full items-center gap-3 rounded-[28px] border p-3 text-left transition-all ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <ChildProfileAvatar
                        name={child.name}
                        seed={child.avatarSeed ?? child.id}
                        animalKey={child.avatarAnimal}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-black text-foreground">{child.name || 'New child'}</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                          Age {child.age ?? 5} • {child.ageBucket ?? '4-6'}
                        </p>
                      </div>
                      {isReady && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check size={16} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="rounded-[36px] border border-border bg-card p-6 shadow-card md:p-8">
            {!activeChild ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles size={34} />
                </div>
                <h2 className="mt-6 text-3xl font-bold text-foreground">Start by creating a child profile</h2>
                <p className="mt-3 max-w-md text-base text-muted-foreground">
                  Once you add a child, you&apos;ll be able to edit their profile and choose their morning and evening routines.
                </p>
                <button
                  type="button"
                  onClick={addChild}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-base font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
                >
                  <Plus size={18} /> Create first profile
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.28em] text-muted-foreground">Editing</p>
                    <h2 className="mt-2 text-3xl font-bold text-foreground">{activeChild.name || 'New child'}</h2>
                    <p className="mt-2 text-base text-muted-foreground">
                      Switch between profile details and routine setup for this child.
                    </p>
                  </div>

                  <div className="inline-flex rounded-full bg-muted p-1">
                    {(['profile', 'routines'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-full px-5 py-3 text-sm font-bold transition-colors ${
                          activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                        }`}
                      >
                        {tab === 'profile' ? 'Profile' : 'Routines'}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === 'profile' ? (
                  <div className="mt-8 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <div className="rounded-[28px] bg-muted/55 p-5 text-center">
                      <ChildProfileAvatar
                        name={activeChild.name}
                        seed={activeChild.avatarSeed ?? activeChild.id}
                        animalKey={activeChild.avatarAnimal}
                        size="md"
                        className="mx-auto"
                      />
                      <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Pick an avatar
                      </p>
                      <div className="mt-4 grid grid-cols-5 gap-2">
                        {ANIMAL_AVATARS.map((avatar) => {
                          const selected = activeChild.avatarAnimal === avatar.key;

                          return (
                            <button
                              key={`${activeChild.id}-${avatar.key}`}
                              type="button"
                              onClick={() =>
                                updateChild(activeChild.id, (child) => ({
                                  ...child,
                                  avatarAnimal: avatar.key,
                                }))
                              }
                              className={`rounded-2xl border p-2 transition-all ${
                                selected
                                  ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                  : 'border-border bg-background hover:border-primary/40'
                              }`}
                              aria-label={`Choose ${avatar.label} avatar`}
                            >
                              <span className="text-2xl">{avatar.emoji}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-5">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Child&apos;s name
                        <input
                          className="mt-2 w-full rounded-2xl bg-muted px-4 py-3 text-lg font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                          value={activeChild.name}
                          onChange={(event) =>
                            updateChild(activeChild.id, (child) => ({
                              ...child,
                              name: event.target.value,
                            }))
                          }
                          placeholder="Enter child name"
                        />
                      </label>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-semibold text-muted-foreground">
                          Age
                          <input
                            type="number"
                            min={2}
                            max={12}
                            className="mt-2 w-full rounded-2xl bg-muted px-4 py-3 text-lg font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                            value={activeChild.age ?? 5}
                            onChange={(event) =>
                              updateChild(activeChild.id, (child) => ({
                                ...child,
                                age: Number(event.target.value),
                              }))
                            }
                          />
                        </label>

                        <label className="text-sm font-semibold text-muted-foreground">
                          Suggested age bucket
                          <select
                            className="mt-2 w-full rounded-2xl bg-muted px-4 py-3 text-lg font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                            value={activeChild.ageBucket ?? '4-6'}
                            onChange={(event) =>
                              updateChild(activeChild.id, (child) => ({
                                ...child,
                                ageBucket: event.target.value as Child['ageBucket'],
                              }))
                            }
                          >
                            {AGE_BUCKETS.map((bucket) => (
                              <option key={bucket.key} value={bucket.key}>
                                {bucket.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] bg-muted/50 p-4">
                        <div>
                          <p className="text-base font-bold text-foreground">Ready to pick routines?</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Switch to the routines tab when this profile looks right.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          {draftChildren.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChild(activeChild.id)}
                              className="rounded-full border border-destructive/25 px-4 py-2 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10"
                            >
                              Delete profile
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setActiveTab('routines')}
                            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
                          >
                            Go to routines
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Choose active routine tasks</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Start from a few basics, then add more if this child is ready.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {(['morning', 'evening'] as const).map((routine) => (
                          <button
                            key={routine}
                            type="button"
                            onClick={() => setActiveRoutine(routine)}
                            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                              activeRoutine === routine
                                ? routine === 'morning'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-indigo-500 text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {routine === 'morning' ? <Sun size={18} /> : <Moon size={18} />}
                            {routine === 'morning' ? 'Morning' : 'Evening'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                      <div className="rounded-[28px] bg-muted/55 p-5">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                              activeRoutine === 'morning' ? 'bg-primary/10 text-primary' : 'bg-indigo-500/10 text-indigo-500'
                            }`}
                          >
                            {activeRoutine === 'morning' ? <Sun size={22} /> : <Moon size={22} />}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              {activeRoutine === 'morning' ? 'Morning routine' : 'Evening routine'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Tap tasks to add or remove them from this child&apos;s active list.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => applyCommonTasks(activeChild.id, activeRoutine)}
                            className="ml-auto rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                          >
                            Use common tasks
                          </button>
                        </div>

                        {selectedTitles.length <= 3 && (
                          <div className="mb-5 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                            We started with a few basics. Add one or two more if this routine needs them.
                          </div>
                        )}

                        <div className="space-y-5">
                          {groupTasksByAge(TASK_CATALOG[activeRoutine]).map((group) => (
                            <section key={`${activeChild.id}-${activeRoutine}-${group.key}`}>
                              <div className="mb-3">
                                <h4 className="text-sm font-black uppercase tracking-[0.22em] text-foreground">
                                  {group.label}
                                </h4>
                                <p className="mt-1 text-xs text-muted-foreground">{group.description}</p>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {group.tasks.map((task) => {
                                  const isSelected = selectedTitles.includes(task.title);

                                  return (
                                    <button
                                      key={`${activeChild.id}-${activeRoutine}-${task.id}`}
                                      type="button"
                                      onClick={() => toggleTask(activeChild.id, activeRoutine, task.title)}
                                      className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                                        isSelected
                                          ? 'border-primary bg-primary/10 shadow-sm'
                                          : 'border-border bg-card hover:border-primary/40 hover:bg-background'
                                      }`}
                                    >
                                      <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary'
                                        }`}
                                      >
                                        <TaskIcon iconKey={task.icon} size={22} strokeWidth={2.5} />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                          <p className="text-sm font-bold text-foreground">{task.title}</p>
                                          {isSelected && <Check size={16} className="mt-0.5 text-primary" />}
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                          {isSelected ? 'Selected for this routine' : 'Available to add'}
                                        </p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </section>
                          ))}
                        </div>
                      </div>

                      <aside className="rounded-[28px] bg-background p-5">
                        <div className="flex items-center gap-2 text-foreground">
                          <Clock3 size={18} />
                          <h3 className="text-lg font-bold">When should it show?</h3>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          This controls whether morning or evening is due on the home screen.
                        </p>

                        <div className="mt-5 space-y-4">
                          {(['morning', 'evening'] as const).map((routine) => (
                            <div key={`${activeChild.id}-${routine}`} className="rounded-2xl bg-muted/55 p-4">
                              <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
                                {routine === 'morning' ? 'Morning time' : 'Evening time'}
                              </p>
                              <div className="mt-3 grid grid-cols-2 gap-3">
                                <label className="text-sm font-medium text-foreground">
                                  Start
                                  <input
                                    type="time"
                                    value={activeChild.schedule?.[routine].start ?? (routine === 'morning' ? '07:00' : '17:00')}
                                    onChange={(event) =>
                                      updateChild(activeChild.id, (child) => ({
                                        ...child,
                                        schedule: {
                                          morning: child.schedule?.morning ?? { ...DEFAULT_SCHEDULE.morning },
                                          evening: child.schedule?.evening ?? { ...DEFAULT_SCHEDULE.evening },
                                          [routine]: {
                                            start: event.target.value,
                                            end: child.schedule?.[routine].end ?? (routine === 'morning' ? '09:00' : '20:00'),
                                          },
                                        },
                                      }))
                                    }
                                    className="mt-2 w-full rounded-xl bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                                  />
                                </label>
                                <label className="text-sm font-medium text-foreground">
                                  End
                                  <input
                                    type="time"
                                    value={activeChild.schedule?.[routine].end ?? (routine === 'morning' ? '09:00' : '20:00')}
                                    onChange={(event) =>
                                      updateChild(activeChild.id, (child) => ({
                                        ...child,
                                        schedule: {
                                          morning: child.schedule?.morning ?? { ...DEFAULT_SCHEDULE.morning },
                                          evening: child.schedule?.evening ?? { ...DEFAULT_SCHEDULE.evening },
                                          [routine]: {
                                            start: child.schedule?.[routine].start ?? (routine === 'morning' ? '07:00' : '17:00'),
                                            end: event.target.value,
                                          },
                                        },
                                      }))
                                    }
                                    className="mt-2 w-full rounded-xl bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                                  />
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </aside>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {draftChildren.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[32px] border border-border bg-card px-6 py-5 shadow-card md:flex-row">
            <div>
              <h3 className="text-xl font-bold text-foreground">Finish setup</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You can always keep editing profiles and routines later in Parent Settings.
              </p>
            </div>
            <button
              type="button"
              onClick={handleComplete}
              className="rounded-full bg-foreground px-6 py-3 text-base font-bold text-background shadow-button transition-transform active:translate-y-0.5"
            >
              Save and open the app
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
