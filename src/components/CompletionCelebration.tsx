import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { balloons } from 'balloons-js';
import { PartyPopper, Star } from 'lucide-react';
import { motion } from 'framer-motion';

type CelebrationVariant = 'task' | 'routine';

interface CompletionCelebrationProps {
  variant: CelebrationVariant;
  childName: string;
  onFinish: () => void;
}

const fireRealisticConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 1000,
    disableForReducedMotion: true,
  };

  const fire = (particleRatio: number, options: confetti.Options) => {
    confetti({
      ...defaults,
      ...options,
      particleCount: Math.floor(count * particleRatio),
    });
  };

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const CompletionCelebration = ({ variant, childName, onFinish }: CompletionCelebrationProps) => {
  useEffect(() => {
    if (variant === 'task') {
      fireRealisticConfetti();

      const timer = window.setTimeout(onFinish, 1400);
      return () => window.clearTimeout(timer);
    }

    fireRealisticConfetti();
    void balloons();

    const timer = window.setTimeout(onFinish, 4500);
    return () => window.clearTimeout(timer);
  }, [onFinish, variant]);

  if (variant === 'task') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="pointer-events-none fixed inset-x-0 top-10 z-[1001] flex justify-center px-6"
      aria-live="polite"
      role="status"
    >
      <div className="rounded-full bg-white/92 px-6 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-md">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PartyPopper size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <p className="mt-1 text-xl font-bold">All done, {childName}!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
