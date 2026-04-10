import { useEffect, useState } from 'react';
import { ArrowLeft, Bird, MoonStar } from 'lucide-react';
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
    <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-yellow-300 shadow-[0_0_110px_rgba(253,224,71,0.85)]" />
    <div className="absolute left-0 right-0 top-24 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.48),transparent_62%)]" />
    <div className="absolute left-8 top-20 text-4xl opacity-75" aria-hidden="true">
      <Bird size={30} />
    </div>
    <div className="absolute left-28 top-28 text-3xl opacity-70" aria-hidden="true">
      <Bird size={24} />
    </div>
    <div className="absolute right-28 top-32 text-2xl opacity-60" aria-hidden="true">
      <Bird size={20} />
    </div>
    <div className="absolute right-28 top-18 text-2xl opacity-60" aria-hidden="true">☁️</div>
    <div className="absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(74,222,128,0.35),transparent)]" />
    <div className="absolute bottom-6 left-4 text-[8rem] opacity-25" aria-hidden="true">🌳</div>
    <div className="absolute bottom-8 right-0 text-[9rem] opacity-20" aria-hidden="true">🌳</div>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:3.2rem_3.2rem] opacity-30" />
  </>
);

const EveningBackdrop = () => (
  <>
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#0f172a_0%,#172554_28%,#1e3a8a_55%,#312e81_100%)]" />
    <div className="absolute right-12 top-10 drop-shadow-[0_0_24px_rgba(253,230,138,0.55)]">
      <MoonStar size={82} className="text-amber-200" />
      <div className="absolute left-1/2 top-2 -translate-x-1/2 rotate-[-10deg] rounded-full bg-rose-100 px-3 py-1 text-[11px] font-black tracking-[0.2em] text-slate-600 shadow-sm">
        zZz
      </div>
    </div>
    <div className="absolute left-10 top-16 text-3xl text-yellow-200/90" aria-hidden="true">✦</div>
    <div className="absolute left-32 top-28 text-3xl text-yellow-200/80" aria-hidden="true">✧</div>
    <div className="absolute right-36 top-28 text-2xl text-yellow-200/85" aria-hidden="true">✦</div>
    <div className="absolute right-20 top-40 text-4xl text-yellow-100/80" aria-hidden="true">⋆</div>
    <div className="absolute left-2 bottom-0 text-[11rem] opacity-35" aria-hidden="true">🌳</div>
    <div className="absolute left-24 bottom-28 text-4xl opacity-85" aria-hidden="true">🦉</div>
    <div className="absolute left-32 bottom-24 text-2xl text-slate-200/80" aria-hidden="true">💤</div>
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

      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-8 md:px-6 md:pt-12">
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
          <div className="mb-3">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.24em] ${
                routine === 'morning'
                  ? 'bg-white/85 text-primary'
                  : 'bg-slate-950/45 text-yellow-100'
              }`}
            >
              {routine === 'morning' ? 'Morning routine' : 'Evening routine'}
            </span>
          </div>
          <h2
            className={`text-3xl font-bold md:text-4xl ${
              routine === 'morning' ? 'text-foreground' : 'text-white'
            }`}
          >
            Good {routine === 'morning' ? 'Morning' : 'Evening'}, {child.name}!
          </h2>
          <p className={`mt-2 text-lg md:text-xl ${routine === 'morning' ? 'text-slate-600' : 'text-slate-200/90'}`}>
            {isComplete
              ? 'You finished everything! Great job! 🎉'
              : "Let's see what's next on your list."}
          </p>
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
              <p className="text-xl text-muted-foreground">No tasks set up yet!</p>
              <p className="mt-1 text-muted-foreground">Ask a parent to add some.</p>
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
