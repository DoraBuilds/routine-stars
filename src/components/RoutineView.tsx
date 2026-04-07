import { useEffect, useState } from 'react';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { CompletionCelebration } from './CompletionCelebration';
import type { Child, RoutineType } from '@/lib/types';

interface RoutineViewProps {
  child: Child;
  routine: RoutineType;
  onSetRoutine: (r: RoutineType) => void;
  onToggleTask: (taskId: string) => void;
  onBack: () => void;
}

const celebratedRoutineKeys = new Set<string>();

export const RoutineView = ({ child, routine, onSetRoutine, onToggleTask, onBack }: RoutineViewProps) => {
  const [celebration, setCelebration] = useState<
    | { variant: 'task'; taskId: string; childName: string }
    | { variant: 'routine'; childName: string }
    | null
  >(null);
  const tasks = child[routine];
  const isComplete = tasks.length > 0 && tasks.every((t) => t.completed);
  const routineTaskKey = `${child.id}:${routine}:${
    tasks
      .map((task) => task.id)
      .sort()
      .join('|')
  }`;
  const currentRoutineSignature = isComplete
    ? tasks
        .map((task) => task.id)
        .sort()
        .join('|')
    : null;
  const routineCelebrationKey = currentRoutineSignature
    ? `${child.id}:${routine}:${currentRoutineSignature}`
    : null;

  useEffect(() => {
    setCelebration(null);
  }, [child.id, routine]);

  useEffect(() => {
    if (!routineCelebrationKey) {
      celebratedRoutineKeys.delete(routineTaskKey);
      return;
    }

    if (celebratedRoutineKeys.has(routineCelebrationKey)) {
      return;
    }

    celebratedRoutineKeys.add(routineCelebrationKey);
    setCelebration({ variant: 'routine', childName: child.name });
  }, [child.name, routineCelebrationKey, routineTaskKey]);

  return (
    <div className="relative max-w-3xl mx-auto px-5 md:px-6 pt-8 md:pt-12 pb-24 min-h-svh overflow-hidden">
      {routine === 'morning' ? (
        <>
          <div className="absolute right-8 top-8 -z-10 h-24 w-24 rounded-full bg-yellow-300/80 shadow-[0_0_80px_rgba(253,224,71,0.65)]" />
          <div className="absolute left-2 top-20 -z-10 text-3xl opacity-70" aria-hidden="true">🐦</div>
          <div className="absolute right-2 bottom-10 -z-10 text-7xl opacity-20" aria-hidden="true">🌳</div>
        </>
      ) : (
        <>
          <div className="absolute right-6 top-6 -z-10 text-7xl opacity-75" aria-hidden="true">🌙</div>
          <div className="absolute left-6 top-20 -z-10 text-3xl opacity-65" aria-hidden="true">⭐</div>
          <div className="absolute right-16 top-28 -z-10 text-2xl opacity-60" aria-hidden="true">💤</div>
        </>
      )}

      {/* Nav */}
      <nav className="flex items-center justify-between mb-8 md:mb-10">
        <button
          onClick={onBack}
          className="p-3 md:p-4 rounded-2xl bg-card shadow-sm text-muted-foreground active:scale-95 transition-transform"
        >
          <ArrowLeft size={26} />
        </button>
        <div className="flex bg-muted p-1.5 rounded-2xl">
          <button
            onClick={() => onSetRoutine('morning')}
            className={`flex items-center px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-bold transition-all gap-2 text-base md:text-lg ${
              routine === 'morning'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Sun size={20} /> Morning
          </button>
          <button
            onClick={() => onSetRoutine('evening')}
            className={`flex items-center px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-bold transition-all gap-2 text-base md:text-lg ${
              routine === 'evening'
                ? 'bg-card text-indigo-500 shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Moon size={20} /> Evening
          </button>
        </div>
        <div className="w-12 md:w-14" />
      </nav>

      {/* Header */}
      <motion.header
        key={`${child.id}-${routine}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Good {routine === 'morning' ? 'Morning' : 'Evening'}, {child.name}!
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mt-2">
          {isComplete
            ? 'You finished everything! Great job! 🎉'
            : "Let's see what's next on your list."}
        </p>
      </motion.header>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TaskCard
              task={task}
              onToggle={(currentTask) => {
                onToggleTask(currentTask.id);
                if (!currentTask.completed) {
                  setCelebration({ variant: 'task', taskId: currentTask.id, childName: child.name });
                }
              }}
            />
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <div className="py-20 text-center border-4 border-dashed border-border rounded-[32px]">
            <p className="text-muted-foreground text-xl">No tasks set up yet!</p>
            <p className="text-muted-foreground mt-1">Ask a parent to add some.</p>
          </div>
        )}
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {celebration?.variant === 'task' && (
          <CompletionCelebration
            key={`task-${celebration.taskId}`}
            variant="task"
            childName={celebration.childName}
            onFinish={() => setCelebration(null)}
          />
        )}
        {celebration?.variant === 'routine' && isComplete && (
          <CompletionCelebration
            key={`routine-${currentRoutineSignature}`}
            variant="routine"
            childName={celebration.childName}
            onFinish={() => {
              setCelebration(null);
              onBack();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
