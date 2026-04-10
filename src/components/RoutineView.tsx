import { useEffect, useState } from 'react';
import { ArrowLeft, Bird, MoonStar, Sparkles, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { CompletionCelebration } from './CompletionCelebration';
import type { Child, RoutineType } from '@/lib/types';

interface RoutineViewProps {
  child: Child;
  routine: RoutineType;
  onToggleTask: (taskId: string) => void;
  onBack: () => void;
}

const celebratedRoutineKeys = new Set<string>();

const MorningBackdrop = () => (
  <>
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffdf0_0%,#fef3c7_18%,#e0f2fe_56%,#f0fdf4_100%)]" />
    <div className="absolute right-4 top-6 h-20 w-20 rounded-full bg-yellow-300 shadow-[0_0_80px_rgba(253,224,71,0.8)] sm:right-8 sm:top-8 sm:h-28 sm:w-28 sm:shadow-[0_0_110px_rgba(253,224,71,0.85)]" />
    <div className="absolute left-0 right-0 top-24 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.48),transparent_62%)]" />
    <div className="absolute left-4 top-16 opacity-65 sm:left-8 sm:top-20 sm:opacity-75" aria-hidden="true">
      <Bird size={22} className="sm:h-[30px] sm:w-[30px]" />
    </div>
    <div className="absolute left-20 top-24 opacity-60 sm:left-28 sm:top-28 sm:opacity-70" aria-hidden="true">
      <Bird size={18} className="sm:h-6 sm:w-6" />
    </div>
    <div className="absolute right-20 top-24 opacity-55 sm:right-28 sm:top-32 sm:opacity-60" aria-hidden="true">
      <Bird size={16} className="sm:h-5 sm:w-5" />
    </div>
    <div className="absolute right-20 top-10 text-xl opacity-60 sm:right-28 sm:top-5 sm:text-2xl" aria-hidden="true">☁️</div>
    <div className="absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(74,222,128,0.35),transparent)]" />
    <div className="absolute bottom-4 left-2 text-[5rem] opacity-20 sm:bottom-6 sm:left-4 sm:text-[8rem] sm:opacity-25" aria-hidden="true">🌳</div>
    <div className="absolute bottom-6 right-0 text-[5.5rem] opacity-15 sm:bottom-8 sm:text-[9rem] sm:opacity-20" aria-hidden="true">🌳</div>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:3.2rem_3.2rem] opacity-30" />
  </>
);

const EveningBackdrop = () => (
  <>
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#0f172a_0%,#172554_28%,#1e3a8a_55%,#312e81_100%)]" />
    <div className="absolute right-4 top-6 drop-shadow-[0_0_20px_rgba(253,230,138,0.45)] sm:right-12 sm:top-10 sm:drop-shadow-[0_0_24px_rgba(253,230,138,0.55)]">
      <MoonStar size={58} className="text-amber-200 sm:h-[82px] sm:w-[82px]" />
      <div className="absolute left-1/2 top-1 -translate-x-1/2 rotate-[-10deg] rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-black tracking-[0.2em] text-slate-600 shadow-sm sm:top-2 sm:px-3 sm:py-1 sm:text-[11px]">
        zZz
      </div>
    </div>
    <div className="absolute left-6 top-12 text-2xl text-yellow-200/90 sm:left-10 sm:top-16 sm:text-3xl" aria-hidden="true">✦</div>
    <div className="absolute left-24 top-20 text-2xl text-yellow-200/80 sm:left-32 sm:top-28 sm:text-3xl" aria-hidden="true">✧</div>
    <div className="absolute right-20 top-20 text-xl text-yellow-200/85 sm:right-36 sm:top-28 sm:text-2xl" aria-hidden="true">✦</div>
    <div className="absolute right-8 top-28 text-3xl text-yellow-100/80 sm:right-20 sm:top-40 sm:text-4xl" aria-hidden="true">⋆</div>
    <div className="absolute bottom-0 left-0 text-[6.5rem] opacity-25 sm:left-2 sm:text-[11rem] sm:opacity-35" aria-hidden="true">🌳</div>
    <div className="absolute bottom-20 left-16 text-3xl opacity-75 sm:left-24 sm:bottom-28 sm:text-4xl sm:opacity-85" aria-hidden="true">🦉</div>
    <div className="absolute bottom-20 left-24 text-xl text-slate-200/80 sm:left-32 sm:bottom-24 sm:text-2xl" aria-hidden="true">💤</div>
    <div className="absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(15,23,42,0.62),transparent)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:3.2rem_3.2rem] opacity-20" />
  </>
);

export const RoutineView = ({ child, routine, onToggleTask, onBack }: RoutineViewProps) => {
  const [celebration, setCelebration] = useState<
    | { variant: 'task'; taskId: string; childName: string }
    | { variant: 'routine'; childName: string }
    | null
  >(null);

  const tasks = child[routine];
  const isComplete = tasks.length > 0 && tasks.every((t) => t.completed);
  const completedCount = tasks.filter((task) => task.completed).length;
  const routineTaskKey = `${child.id}:${routine}:${tasks.map((task) => task.id).sort().join('|')}`;
  const currentRoutineSignature = isComplete ? tasks.map((task) => task.id).sort().join('|') : null;
  const routineCelebrationKey = currentRoutineSignature ? `${child.id}:${routine}:${currentRoutineSignature}` : null;

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
    <div className="relative isolate min-h-svh overflow-hidden">
      {routine === 'morning' ? <MorningBackdrop /> : <EveningBackdrop />}

      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-5 md:px-6 md:pt-12">
        <nav className="mb-8 flex items-center justify-start md:mb-10">
          <button
            onClick={onBack}
            className={`rounded-2xl p-3 shadow-sm transition-transform active:scale-95 md:p-4 ${
              routine === 'morning' ? 'bg-white/90 text-muted-foreground' : 'bg-slate-900/65 text-slate-100'
            }`}
          >
            <ArrowLeft size={26} />
          </button>
        </nav>

        <motion.header
          key={`${child.id}-${routine}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.24em] ${
                routine === 'morning'
                  ? 'bg-white/85 text-primary'
                  : 'bg-slate-950/45 text-yellow-100'
              }`}
            >
              {routine === 'morning' ? <Sparkles size={16} /> : <MoonStar size={16} />}
              {routine === 'morning' ? 'Morning routine' : 'Evening routine'}
            </span>
            {tasks.length > 0 && (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.24em] ${
                  routine === 'morning'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-white/10 text-yellow-100'
                }`}
              >
                <Star size={16} />
                {completedCount}/{tasks.length}
              </span>
            )}
          </div>
          <h2
            className={`text-2xl font-bold sm:text-3xl md:text-4xl ${
              routine === 'morning' ? 'text-foreground' : 'text-white'
            }`}
          >
            Good {routine === 'morning' ? 'Morning' : 'Evening'}, {child.name}!
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {tasks.map((task) => (
              <span
                key={`progress-${task.id}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  task.completed
                    ? 'border-success bg-success text-success-foreground'
                    : routine === 'morning'
                      ? 'border-primary/25 bg-white/75 text-primary'
                      : 'border-white/20 bg-white/10 text-yellow-100'
                }`}
                aria-label={task.completed ? 'Task finished' : 'Task to do'}
              >
                {task.completed ? <Star size={18} fill="currentColor" /> : <span className="text-xs font-black">{tasks.indexOf(task) + 1}</span>}
              </span>
            ))}
          </div>
          <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
            routine === 'morning' ? 'bg-white/80 text-slate-700' : 'bg-slate-950/45 text-slate-100'
          }`}>
            <Sparkles size={16} />
            {isComplete ? 'All done!' : 'Tap the cards'}
          </div>
        </motion.header>

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
            <div className="rounded-[32px] border-4 border-dashed border-white/35 bg-white/35 py-20 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-primary">
                <Sparkles size={28} />
              </div>
              <p className="mt-4 text-xl font-bold text-muted-foreground">No cards yet</p>
            </div>
          )}
        </div>
      </div>

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
