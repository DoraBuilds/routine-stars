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
  const lastSyncedConfigRef = useRef<string | null>(null);
  const shouldSyncFirstConfigRef = useRef(false);

  const resetToFreshSetup = useCallback(() => {
    clearLocalAppState();
    setChildren(createSetupChildren());
    setActiveChildId(null);
    setSetupComplete(false);
    setHomeScene('bike');
    setView('setup');
    setNow(new Date());
  }, []);

  const restartSetup = useCallback(() => {
    setActiveChildId(null);
    setSetupComplete(false);
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
      });
    } catch (error) {
      console.warn('Could not save app state to local storage.', error);
    }
  }, [children, homeScene, isReady, setupComplete]);

  const toggleTask = useCallback(
    (taskId: string) => {
      let nextProgressWrite:
        | {
            childId: string;
            routineType: RoutineType;
            taskId: string;
            completed: boolean;
            completedAt: string | null;
          }
        | null = null;

      setChildren((prev) =>
        prev.map((c) => {
          if (c.id !== activeChildId) return c;
          const resolvedRoutine = getDisplayRoutine(c, new Date());
          const nextRoutine = c[resolvedRoutine].map((t) => {
            if (t.id !== taskId) return t;

            const completed = !t.completed;
            nextProgressWrite = {
              childId: c.id,
              routineType: resolvedRoutine,
              taskId,
              completed,
              completedAt: completed ? new Date().toISOString() : null,
            };

            return { ...t, completed };
          });

          return {
            ...c,
            [resolvedRoutine]: nextRoutine,
          };
        })
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

        void progressRepository
          .upsertRoutineProgress({
            childProfileId: nextProgressWrite.childId,
            routineType: nextProgressWrite.routineType,
            progressDate,
            completedAt: null,
          })
          .then((dailyRoutineProgress) =>
            progressRepository.setTaskCompletion({
              dailyRoutineProgressId: dailyRoutineProgress.id,
              routineTaskId: nextProgressWrite.taskId,
              completed: nextProgressWrite.completed,
              completedAt: nextProgressWrite.completedAt,
            })
          )
          .catch((error) => {
            console.warn('Could not sync routine progress to cloud.', error);
          });
      }
    },
    [activeChildId, authStatus, household, householdStatus]
  );

  const activeChild = children.find((c) => c.id === activeChildId);
  const activeRoutine = activeChild ? getDisplayRoutine(activeChild, now) : 'morning';
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
