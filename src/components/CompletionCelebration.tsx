import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CONFETTI_COLORS = [
  'hsl(199, 89%, 48%)',  // primary
  'hsl(35, 92%, 50%)',   // accent
  'hsl(142, 70%, 45%)',  // success
  'hsl(330, 80%, 60%)',  // pink
  'hsl(270, 70%, 60%)',  // purple
  'hsl(50, 95%, 55%)',   // yellow
];

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  delay: string;
  size: number;
  borderRadius: string;
}

const generateConfetti = (count: number): ConfettiPiece[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: `${Math.random() * 1.5}s`,
    size: 8 + Math.random() * 10,
    borderRadius: Math.random() > 0.5 ? '50%' : '3px',
  }));

interface CompletionCelebrationProps {
  childName: string;
  onFinish: () => void;
}

export const CompletionCelebration = ({ childName, onFinish }: CompletionCelebrationProps) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    setConfetti(generateConfetti(40));
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary/90 backdrop-blur-sm"
      >
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              width: piece.size,
              height: piece.size,
              borderRadius: piece.borderRadius,
            }}
          />
        ))}

        <motion.div
          initial={{ y: 60, scale: 0.9 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="bg-card p-10 md:p-12 rounded-[48px] text-center shadow-2xl max-w-sm w-full relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-24 h-24 bg-accent/15 text-accent rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles size={48} />
          </motion.div>
          <h3 className="text-4xl font-bold text-foreground mb-2">All Done!</h3>
          <p className="text-muted-foreground text-xl mb-8">
            Amazing job, {childName}! ⭐
          </p>
          <button
            onClick={onFinish}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-xl font-bold shadow-button active:translate-y-0.5 transition-transform"
          >
            Finish
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
