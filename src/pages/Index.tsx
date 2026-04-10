import { useState, useEffect, useCallback } from 'react';
import { ChildSelector } from '@/components/ChildSelector';
import { InitialSetup } from '@/components/InitialSetup';
import { RoutineView } from '@/components/RoutineView';
import { ParentSettings } from '@/components/ParentSettings';
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

const Index = () => {
  const [view, setView] = useState<AppView>('setup');
  const [children, setChildren] = useState<Child[]>(createSetupChildren);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [homeScene, setHomeScene] = useState<HomeScene>('bike');

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

  // Load from localStorage with daily reset
  useEffect(() => {
    const storedState = loadLocalAppState();
    if (storedState) {
      const today = new Date().toDateString();
      if (storedState.lastReset !== today) {
        const reset = storedState.children.map((c: Child) => ({
          ...c,
          morning: c.morning.map((t: Child['morning'][0]) => ({ ...t, completed: false })),
          evening: c.evening.map((t: Child['evening'][0]) => ({ ...t, completed: false })),
        }));
        setChildren(reset);
      } else {
        setChildren(storedState.children);
      }
      setSetupComplete(storedState.setupComplete);
      setHomeScene(storedState.homeScene);
      setView(storedState.setupComplete ? 'home' : 'setup');
    } else {
      setChildren(createSetupChildren());
      setSetupComplete(false);
      setHomeScene('bike');
      setView('setup');
    }

    setIsReady(true);
  }, []);

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
      setChildren((prev) =>
        prev.map((c) => {
          if (c.id !== activeChildId) return c;
          const resolvedRoutine = getDisplayRoutine(c, new Date());
          return {
            ...c,
            [resolvedRoutine]: c[resolvedRoutine].map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          };
        })
      );
    },
    [activeChildId]
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
