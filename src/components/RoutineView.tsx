import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
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

export const RoutineView = ({ child, routine, onSetRoutine, onToggleTask, onBack }: RoutineViewProps) => {
  const tasks = child[routine];
  const isComplete = tasks.length > 0 && tasks.every((t) => t.completed);

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 pt-8 md:pt-12 pb-24 min-h-svh">
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
            <TaskCard task={task} onToggle={() => onToggleTask(task.id)} />
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
      {isComplete && (
        <CompletionCelebration childName={child.name} onFinish={onBack} />
      )}
    </div>
  );
};
