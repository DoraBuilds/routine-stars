import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Settings } from 'lucide-react';
import type { Child, HomeScene, RoutineType } from '@/lib/types';
import { ChildProfileAvatar } from './ChildProfileAvatar';
import { HomeSceneBackdrop } from './HomeSceneBackdrop';

interface ChildSelectorProps {
  children: Child[];
  globalTheme: 'morning' | 'evening' | 'free';
  homeScene: HomeScene;
  dueRoutineByChild: Record<string, RoutineType | null>;
  onSelectChild: (id: string) => void;
  onOpenSettings: () => void;
}

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
    <div className="relative isolate max-w-5xl mx-auto px-5 md:px-6 py-10 md:py-14 min-h-svh">
      <HomeSceneBackdrop scene={homeScene} theme={globalTheme} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_40%)]" />

      <header className="relative z-10 mb-10 md:mb-12 text-center">
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

      <div className="relative z-10 grid gap-5 md:grid-cols-3">
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
            className="group relative overflow-hidden rounded-[36px] border border-white/70 bg-card/82 p-5 md:p-6 shadow-card backdrop-blur-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_55%)]" />
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

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-10 md:mt-12 flex flex-col items-center mx-auto text-muted-foreground hover:text-foreground transition-colors gap-3 text-lg"
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
