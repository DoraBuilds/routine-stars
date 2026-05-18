import { lazy, Suspense, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChildSelector } from '@/components/ChildSelector';
import { AccountEntryScreen } from '@/components/AccountEntryScreen';
import { ExistingFamilyRecoveryScreen } from '@/components/ExistingFamilyRecoveryScreen';
import { HouseholdLoadErrorScreen } from '@/components/HouseholdLoadErrorScreen';
import { ImportFamilySetupScreen } from '@/components/ImportFamilySetupScreen';
import { useAuth } from '@/lib/auth/use-auth';
import { loadCloudHouseholdState } from '@/lib/data/cloud-household-state';
import { saveHouseholdConfigToCloud } from '@/lib/data/cloud-household-write';
import { deleteCloudHousehold } from '@/lib/data/delete-cloud-household';
import { importLocalFamilyToCloud } from '@/lib/data/local-to-cloud-import';
import { SupabaseProgressRepository } from '@/lib/data/supabase-progress-repository';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { AppView, Child, HomeScene, RoutineType } from '@/lib/types';
import {
  clearLocalAppState,
  loadLocalAppState,
  saveLocalAppState,
} from '@/lib/storage/local-app-state';

const InitialSetup = lazy(() => import('@/components/InitialSetup').then((module) => ({ default: module.InitialSetup })));
const RoutineView = lazy(() => import('@/components/RoutineView').then((module) => ({ default: module.RoutineView })));
const ParentSettings = lazy(() => import('@/components/ParentSettings').then((module) => ({ default: module.ParentSettings })));

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

const ViewLoadingFallback = ({ title = 'Loading next step' }: { title?: string }) => (
  <div className="flex min-h-svh items-center justify-center px-5 py-10">
    <div className="w-full max-w-lg rounded-[32px] border border-border bg-card p-8 text-center shadow-card">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">Routine Stars</p>
      <h1 className="mt-4 text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">This should only take a moment.</p>
    </div>
  </div>
);

const Index = () => {
  const { status: authStatus, householdStatus, household, signOut, user } = useAuth();
  const [view, setView] = useState<AppView>('setup');
  const [children, setChildren] = useState<Child[]>(createSetupChildren);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [cloudConfigSyncError, setCloudConfigSyncError] = useState<string | null>(null);
  const [cloudConfigSyncStatus, setCloudConfigSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [cloudConfigSyncRetryTick, setCloudConfigSyncRetryTick] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [homeScene, setHomeScene] = useState<HomeScene>('bike');
  const [bootstrapAttempt, setBootstrapAttempt] = useState(0);
  const lastSyncedConfigRef = useRef<string | null>(null);
  const configSyncInFlightRef = useRef<string | null>(null);
  const shouldSyncFirstConfigRef = useRef(false);
  const skipLocalPersistenceRef = useRef(false);
  const currentSessionSetupRef = useRef<{
    children: Child[];
    homeScene: HomeScene;
    setupComplete: boolean;
  }>({
    children: createSetupChildren(),
    homeScene: 'bike',
    setupComplete: false,
  });

  useEffect(() => {
    currentSessionSetupRef.current = {
      children,
      homeScene,
      setupComplete,
    };
  }, [children, homeScene, setupComplete]);

  const clearLocalAndState = useCallback((nextView: AppView) => {
    skipLocalPersistenceRef.current = true;
    clearLocalAppState();
    setChildren(createSetupChildren());
    setActiveChildId(null);
    setSetupComplete(false);
    setHomeScene('bike');
    setView(nextView);
    setNow(new Date());
  }, []);

  const resetToFreshSetup = useCallback(async () => {
    if (authStatus === 'signed_in' && householdStatus === 'ready' && household) {
      await deleteCloudHousehold(household);
      clearLocalAndState('account');
      await signOut();
      return;
    }

    clearLocalAndState('setup');
  }, [authStatus, clearLocalAndState, household, householdStatus, signOut]);

  const restartSetup = useCallback(() => {
    setActiveChildId(null);
    setSetupComplete(false);
    setView('setup');
    setNow(new Date());
  }, []);

  // Startup is auth-first: signed-out users always land on account entry.
  useEffect(() => {
    if (
      authStatus === 'loading' ||
      (authStatus === 'signed_in' && (householdStatus === 'idle' || householdStatus === 'loading'))
    ) {
      return;
    }

    let isMounted = true;

    const bootstrap = async () => {
      if (authStatus === 'signed_out' || authStatus === 'unavailable') {
        if (!isMounted) return;

        setBootstrapError(null);
        setCloudConfigSyncError(null);
        setCloudConfigSyncStatus('idle');
        setChildren(createSetupChildren());
        setActiveChildId(null);
        setSetupComplete(false);
        setHomeScene('bike');
        setView('account');
        lastSyncedConfigRef.current = null;
        shouldSyncFirstConfigRef.current = false;
        skipLocalPersistenceRef.current = false;
        setIsReady(true);
        return;
      }

      const storedState = loadLocalAppState();
      const currentSessionSetup = currentSessionSetupRef.current;
      const recoverableLocalState =
        storedState ??
        (currentSessionSetup.children.length > 0
          ? {
              version: 1,
              children: currentSessionSetup.children,
              homeScene: currentSessionSetup.homeScene,
              lastReset: new Date().toDateString(),
              setupComplete: currentSessionSetup.setupComplete,
            }
          : null);
      let cloudState: Awaited<ReturnType<typeof loadCloudHouseholdState>> | null = null;
      let cloudLoadError: string | null = null;

      if (authStatus === 'signed_in' && householdStatus === 'ready' && household) {
        try {
          cloudState = await loadCloudHouseholdState(household);
        } catch (error) {
          console.warn('Could not load cloud household state.', error);
          cloudLoadError =
            error instanceof Error ? error.message : 'Could not load this household from the cloud right now.';
        }
      }

      if (recoverableLocalState) {
        if (authStatus === 'signed_in' && householdStatus === 'ready' && household && cloudState?.children.length) {
          if (isMounted) {
            setChildren(cloudState.children);
            setHomeScene(cloudState.homeScene);
            setSetupComplete(cloudState.children.length > 0);
            setView(cloudState.children.length > 0 ? 'home' : 'setup');
            lastSyncedConfigRef.current = serializeHouseholdConfig({
              children: cloudState.children,
              homeScene: cloudState.homeScene,
              setupComplete: cloudState.children.length > 0,
            });
            configSyncInFlightRef.current = null;
            shouldSyncFirstConfigRef.current = false;
            setIsReady(true);
          }
          return;
        }

        if (
          !cloudLoadError &&
          authStatus === 'signed_in' &&
          householdStatus === 'ready' &&
          household &&
          recoverableLocalState.children.length > 0 &&
          (cloudState?.children.length ?? 0) === 0
        ) {
          if (isMounted) {
            setChildren(recoverableLocalState.children);
            setHomeScene(recoverableLocalState.homeScene);
            setSetupComplete(recoverableLocalState.setupComplete);
            setCloudConfigSyncError(null);
            setCloudConfigSyncStatus('idle');
            setView('import');
            setIsReady(true);
          }
          return;
        }

        if (
          !cloudLoadError &&
          authStatus === 'signed_in' &&
          householdStatus === 'ready' &&
          household &&
          recoverableLocalState.children.length === 0 &&
          (cloudState?.children.length ?? 0) === 0
        ) {
          if (isMounted) {
            setBootstrapError(null);
            setChildren(createSetupChildren());
            setActiveChildId(null);
            setSetupComplete(false);
            setHomeScene(recoverableLocalState.homeScene);
            setCloudConfigSyncError(null);
            setCloudConfigSyncStatus('idle');
            setView('recovery');
            setIsReady(true);
          }
          return;
        }

        const today = new Date().toDateString();
        if (recoverableLocalState.lastReset !== today) {
          const reset = recoverableLocalState.children.map((c: Child) => ({
            ...c,
            morning: c.morning.map((t: Child['morning'][0]) => ({ ...t, completed: false })),
            evening: c.evening.map((t: Child['evening'][0]) => ({ ...t, completed: false })),
          }));
          if (isMounted) {
            setChildren(reset);
          }
        } else if (isMounted) {
          setChildren(recoverableLocalState.children);
        }

        if (isMounted) {
          setBootstrapError(null);
          setCloudConfigSyncError(null);
          setCloudConfigSyncStatus('idle');
          setSetupComplete(recoverableLocalState.setupComplete);
          setHomeScene(recoverableLocalState.homeScene);
          setView(recoverableLocalState.setupComplete ? 'home' : 'setup');
          setIsReady(true);
        }
        return;
      }

      if (cloudState) {
        if (!isMounted) return;

        setBootstrapError(null);
        setCloudConfigSyncError(null);
        setCloudConfigSyncStatus(cloudState.children.length > 0 ? 'saved' : 'idle');
        setChildren(cloudState.children);
        setHomeScene(cloudState.homeScene);
        setSetupComplete(cloudState.children.length > 0);
        setView(cloudState.children.length > 0 ? 'home' : 'recovery');
        if (cloudState.children.length > 0) {
          lastSyncedConfigRef.current = serializeHouseholdConfig({
            children: cloudState.children,
            homeScene: cloudState.homeScene,
            setupComplete: true,
          });
          configSyncInFlightRef.current = null;
          shouldSyncFirstConfigRef.current = false;
        } else if (authStatus === 'signed_in') {
          shouldSyncFirstConfigRef.current = true;
        }
        setIsReady(true);
        return;
      }

      if (cloudLoadError && authStatus === 'signed_in' && householdStatus === 'ready' && household) {
        if (!isMounted) return;

        setActiveChildId(null);
        setChildren(createSetupChildren());
        setSetupComplete(false);
        setHomeScene('bike');
        setBootstrapError(cloudLoadError);
        setCloudConfigSyncError(null);
        setCloudConfigSyncStatus('error');
        setView('bootstrap-error');
        setIsReady(true);
        return;
      }

      if (isMounted) {
        setBootstrapError(null);
        setCloudConfigSyncError(null);
        setCloudConfigSyncStatus('idle');
        setChildren(createSetupChildren());
        setActiveChildId(null);
        setSetupComplete(false);
        setHomeScene('bike');
        const nextView: AppView =
          authStatus === 'signed_in' && householdStatus === 'ready'
            ? 'recovery'
            : authStatus === 'signed_in' && householdStatus !== 'error'
              ? 'setup'
              : 'account';
        setView(nextView);
        shouldSyncFirstConfigRef.current = authStatus === 'signed_in' && householdStatus !== 'error';
        setIsReady(true);
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [authStatus, bootstrapAttempt, household, householdStatus]);

  const householdConfigSignature = useMemo(
    () => serializeHouseholdConfig({ children, homeScene, setupComplete }),
    [children, homeScene, setupComplete]
  );

  const attemptCloudConfigSync = useCallback(
    async (
      nextState: {
        children: Child[];
        homeScene: HomeScene;
        setupComplete: boolean;
      },
      options?: { force?: boolean }
    ) => {
      if (!isReady || authStatus !== 'signed_in' || householdStatus !== 'ready' || !household) {
        return false;
      }

      const nextSignature = serializeHouseholdConfig(nextState);
      if (!options?.force && lastSyncedConfigRef.current === nextSignature) {
        setCloudConfigSyncStatus('saved');
        setCloudConfigSyncError(null);
        return true;
      }

      if (configSyncInFlightRef.current === nextSignature) {
        setCloudConfigSyncStatus('saving');
        return true;
      }

      shouldSyncFirstConfigRef.current = false;
      configSyncInFlightRef.current = nextSignature;
      setCloudConfigSyncStatus('saving');
      setCloudConfigSyncError(null);

      try {
        await saveHouseholdConfigToCloud({
          household,
          children: nextState.children,
          homeScene: nextState.homeScene,
          removeMissingChildren: true,
        });

        const verifiedCloudState = await loadCloudHouseholdState(household);
        const expectedChildIds = [...nextState.children.map((child) => child.id)].sort();
        const actualChildIds = [...verifiedCloudState.children.map((child) => child.id)].sort();
        const childrenVerified =
          expectedChildIds.length === actualChildIds.length &&
          expectedChildIds.every((childId, index) => childId === actualChildIds[index]);
        const homeSceneVerified = verifiedCloudState.homeScene === nextState.homeScene;

        if (!childrenVerified || !homeSceneVerified) {
          throw new Error(
            'We could not verify that this family setup reached the cloud yet. Please retry cloud save.'
          );
        }

        lastSyncedConfigRef.current = nextSignature;
        setCloudConfigSyncStatus('saved');
        setCloudConfigSyncError(null);
        return true;
      } catch (error) {
        setCloudConfigSyncStatus('error');
        setCloudConfigSyncError(
          error instanceof Error ? error.message : 'Could not save this family setup to the cloud yet.'
        );
        console.warn('Could not sync household configuration to cloud.', error);
        return false;
      } finally {
        if (configSyncInFlightRef.current === nextSignature) {
          configSyncInFlightRef.current = null;
        }
      }
    },
    [authStatus, household, householdStatus, isReady]
  );

  useEffect(() => {
    if (!isReady || authStatus !== 'signed_in' || householdStatus !== 'ready' || !household) {
      lastSyncedConfigRef.current = null;
      setCloudConfigSyncStatus('idle');
      return;
    }

    if (lastSyncedConfigRef.current === null) {
      if (!shouldSyncFirstConfigRef.current) {
        lastSyncedConfigRef.current = householdConfigSignature;
        setCloudConfigSyncStatus('saved');
        return;
      }
    }

    if (lastSyncedConfigRef.current === householdConfigSignature) {
      return;
    }

    if (configSyncInFlightRef.current === householdConfigSignature) {
      return;
    }

    void attemptCloudConfigSync({ children, homeScene, setupComplete });
  }, [
    attemptCloudConfigSync,
    authStatus,
    children,
    cloudConfigSyncRetryTick,
    homeScene,
    household,
    householdConfigSignature,
    householdStatus,
    isReady,
    setupComplete,
    view,
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const refreshFromCloudIfSafe = async (options?: { reason?: string }) => {
      // Always keep time-based UI fresh.
      setNow(new Date());

      // Pull remote updates when:
      // - signed in with a ready household
      // - we're not currently editing setup/import flows
      // - local state has no unsynced changes (so we won't clobber local edits)
      if (
        !isReady ||
        authStatus !== 'signed_in' ||
        householdStatus !== 'ready' ||
        !household ||
        view !== 'home'
      ) {
        return;
      }

      if (cloudConfigSyncStatus === 'saving' || configSyncInFlightRef.current) {
        return;
      }

      // If local diverged from last known synced signature, do not overwrite it.
      if (lastSyncedConfigRef.current && lastSyncedConfigRef.current !== householdConfigSignature) {
        return;
      }

      try {
        const cloudState = await loadCloudHouseholdState(household);
        const nextSetupComplete = cloudState.children.length > 0;
        const nextSignature = serializeHouseholdConfig({
          children: cloudState.children,
          homeScene: cloudState.homeScene,
          setupComplete: nextSetupComplete,
        });

        // No change, nothing to do.
        if (lastSyncedConfigRef.current === nextSignature) {
          return;
        }

        setChildren(cloudState.children);
        setHomeScene(cloudState.homeScene);
        setSetupComplete(nextSetupComplete);
        setView(nextSetupComplete ? 'home' : 'setup');
        setCloudConfigSyncStatus(nextSetupComplete ? 'saved' : 'idle');
        setCloudConfigSyncError(null);
        lastSyncedConfigRef.current = nextSignature;
      } catch (error) {
        // Keep running with existing local state; cloud refresh can fail temporarily.
        console.warn('Could not refresh cloud household state.', options?.reason ?? 'unknown', error);
      }
    };

    const onFocus = () => {
      // iOS Safari is inconsistent about focus events; we listen to multiple signals.
      if (document.visibilityState && document.visibilityState !== 'visible') {
        return;
      }
      void refreshFromCloudIfSafe({ reason: 'focus' });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState && document.visibilityState !== 'visible') {
        return;
      }
      void refreshFromCloudIfSafe({ reason: 'visibilitychange' });
    };

    const onPageShow = () => {
      void refreshFromCloudIfSafe({ reason: 'pageshow' });
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pageshow', onPageShow);

    // Background polling + realtime subscriptions are valuable in production, but they
    // create long-lived timers/sockets that make unit tests flaky unless every test
    // unmounts. We disable them under Vitest and rely on focus/pageshow refresh tests instead.
    const enableBackgroundSync = !import.meta.env.VITEST;

    const pollId = enableBackgroundSync
      ? window.setInterval(() => {
          void refreshFromCloudIfSafe({ reason: 'poll' });
        }, 15_000)
      : null;

    const supabase = enableBackgroundSync ? getSupabaseClient() : null;
    const canUseRealtime = Boolean(supabase && typeof (supabase as any).channel === 'function');
    const channel =
      canUseRealtime && authStatus === 'signed_in' && householdStatus === 'ready' && household
        ? supabase
            .channel(`household:${household.id}`)
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'households', filter: `id=eq.${household.id}` },
              () => void refreshFromCloudIfSafe({ reason: 'realtime:households' })
            )
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'child_profiles', filter: `household_id=eq.${household.id}` },
              () => void refreshFromCloudIfSafe({ reason: 'realtime:child_profiles' })
            )
            // Routines and tasks don't include household_id, so we can't filter cheaply.
            // MVP approach: listen and refresh on any routine/task change; scoped channels keep this manageable.
            .on('postgres_changes', { event: '*', schema: 'public', table: 'routines' }, () =>
              void refreshFromCloudIfSafe({ reason: 'realtime:routines' })
            )
            .on('postgres_changes', { event: '*', schema: 'public', table: 'routine_tasks' }, () =>
              void refreshFromCloudIfSafe({ reason: 'realtime:routine_tasks' })
            )
            .subscribe()
        : null;

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pageshow', onPageShow);
      if (pollId) {
        window.clearInterval(pollId);
      }
      if (channel && supabase && typeof (supabase as any).removeChannel === 'function') {
        supabase.removeChannel(channel);
      }
    };
  }, [
    authStatus,
    cloudConfigSyncStatus,
    household,
    householdConfigSignature,
    householdStatus,
    isReady,
    view,
  ]);

  // Persist
  useEffect(() => {
    if (!isReady || authStatus !== 'signed_in') return;

    if (skipLocalPersistenceRef.current) {
      return;
    }

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
  }, [authStatus, children, homeScene, isReady, setupComplete]);

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
    return <AccountEntryScreen />;
  }

  if (view === 'bootstrap-error') {
    return (
      <HouseholdLoadErrorScreen
        error={bootstrapError ?? 'Could not load this household right now.'}
        onRetry={() => {
          setBootstrapError(null);
          setIsReady(false);
          setBootstrapAttempt((count) => count + 1);
        }}
      />
    );
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
              setCloudConfigSyncError(null);
              setCloudConfigSyncStatus(cloudState.children.length > 0 ? 'saved' : 'idle');
              lastSyncedConfigRef.current = serializeHouseholdConfig({
                children: cloudState.children,
                homeScene: cloudState.homeScene,
                setupComplete: cloudState.children.length > 0,
              });
              configSyncInFlightRef.current = null;
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
          setActiveChildId(null);
          setChildren(createSetupChildren());
          setSetupComplete(false);
          setHomeScene('bike');
          setCloudConfigSyncError(null);
          setCloudConfigSyncStatus('idle');
          setView('setup');
          setImportError(null);
          shouldSyncFirstConfigRef.current = true;
        }}
      />
    );
  }

  if (view === 'recovery') {
    return (
      <ExistingFamilyRecoveryScreen
        onStartFresh={() => {
          setChildren(createSetupChildren());
          setSetupComplete(false);
          setHomeScene('bike');
          setCloudConfigSyncStatus('idle');
          setView('setup');
          shouldSyncFirstConfigRef.current = true;
        }}
        onSignOut={() => {
          void signOut();
        }}
      />
    );
  }

  if (view === 'setup') {
    return (
      <Suspense fallback={<ViewLoadingFallback title="Opening setup" />}>
        <InitialSetup
          children={children}
          signedInEmail={authStatus === 'signed_in' ? user?.email ?? null : null}
          onSignOut={authStatus === 'signed_in' ? () => void signOut() : undefined}
          cloudSyncStatus={cloudConfigSyncStatus}
          cloudSyncError={cloudConfigSyncError}
          onRetryCloudSync={
            authStatus === 'signed_in'
              ? () => {
                  void attemptCloudConfigSync({ children, homeScene, setupComplete }, { force: true }).then(
                    (didSync) => {
                      if (!didSync) {
                        setCloudConfigSyncRetryTick((count) => count + 1);
                      }
                    }
                  );
                }
              : undefined
          }
          onChange={(nextChildren) => {
            setChildren(nextChildren);
            if (authStatus === 'signed_in') {
              void attemptCloudConfigSync({
                children: nextChildren,
                homeScene,
                setupComplete: false,
              });
            }
          }}
          onComplete={(configuredChildren) => {
            setChildren(configuredChildren);
            setCloudConfigSyncError(null);
            setCloudConfigSyncStatus(authStatus === 'signed_in' ? 'saving' : 'idle');
            setSetupComplete(true);
            setView('home');
            if (authStatus === 'signed_in') {
              void attemptCloudConfigSync(
                {
                  children: configuredChildren,
                  homeScene,
                  setupComplete: true,
                },
                { force: true }
              );
            }
          }}
        />
      </Suspense>
    );
  }

  if (view === 'routine' && activeChild) {
    return (
      <Suspense fallback={<ViewLoadingFallback title="Opening routine" />}>
        <RoutineView
          child={activeChild}
          routine={activeRoutine}
          onToggleTask={toggleTask}
          onBack={() => setView('home')}
        />
      </Suspense>
    );
  }

  if (view === 'parent') {
    return (
      <Suspense fallback={<ViewLoadingFallback title="Opening parent settings" />}>
        <ParentSettings
          children={children}
          homeScene={homeScene}
          cloudConfigSyncError={cloudConfigSyncError}
          onRetryCloudConfigSync={() => {
            setCloudConfigSyncError(null);
            setCloudConfigSyncRetryTick((count) => count + 1);
          }}
          onChange={setChildren}
          onHomeSceneChange={setHomeScene}
          onRestartSetup={restartSetup}
          onResetAppData={resetToFreshSetup}
          onBack={() => setView('home')}
        />
      </Suspense>
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
