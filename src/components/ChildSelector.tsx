import { motion } from 'framer-motion';
import { ArrowRight, Settings } from 'lucide-react';
import type { Child } from '@/lib/types';

interface ChildSelectorProps {
  children: Child[];
  onSelectChild: (id: string) => void;
  onOpenSettings: () => void;
}

export const ChildSelector = ({ children, onSelectChild, onOpenSettings }: ChildSelectorProps) => {
  return (
    <div className="max-w-2xl mx-auto pt-16 md:pt-20 px-6 text-center min-h-svh">
      <header className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-primary mb-3"
        >
          Routine Stars
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground text-xl"
        >
          Who is ready to shine today?
        </motion.p>
      </header>

      <div className="grid gap-5">
        {children.map((child, i) => (
          <motion.button
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectChild(child.id)}
            className="bg-card p-7 md:p-8 rounded-[32px] shadow-card flex items-center justify-between group"
          >
            <span className="text-2xl md:text-3xl font-bold text-foreground">{child.name}</span>
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowRight size={22} />
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onOpenSettings}
        className="mt-12 flex items-center mx-auto text-muted-foreground hover:text-foreground transition-colors gap-2 text-lg"
      >
        <Settings size={20} />
        Parent Settings
      </motion.button>
    </div>
  );
};
