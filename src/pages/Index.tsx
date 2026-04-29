import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChildSelector } from '@/components/ChildSelector';
import { AccountEntryScreen } from '@/components/AccountEntryScreen';
import { ImportFamilySetupScreen } from '@/components/ImportFamilySetupScreen';
import { InitialSetup } from '@/components/InitialSetup';
import { RoutineView } from '@/components/RoutineView';
import { ParentSettings } from '@/components/ParentSettings';
import { useAuth } from '@/lib/auth/use-auth';
import { loadCloudHouseholdState } from '@/lib/data/cloud-household-state';
import { saveHouseholdConfigToCloud } from '@/lib/data/cloud-household-write';
import { importLocalFamilyToCloud } from '@/lib/data/local-to-cloud-import';
import { SupabaseProgressRepository } from '@/lib/data/supabase-progress-repository';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { AppView, Child, HomeScene, RoutineType } from '@/lib/types';
import {
  clearLocalAppState,
  loadLocalAppState,
  saveLocalAppState,
} from '@/lib/storage/local-app-state';

const parseTime = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const isWithinSchedule = (start: string, end: string, minutes: number) => {
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);

  if (startMinutes <= endMinutes) {
    return minutes >= startMinutes && minutes <= endMinutes;
  }

  return minutes >= startMinutes || minutes <= endMinutes;
};

export const getDueRoutine = (child: Child, now: Date): RoutineType | null => {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const morning = child.schedule?.morning;
  const evening = child.schedule?.evening;

  if (morning && isWithinSchedule(morning.start, morning.end, minutes)) {
    return 'morning';
  }

  if (evening && isWithinSchedule(evening.start, evening.end, minutes)) {
    return 'evening';
  }

  return null;
};

const getDisplayRoutine = (child: Child, now: Date): RoutineType => {
  const dueRoutine = getDueRoutine(child, now);
  if (dueRoutine) return dueRoutine;

  const minutes = now.getHours() * 60 + now.getMinutes();
  const morningStart = child.schedule?.morning ? parseTime(child.schedule.morning.start) : null;
  const eveningStart = child.schedule?.evening ? parseTime(child.schedule.evening.start) : null;

  if (eveningStart !== null && minutes >= eveningStart) return 'evening';
  if (morningStart !== null && minutes >= morningStart) return 'morning';
  if (morningStart !== null) return 'morning';
  if (eveningStart !== null) return 'evening';

  return 'morning';
};

const createSetupChildren = (): Child[] => [];
const getLocalProgressDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const mergeLocalProgressIntoChildren = (cloudChildren: Child[], localChildren: Child[]) =>
  cloudChildren.map((cloudChild) => {
    const localChild = localChildren.find((candidate) => candidate.id === cloudChild.id);
    if (!localChild) {
      return cloudChild;
    }

    const mergeRoutine = (routineType: RoutineType) =>
      cloudChild[routineType].map((cloudTask) => {
        const localTask = localChild[routineType].find((candidate) => candidate.id === cloudTask.id);
        return localTask ? { ...cloudTask, completed: localTask.completed } : cloudTask;
      });

    return {
      ...cloudChild,
      morning: mergeRoutine('morning'),
      evening: mergeRoutine('evening'),
    };
  });

const syncPendingProgressToCloud = async (input: { children: Child[] }) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const progressRepository = new SupabaseProgressRepository(supabase);
  const progressDate = getLocalProgressDate(new Date());

  await Promise.all(
    input.children.flatMap((child) =>
      (['morning', 'evening'] as const).map(async (routineType) => {
        const tasks = child[routineType];
        const completedTasks = tasks.filter((task) => task.completed);
        const dailyRoutineProgress = await progressRepository.upsertRoutineProgress({
          childProfileId: child.id,
          routineType,
          progressDate,
          completedAt: completedTasks.length === tasks.length && tasks.length > 0 ? new Date().toISOString() : null,
        });

        await Promise.all(
          tasks.map((task) =>
            progressRepository.setTaskCompletion({
              dailyRoutineProgressId: dailyRoutineProgress.id,
              routineTaskId: task.id,
              completed: task.completed,
              completedAt: task.completed ? new Date().toISOString() : null,
            })
          )
        );
      })
    )
  );
};

const serializeHouseholdConfig = (input: {
  children: Child[];
  homeScene: HomeScene;
  setupComplete: boolean;
}) =>
  JSON.stringify({
    children: input.children.map((child) => ({
      id: child.id,
      name: child.name,
      age: child.age ?? null,
      ageBucket: child.ageBucket ?? null,
      avatarAnimal: child.avatarAnimal ?? null,
      avatarSeed: child.avatarSeed ?? null,
      schedule: child.schedule ?? null,
      morning: child.morning.map((task) => ({
        id: task.id,
        title: task.title,
        icon: task.icon,
      })),
      evening: child.evening.map((task) => ({
        id: task.id,
        title: task.title,
        icon: task.icon,
      })),
    })),
    homeScene: input.homeScene,
    setupComplete: input.setupComplete,
  });

const Index = () => {
  const { status: authStatus, householdStatus, household } = useAuth();
  const [view, setView] = useState<AppView>('setup');
  const [children, setChildren] = useState<Child[]>(createSetupChildren);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [homeScene, setHomeScene] = useState<HomeScene>('bike');
  const [pendingCloudProgressSync, setPendingCloudProgressSync] = useState(false);
  const lastSyncedConfigRef = useRef<string | null>(null);
  const shouldSyncFirstConfigRef = useRef(false);

  const resetToFreshSetup = useCallback(() => {
    clearLocalAppState();
    setChildren(createSetupChildren());
    setActiveChildId(null);
    setSetupComplete(false);
    setHomeScene('bike');
    setPendingCloudProgressSync(false);
    setView('setup');
    setNow(new Date());
  }, []);

  const restartSetup = useCallback(() => {
    setActiveChildId(null);
    setSetupComplete(false);
    setPendingCloudProgressSync(false);
    setView('setup');
    setNow(new Date());
  }, []);

  // Load from localStorage once auth has settled so startup can be account-aware.
  useEffect(() => {
    if (authStatus === 'loading' || (authStatus === 'signed_in' && householdStatus === 'loading')) {
      return;
    }

    let isMounted = true;

    const bootstrap = async () => {
      const storedState = loadLocalAppState();
      let cloudState: Awaited<ReturnType<typeof loadCloudHouseholdState>> | null = null;

      if (authStatus === 'signed_in' && householdStatus === 'ready' && household) {
        try {
          cloudState = await loadCloudHouseholdState(household);
        } catch (error) {
          console.warn('Could not load cloud household state.', error);
        }
      }

      if (storedState) {
        const storedStateIsToday = storedState.lastReset === new Date().toDateString();

        if (authStatus === 'signed_in' && householdStatus === 'ready' && household && cloudState?.children.length) {
          if (isMounted) {
            const nextChildren =
              storedStateIsToday && storedState.pendingCloudProgressSync
                ? mergeLocalProgressIntoChildren(cloudState.children, storedState.children)
                : cloudState.children;
            setChildren(nextChildren);
            setHomeScene(cloudState.homeScene);
            setSetupComplete(cloudState.children.length > 0);
            setPendingCloudProgressSync(storedStateIsToday && storedState.pendingCloudProgressSync);
            setView(cloudState.children.length > 0 ? 'home' : 'setup');
            lastSyncedConfigRef.current = serializeHouseholdConfig({
              children: nextChildren,
              homeScene: cloudState.homeScene,
              setupComplete: cloudState.children.length > 0,
            });
            shouldSyncFirstConfigRef.current = false;
            setIsReady(true);
          }
          return;
        }

        if (
          authStatus === 'signed_in' &&
          householdStatus === 'ready' &&
          household &&
          storedState.children.length > 0 &&
          (cloudState?.children.length ?? 0) === 0
        ) {
          if (isMounted) {
            setChildren(storedState.children);
            setHomeScene(storedState.homeScene);
            setSetupComplete(storedState.setupComplete);
            setPendingCloudProgressSync(storedStateIsToday && storedState.pendingCloudProgressSync);
            setView('import');
            setIsReady(true);
          }
          return;
        }

        const today = new Date().toDateString();
        if (storedState.lastReset !== today) {
          const reset = storedState.children.map((c: Child) => ({
            ...c,
            morning: c.morning.map((t: Child['morning'][0]) => ({ ...t, completed: false })),
            evening: c.evening.map((t: Child['evening'][0]) => ({ ...t, completed: false })),
          }));
          if (isMounted) {
            setChildren(reset);
          }
        } else if (isMounted) {
          setChildren(storedState.children);
        }

        if (isMounted) {
          setSetupComplete(storedState.setupComplete);
          setHomeScene(storedState.homeScene);
          setPendingCloudProgressSync(storedState.lastReset === today ? storedState.pendingCloudProgressSync : false);
          setView(
            storedState.setupComplete
              ? 'home'
              : storedState.children.length > 0 || authStatus === 'signed_in'
                ? 'setup'
                : 'account'
          );
          setIsReady(true);
        }
        return;
      }

      if (cloudState) {
        if (!isMounted) return;

        setChildren(cloudState.children);
        setHomeScene(cloudState.homeScene);
        setSetupComplete(cloudState.children.length > 0);
        setPendingCloudProgressSync(false);
        setView(cloudState.children.length > 0 ? 'home' : 'setup');
        if (cloudState.children.length > 0) {
          lastSyncedConfigRef.current = serializeHouseholdConfig({
            children: cloudState.children,
            homeScene: cloudState.homeScene,
            setupComplete: true,
          });
          shouldSyncFirstConfigRef.current = false;
        } else if (authStatus === 'signed_in') {
          shouldSyncFirstConfigRef.current = true;
        }
        setIsReady(true);
        return;
      }

      if (isMounted) {
        setChildren(createSetupChildren());
        setSetupComplete(false);
        setHomeScene('bike');
        setPendingCloudProgressSync(false);
        setView(authStatus === 'signed_in' ? 'setup' : 'account');
        shouldSyncFirstConfigRef.current = authStatus === 'signed_in';
        setIsReady(true);
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [authStatus, household, householdStatus]);

  const householdConfigSignature = useMemo(
    () => serializeHouseholdConfig({ children, homeScene, setupComplete }),
    [children, homeScene, setupComplete]
  );

  useEffect(() => {
    if (!isReady || authStatus !== 'signed_in' || householdStatus !== 'ready' || !household || !setupComplete) {
      lastSyncedConfigRef.current = null;
      return;
    }

    if (lastSyncedConfigRef.current === null) {
      if (!shouldSyncFirstConfigRef.current) {
        lastSyncedConfigRef.current = householdConfigSignature;
        return;
      }
    }

    if (lastSyncedConfigRef.current === householdConfigSignature) {
      return;
    }

    shouldSyncFirstConfigRef.current = false;
    lastSyncedConfigRef.current = householdConfigSignature;

    void saveHouseholdConfigToCloud({
      household,
      children,
      homeScene,
      removeMissingChildren: true,
    }).catch((error) => {
      console.warn('Could not sync household configuration to cloud.', error);
    });
  }, [authStatus, children, homeScene, household, householdConfigSignature, householdStatus, isReady, setupComplete]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const syncNow = () => setNow(new Date());

    window.addEventListener('focus', syncNow);
    document.addEventListener('visibilitychange', syncNow);

    return () => {
      window.removeEventListener('focus', syncNow);
      document.removeEventListener('visibilitychange', syncNow);
    };
  }, []);

  // Persist
  useEffect(() => {
    if (!isReady) return;

    try {
      saveLocalAppState({
        children,
        homeScene,
        lastReset: new Date().toDateString(),
        setupComplete,
        pendingCloudProgressSync,
      });
    } catch (error) {
      console.warn('Could not save app state to local storage.', error);
    }
  }, [children, homeScene, isReady, pendingCloudProgressSync, setupComplete]);

  useEffect(() => {
    if (
      !isReady ||
      !pendingCloudProgressSync ||
      authStatus !== 'signed_in' ||
      householdStatus !== 'ready' ||
      !household ||
      !setupComplete
    ) {
      return;
    }

    let cancelled = false;

    void syncPendingProgressToCloud({ children })
      .then(() => {
        if (!cancelled) {
          setPendingCloudProgressSync(false);
        }
      })
      .catch((error) => {
        console.warn('Could not flush pending local progress to cloud.', error);
      });

    return () => {
      cancelled = true;
    };
  }, [authStatus, children, household, householdStatus, isReady, pendingCloudProgressSync, setupComplete]);

  const activeChild = children.find((c) => c.id === activeChildId);
  const activeRoutine = activeChild ? getDisplayRoutine(activeChild, now) : 'morning';

  const toggleTask = useCallback(
    (taskId: string) => {
      if (!activeChild) return;

      const resolvedRoutine = getDisplayRoutine(activeChild, new Date());
      const toggledAt = new Date().toISOString();
      let nextProgressWrite:
        | {
            childId: string;
            routineType: RoutineType;
            taskId: string;
            completed: boolean;
            completedAt: string | null;
            routineCompleted: boolean;
          }
        | null = null;

      const nextRoutine = activeChild[resolvedRoutine].map((task) => {
        if (task.id !== taskId) return task;

        const completed = !task.completed;
        nextProgressWrite = {
          childId: activeChild.id,
          routineType: resolvedRoutine,
          taskId,
          completed,
          completedAt: completed ? toggledAt : null,
          routineCompleted: false,
        };

        return { ...task, completed };
      });

      if (!nextProgressWrite) return;

      const routineCompleted = nextRoutine.length > 0 && nextRoutine.every((task) => task.completed);
      nextProgressWrite = {
        ...nextProgressWrite,
        routineCompleted,
      };

      setChildren((prev) =>
        prev.map((child) =>
          child.id === activeChild.id
            ? {
                ...child,
                [resolvedRoutine]: nextRoutine,
              }
            : child
        )
      );

      if (
        nextProgressWrite &&
        authStatus === 'signed_in' &&
        householdStatus === 'ready' &&
        household
      ) {
        const supabase = getSupabaseClient();
        if (!supabase) return;

        const progressRepository = new SupabaseProgressRepository(supabase);
        const progressDate = getLocalProgressDate(new Date());
        setPendingCloudProgressSync(true);

        void progressRepository
          .upsertRoutineProgress({
            childProfileId: nextProgressWrite.childId,
            routineType: nextProgressWrite.routineType,
            progressDate,
            completedAt: null,
          })
          .then(async (dailyRoutineProgress) => {
            await progressRepository.setTaskCompletion({
              dailyRoutineProgressId: dailyRoutineProgress.id,
              routineTaskId: nextProgressWrite.taskId,
              completed: nextProgressWrite.completed,
              completedAt: nextProgressWrite.completedAt,
            });

            await progressRepository.upsertRoutineProgress({
              childProfileId: nextProgressWrite.childId,
              routineType: nextProgressWrite.routineType,
              progressDate,
              completedAt: nextProgressWrite.routineCompleted ? new Date().toISOString() : null,
            });
            setPendingCloudProgressSync(false);
          })
          .catch((error) => {
            console.warn('Could not sync routine progress to cloud.', error);
          });
      }
    },
    [activeChild, authStatus, household, householdStatus]
  );
  const dueRoutineByChild = Object.fromEntries(
    children.map((child) => [child.id, getDueRoutine(child, now)])
  ) as Record<string, RoutineType | null>;
  const globalTheme = children.some((child) => dueRoutineByChild[child.id] === 'morning')
    ? 'morning'
    : children.some((child) => dueRoutineByChild[child.id] === 'evening')
      ? 'evening'
      : 'free';

  if (!isReady) {
    return null;
  }

  if (view === 'account') {
    return <AccountEntryScreen onContinueLocalSetup={() => setView('setup')} />;
  }

  if (view === 'import') {
    return (
      <ImportFamilySetupScreen
        isImporting={isImporting}
        error={importError}
        onImport={() => {
          if (!household) return;

          setIsImporting(true);
          setImportError(null);

          void importLocalFamilyToCloud({
            household,
            children,
            homeScene,
          })
            .then(async () => {
              const cloudState = await loadCloudHouseholdState(household);
              setChildren(cloudState.children);
              setHomeScene(cloudState.homeScene);
              setSetupComplete(cloudState.children.length > 0);
              setPendingCloudProgressSync(false);
              setView(cloudState.children.length > 0 ? 'home' : 'setup');
              lastSyncedConfigRef.current = serializeHouseholdConfig({
                children: cloudState.children,
                homeScene: cloudState.homeScene,
                setupComplete: cloudState.children.length > 0,
              });
              shouldSyncFirstConfigRef.current = false;
            })
            .catch((error) => {
              setImportError(
                error instanceof Error ? error.message : 'Could not import this family setup right now.'
              );
            })
            .finally(() => {
              setIsImporting(false);
            });
        }}
        onStartFresh={() => {
          clearLocalAppState();
          setChildren(createSetupChildren());
          setSetupComplete(false);
          setHomeScene('bike');
          setPendingCloudProgressSync(false);
          setView('setup');
          setImportError(null);
          shouldSyncFirstConfigRef.current = true;
        }}
      />
    );
  }

  if (view === 'setup') {
    return (
      <InitialSetup
        children={children}
        onComplete={(configuredChildren) => {
          setChildren(configuredChildren);
          setSetupComplete(true);
          setView('home');
        }}
      />
    );
  }

  if (view === 'routine' && activeChild) {
    return (
      <RoutineView
        child={activeChild}
        routine={activeRoutine}
        onToggleTask={toggleTask}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'parent') {
    return (
      <ParentSettings
        children={children}
        homeScene={homeScene}
        onChange={setChildren}
        onHomeSceneChange={setHomeScene}
        onRestartSetup={restartSetup}
        onResetAppData={resetToFreshSetup}
        onBack={() => setView('home')}
      />
    );
  }

  return (
    <ChildSelector
      children={children}
      globalTheme={globalTheme}
      homeScene={homeScene}
      dueRoutineByChild={dueRoutineByChild}
      onSelectChild={(id) => {
        setNow(new Date());
        setActiveChildId(id);
        setView('routine');
      }}
      onOpenSettings={() => setView('parent')}
    />
  );
};

export default Index;
