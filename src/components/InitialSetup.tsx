import { useMemo, useState } from 'react';
import { Check, Clock3, Moon, Sparkles, Sun } from 'lucide-react';
import type { Child, RoutineType, Task } from '@/lib/types';
import { groupTasksByAge, TASK_CATALOG } from '@/lib/types';
import { TaskIcon } from './TaskIcon';
import { ChildProfileAvatar } from './ChildProfileAvatar';

interface InitialSetupProps {
  children: Child[];
  onComplete: (children: Child[]) => void;
}

type SelectionState = Record<string, Record<RoutineType, string[]>>;

const STARTER_TASKS: Record<RoutineType, string[]> = {
  morning: ['Use the toilet', 'Eat breakfast', 'Brush teeth'],
  evening: ['Use the toilet', 'Put on pajamas', 'Brush teeth'],
};

const ROUTINE_ORDER: RoutineType[] = ['morning', 'evening'];

const buildSelectionState = (children: Child[]): SelectionState =>
  Object.fromEntries(
    children.map((child) => [
      child.id,
      {
        morning: child.morning.length > 0 ? child.morning.map((task) => task.title) : STARTER_TASKS.morning,
        evening: child.evening.length > 0 ? child.evening.map((task) => task.title) : STARTER_TASKS.evening,
      },
    ])
  );

const buildRoutineTasks = (childId: string, routine: RoutineType, selectedTitles: string[]): Task[] =>
  TASK_CATALOG[routine]
    .filter((task) => selectedTitles.includes(task.title))
    .map((task, index) => ({
      id: `${childId}-${routine}-${task.id}-${index}`,
      title: task.title,
      icon: task.icon,
      completed: false,
    }));

const getNextStep = (children: Child[], childId: string, routine: RoutineType) => {
  const childIndex = children.findIndex((child) => child.id === childId);
  const routineIndex = ROUTINE_ORDER.indexOf(routine);

  if (routineIndex < ROUTINE_ORDER.length - 1) {
    return { childId, routine: ROUTINE_ORDER[routineIndex + 1] };
  }

  if (childIndex < children.length - 1) {
    return { childId: children[childIndex + 1].id, routine: 'morning' as const };
  }

  return null;
};

export const InitialSetup = ({ children, onComplete }: InitialSetupProps) => {
  const [selectionState, setSelectionState] = useState<SelectionState>(() => buildSelectionState(children));
  const [draftChildren, setDraftChildren] = useState(children);
  const [activeChildId, setActiveChildId] = useState(children[0]?.id ?? null);
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');

  const activeChild = draftChildren.find((child) => child.id === activeChildId) ?? draftChildren[0];
  const selectedTitles = activeChild ? selectionState[activeChild.id]?.[activeRoutine] ?? [] : [];
  const nextStep = activeChild ? getNextStep(draftChildren, activeChild.id, activeRoutine) : null;

  const completedSteps = useMemo(
    () =>
      draftChildren.reduce((total, child) => {
        const morningCount = selectionState[child.id]?.morning.length ?? 0;
        const eveningCount = selectionState[child.id]?.evening.length ?? 0;
        return total + Number(morningCount > 0) + Number(eveningCount > 0);
      }, 0),
    [draftChildren, selectionState]
  );

  const updateChild = (id: string, updater: (child: Child) => Child) => {
    setDraftChildren((current) => current.map((child) => (child.id === id ? updater(child) : child)));
  };

  const toggleTask = (childId: string, routine: RoutineType, title: string) => {
    setSelectionState((current) => {
      const selected = current[childId]?.[routine] ?? [];
      const nextSelected = selected.includes(title)
        ? selected.filter((item) => item !== title)
        : [...selected, title];

      return {
        ...current,
        [childId]: {
          ...current[childId],
          [routine]: nextSelected,
        },
      };
    });
  };

  const applyCommonTasks = (childId: string, routine: RoutineType) => {
    setSelectionState((current) => ({
      ...current,
      [childId]: {
        ...current[childId],
        [routine]: TASK_CATALOG[routine].filter((task) => task.featured).map((task) => task.title),
      },
    }));
  };

  const copyFromSibling = (targetChildId: string, sourceChildId: string) => {
    setSelectionState((current) => ({
      ...current,
      [targetChildId]: {
        morning: [...(current[sourceChildId]?.morning ?? [])],
        evening: [...(current[sourceChildId]?.evening ?? [])],
      },
    }));
  };

  const handleComplete = () => {
    const configuredChildren = draftChildren.map((child) => ({
      ...child,
      morning: buildRoutineTasks(child.id, 'morning', selectionState[child.id]?.morning ?? []),
      evening: buildRoutineTasks(child.id, 'evening', selectionState[child.id]?.evening ?? []),
    }));

    onComplete(configuredChildren);
  };

  if (!activeChild) {
    return null;
  }

  return (
    <div className="relative min-h-svh overflow-hidden px-5 py-10 md:px-6 md:py-14">
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-64 w-[38rem] max-w-full rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute left-6 top-24 -z-10 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
      <div className="absolute right-8 top-16 -z-10 h-32 w-32 rounded-full bg-success/15 blur-2xl" />

      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-primary">Parent Setup</p>
          <h1 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">
            Build one routine at a time
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose a child, choose morning or evening, then pick the tasks that fit. We start with just a few
            basics so the setup does not feel overwhelming.
          </p>
        </header>

        <div className="mt-10 grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[32px] border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-muted-foreground">Progress</p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  {completedSteps}/{draftChildren.length * 2} routines ready
                </h2>
              </div>
              <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                {activeRoutine === 'morning' ? 'Morning' : 'Evening'}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {draftChildren.map((child) => {
                const isActive = child.id === activeChild.id;
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
                      <p className="text-lg font-black text-foreground">{child.name}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Age {child.age ?? 5} • {child.ageBucket ?? '4-6'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[28px] bg-muted/60 p-4">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-foreground">Quick help</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Start small, then add more. A child only needs a few active steps to begin using the app.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {draftChildren
                  .filter((child) => child.id !== activeChild.id)
                  .map((child) => (
                    <button
                      key={`${activeChild.id}-${child.id}`}
                      type="button"
                      onClick={() => copyFromSibling(activeChild.id, child.id)}
                      className="rounded-full border border-border bg-background px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      Copy {child.name}
                    </button>
                  ))}
              </div>
            </div>
          </aside>

          <section className="rounded-[36px] border border-border bg-card p-6 shadow-card md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-muted-foreground">Setting up</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground">{activeChild.name}</h2>
                <p className="mt-2 text-base text-muted-foreground">
                  Pick the {activeRoutine} tasks that make sense for this child.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveRoutine('morning')}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                    activeRoutine === 'morning'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Sun size={18} /> Morning
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoutine('evening')}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                    activeRoutine === 'evening'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Moon size={18} /> Evening
                </button>
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
                      Tap tasks to add or remove them from the active list.
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
                                  morning: child.schedule?.morning ?? { start: '07:00', end: '09:00' },
                                  evening: child.schedule?.evening ?? { start: '17:00', end: '20:00' },
                                  [routine]: {
                                    start: event.target.value,
                                    end: child.schedule?.[routine].end ?? (routine === 'morning' ? '09:00' : '20:00'),
                                  },
                                },
                              }))
                            }
                            className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
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
                                  morning: child.schedule?.morning ?? { start: '07:00', end: '09:00' },
                                  evening: child.schedule?.evening ?? { start: '17:00', end: '20:00' },
                                  [routine]: {
                                    start: child.schedule?.[routine].start ?? (routine === 'morning' ? '07:00' : '17:00'),
                                    end: event.target.value,
                                  },
                                },
                              }))
                            }
                            className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-full bg-accent/15 px-4 py-2 text-sm font-bold text-accent">
                <Sparkles size={16} className="mr-2 inline-block" />
                You can edit names, ages, avatars, and tasks later in Parent Settings
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                {nextStep ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChildId(nextStep.childId);
                      setActiveRoutine(nextStep.routine);
                    }}
                    className="rounded-2xl bg-foreground px-6 py-3 text-base font-bold text-background shadow-button transition-transform active:translate-y-0.5"
                  >
                    Save And Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="rounded-2xl bg-foreground px-8 py-4 text-lg font-bold text-background shadow-button transition-transform active:translate-y-0.5"
                  >
                    Save Routines And Start
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
