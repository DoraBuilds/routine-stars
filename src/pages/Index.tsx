import { useState, useEffect, useCallback } from 'react';
import { ChildSelector } from '@/components/ChildSelector';
import { RoutineView } from '@/components/RoutineView';
import { ParentSettings } from '@/components/ParentSettings';
import type { AppView, Child, RoutineType } from '@/lib/types';
import { DEFAULT_CHILDREN } from '@/lib/types';

const STORAGE_KEY = 'routine_stars_data';

const Index = () => {
  const [view, setView] = useState<AppView>('home');
  const [children, setChildren] = useState<Child[]>(DEFAULT_CHILDREN);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');

  // Load from localStorage with daily reset
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
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
      } catch {
        // corrupt data, use defaults
      }
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ children, lastReset: new Date().toDateString() })
    );
  }, [children]);

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
        onChange={setChildren}
        onBack={() => setView('home')}
      />
    );
  }

  return (
    <ChildSelector
      children={children}
      onSelectChild={(id) => {
        setActiveChildId(id);
        setActiveRoutine('morning');
        setView('routine');
      }}
      onOpenSettings={() => setView('parent')}
    />
  );
};

export default Index;
