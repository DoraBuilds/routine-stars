import { useState, useEffect, useCallback } from 'react';
import { ChildSelector } from '@/components/ChildSelector';
import { InitialSetup } from '@/components/InitialSetup';
import { RoutineView } from '@/components/RoutineView';
import { ParentSettings } from '@/components/ParentSettings';
import type { AppView, Child, HomeScene, RoutineType } from '@/lib/types';
import { DEFAULT_CHILDREN } from '@/lib/types';

const STORAGE_KEY = 'routine_stars_data';

const parseTime = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const getDueRoutine = (child: Child, now: Date): RoutineType | null => {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const morning = child.schedule?.morning;
  const evening = child.schedule?.evening;

  if (morning && minutes >= parseTime(morning.start) && minutes <= parseTime(morning.end)) {
    return 'morning';
  }

  if (evening && minutes >= parseTime(evening.start) && minutes <= parseTime(evening.end)) {
    return 'evening';
  }

  return null;
};

const createSetupChildren = (): Child[] =>
  DEFAULT_CHILDREN.map((child) => ({
    id: child.id,
    name: child.name,
    age: child.age,
    ageBucket: child.ageBucket,
    avatarSeed: child.avatarSeed,
    avatarAnimal: child.avatarAnimal,
    schedule: child.schedule,
    morning: [],
    evening: [],
  }));

const Index = () => {
  const [view, setView] = useState<AppView>('setup');
  const [children, setChildren] = useState<Child[]>(createSetupChildren);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');
  const [setupComplete, setSetupComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [homeScene, setHomeScene] = useState<HomeScene>('bike');

  // Load from localStorage with daily reset
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        const resolvedSetupComplete = parsed.setupComplete ?? true;
        if (parsed.lastReset !== today) {
          const reset = parsed.children.map((c: Child) => ({
            ...c,
            morning: c.morning.map((t: Child['morning'][0]) => ({ ...t, completed: false })),
            evening: c.evening.map((t: Child['evening'][0]) => ({ ...t, completed: false })),
          }));
          setChildren(reset);
        } else {
          setChildren(parsed.children);
        }
        setSetupComplete(resolvedSetupComplete);
        setHomeScene(parsed.homeScene ?? 'bike');
        setView(resolvedSetupComplete ? 'home' : 'setup');
      } catch {
        setChildren(createSetupChildren());
        setSetupComplete(false);
        setHomeScene('bike');
        setView('setup');
      }
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

  // Persist
  useEffect(() => {
    if (!isReady) return;

    const payload = { children, homeScene, lastReset: new Date().toDateString(), setupComplete };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Could not save app state to local storage.', error);
    }
  }, [children, homeScene, isReady, setupComplete]);

  const toggleTask = useCallback(
    (taskId: string) => {
      setChildren((prev) =>
        prev.map((c) => {
          if (c.id !== activeChildId) return c;
          return {
            ...c,
            [activeRoutine]: c[activeRoutine].map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          };
        })
      );
    },
    [activeChildId, activeRoutine]
  );

  const activeChild = children.find((c) => c.id === activeChildId);
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
        onSetRoutine={setActiveRoutine}
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
        setActiveChildId(id);
        setActiveRoutine(dueRoutineByChild[id] ?? 'morning');
        setView('routine');
      }}
      onOpenSettings={() => setView('parent')}
    />
  );
};

export default Index;
