import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Settings } from 'lucide-react';
import type { Child, HomeScene, RoutineType } from '@/lib/types';
import { ChildProfileAvatar } from './ChildProfileAvatar';

interface ChildSelectorProps {
  children: Child[];
  globalTheme: 'morning' | 'evening' | 'free';
  homeScene: HomeScene;
  dueRoutineByChild: Record<string, RoutineType | null>;
  onSelectChild: (id: string) => void;
  onOpenSettings: () => void;
}

const PlaytimeScene = ({ scene }: { scene: HomeScene }) => {
  const content: Record<HomeScene, { title: string; subtitle: string; drawing: JSX.Element }> = {
    bike: {
      title: 'Bike ride day',
      subtitle: 'A playful hand-drawn ride through sunny grass.',
      drawing: (
        <>
          <div className="absolute left-10 right-10 bottom-10 h-3 rounded-full bg-emerald-300/60" />
          <div className="absolute left-12 top-10 h-16 w-16 rounded-full border-[6px] border-yellow-300 bg-yellow-200/70" />
          <div className="absolute left-24 bottom-12 h-20 w-20 rounded-full border-[6px] border-sky-500 bg-white/70" />
          <div className="absolute left-52 bottom-12 h-20 w-20 rounded-full border-[6px] border-sky-500 bg-white/70" />
          <div className="absolute left-[8.6rem] bottom-24 h-3 w-20 rotate-[18deg] rounded-full bg-sky-600" />
          <div className="absolute left-[11.7rem] bottom-24 h-3 w-14 -rotate-[32deg] rounded-full bg-sky-600" />
          <div className="absolute left-[10.7rem] bottom-[5.3rem] h-3 w-14 rotate-[62deg] rounded-full bg-sky-600" />
          <div className="absolute left-[13rem] bottom-[7.5rem] h-3 w-10 rounded-full bg-sky-600" />
        </>
      ),
    },
    school: {
      title: 'School time',
      subtitle: 'Books, stars, and doodles like a notebook page.',
      drawing: (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(125,211,252,0.15)_95%)] bg-[length:100%_2.2rem]" />
          <div className="absolute left-10 top-10 h-20 w-16 rotate-[-8deg] rounded-[10px] border-4 border-emerald-500 bg-emerald-200/80" />
          <div className="absolute left-16 top-16 h-20 w-16 rotate-[8deg] rounded-[10px] border-4 border-orange-500 bg-orange-200/80" />
          <div className="absolute left-24 top-8 h-20 w-16 rotate-[6deg] rounded-[10px] border-4 border-sky-500 bg-sky-200/80" />
          <div className="absolute right-20 top-16 text-6xl text-yellow-400/80">★</div>
          <div className="absolute right-28 bottom-14 text-5xl text-pink-400/80">✿</div>
          <div className="absolute left-1/2 bottom-10 h-3 w-32 -translate-x-1/2 rounded-full bg-violet-300/70" />
        </>
      ),
    },
    kite: {
      title: 'Fly a kite',
      subtitle: 'A breezy sky with swirls and a crayon-style kite.',
      drawing: (
        <>
          <div className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(circle_at_top,rgba(191,219,254,0.55),transparent_65%)]" />
          <div className="absolute right-24 top-12 h-28 w-28 rotate-[8deg] border-4 border-violet-500 bg-violet-200/70 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]" />
          <div className="absolute right-[7.3rem] top-12 h-28 w-[3px] rotate-[38deg] bg-sky-500" />
          <div className="absolute right-36 top-40 text-6xl text-sky-500/70">~</div>
          <div className="absolute right-28 top-48 text-6xl text-sky-500/70">~</div>
          <div className="absolute left-12 bottom-10 h-4 w-40 rounded-full bg-emerald-300/60" />
        </>
      ),
    },
    sandcastle: {
      title: 'Sandcastle day',
      subtitle: 'A beachy doodle with towers, sea, and a bright umbrella.',
      drawing: (
        <>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-sky-300/45" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-amber-200/90" />
          <div className="absolute left-20 bottom-12 h-20 w-20 rounded-t-[1.8rem] border-4 border-amber-600 bg-amber-300" />
          <div className="absolute left-36 bottom-12 h-24 w-16 rounded-t-[1.6rem] border-4 border-amber-600 bg-amber-300" />
          <div className="absolute left-[6.8rem] bottom-32 h-4 w-10 rounded-full bg-amber-600" />
          <div className="absolute left-[9.8rem] bottom-36 h-4 w-8 rounded-full bg-amber-600" />
          <div className="absolute right-24 top-12 h-20 w-20 rounded-full bg-red-300/80 [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
          <div className="absolute right-14 top-12 h-20 w-20 rounded-full bg-yellow-200/85 [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
          <div className="absolute right-24 top-28 h-20 w-1 rotate-[8deg] bg-amber-700" />
        </>
      ),
    },
  };

  const active = content[scene];

  return (
    <div className="relative mt-10 overflow-hidden rounded-[40px] border border-border bg-card/90 p-6 shadow-card">
      <div className="absolute inset-4 rounded-[32px] border-2 border-dashed border-primary/15" />
      <div className="relative h-[18rem] overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(248,250,252,0.96))]">
        {active.drawing}
      </div>
      <div className="relative mt-5 text-center">
        <p className="text-sm font-black uppercase tracking-[0.26em] text-primary">Home Scene</p>
        <h2 className="mt-2 text-3xl font-bold text-foreground">{active.title}</h2>
        <p className="mt-2 text-base text-muted-foreground">{active.subtitle}</p>
      </div>
    </div>
  );
};

const ThemedBackdrop = ({ theme }: { theme: ChildSelectorProps['globalTheme'] }) => {
  if (theme === 'morning') {
    return (
      <>
        <div className="absolute right-10 top-16 -z-10 h-28 w-28 rounded-full bg-yellow-300/80 shadow-[0_0_90px_rgba(253,224,71,0.7)]" />
        <div className="absolute inset-x-0 top-24 -z-10 h-52 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.45),transparent_55%)]" />
        <div className="absolute bottom-0 left-0 -z-10 h-40 w-full bg-[linear-gradient(to_top,rgba(134,239,172,0.32),transparent)]" />
        <div className="absolute left-10 top-28 -z-10 text-3xl opacity-70" aria-hidden="true">🐦</div>
        <div className="absolute left-24 top-20 -z-10 text-2xl opacity-65" aria-hidden="true">☁️</div>
        <div className="absolute right-24 bottom-8 -z-10 text-7xl opacity-30" aria-hidden="true">🌳</div>
      </>
    );
  }

  if (theme === 'evening') {
    return (
      <>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.14),transparent_55%)]" />
        <div className="absolute right-10 top-14 -z-10 text-7xl opacity-75" aria-hidden="true">🌙</div>
        <div className="absolute left-10 top-16 -z-10 text-3xl opacity-60" aria-hidden="true">⭐</div>
        <div className="absolute left-28 top-28 -z-10 text-2xl opacity-60" aria-hidden="true">✨</div>
        <div className="absolute right-24 top-32 -z-10 text-2xl opacity-50" aria-hidden="true">💤</div>
      </>
    );
  }

  return (
    <>
      <div className="absolute left-4 top-16 -z-10 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
      <div className="absolute right-10 top-24 -z-10 h-32 w-32 rounded-full bg-success/15 blur-2xl" />
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-56 w-[32rem] max-w-full rounded-full bg-primary/10 blur-3xl" />
    </>
  );
};

export const ChildSelector = ({
  children,
  globalTheme,
  homeScene,
  dueRoutineByChild,
  onSelectChild,
  onOpenSettings,
}: ChildSelectorProps) => {
  const holdTimerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const [isHoldingParentGate, setIsHoldingParentGate] = useState(false);
  const [parentGateProgress, setParentGateProgress] = useState(0);

  const clearParentGateTimers = () => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const startParentGateHold = () => {
    clearParentGateTimers();
    setIsHoldingParentGate(true);
    setParentGateProgress(0);

    const start = performance.now();
    progressTimerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - start;
      setParentGateProgress(Math.min(100, (elapsed / 1200) * 100));
    }, 16);

    holdTimerRef.current = window.setTimeout(() => {
      clearParentGateTimers();
      setIsHoldingParentGate(false);
      setParentGateProgress(100);
      onOpenSettings();
      window.setTimeout(() => setParentGateProgress(0), 150);
    }, 1200);
  };

  const cancelParentGateHold = () => {
    clearParentGateTimers();
    setIsHoldingParentGate(false);
    setParentGateProgress(0);
  };

  useEffect(() => () => clearParentGateTimers(), []);

  const title =
    globalTheme === 'morning'
      ? 'Morning routine time'
      : globalTheme === 'evening'
        ? 'Evening routine time'
        : 'Routine Stars';
  const subtitle =
    globalTheme === 'morning'
      ? 'The sun is up and morning routines are ready.'
      : globalTheme === 'evening'
        ? 'The stars are out and bedtime routines are ready.'
        : 'Who is ready to shine today?';

  return (
    <div className="relative max-w-5xl mx-auto px-5 md:px-6 py-10 md:py-14 min-h-svh">
      <ThemedBackdrop theme={globalTheme} />

      <header className="mb-10 md:mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-primary mb-3"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {children.map((child, i) => (
          <motion.button
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectChild(child.id)}
            aria-label={`Select ${child.name}`}
            className="group relative overflow-hidden rounded-[36px] border border-border bg-card p-5 md:p-6 shadow-card transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_55%)]" />
            <div className="relative flex flex-col items-center text-center">
              <ChildProfileAvatar
                name={child.name}
                seed={child.avatarSeed ?? child.id}
                animalKey={child.avatarAnimal}
                size="lg"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="mt-8">
                <span className="block text-2xl md:text-[1.75rem] font-black tracking-[0.18em] text-foreground">
                  {child.name.toUpperCase()}
                </span>
                <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                  {dueRoutineByChild[child.id]
                    ? `${dueRoutineByChild[child.id]} routine ready`
                    : 'Tap to start'}
                </span>
              </div>
              <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight size={20} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {globalTheme === 'free' && <PlaytimeScene scene={homeScene} />}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        type="button"
        onPointerDown={startParentGateHold}
        onPointerUp={cancelParentGateHold}
        onPointerLeave={cancelParentGateHold}
        onPointerCancel={cancelParentGateHold}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !isHoldingParentGate) {
            event.preventDefault();
            startParentGateHold();
          }
        }}
        onKeyUp={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            cancelParentGateHold();
          }
        }}
        className="mt-10 md:mt-12 flex flex-col items-center mx-auto text-muted-foreground hover:text-foreground transition-colors gap-3 text-lg"
        aria-label="Press and hold to open Parent Settings"
      >
        <div className="flex items-center gap-2">
          <Settings size={20} />
          Parent Settings
        </div>
        <div className="w-56 max-w-full">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-75"
              style={{ width: `${parentGateProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
            {isHoldingParentGate ? 'Keep holding...' : 'Press and hold to open'}
          </p>
        </div>
      </motion.button>
    </div>
  );
};
