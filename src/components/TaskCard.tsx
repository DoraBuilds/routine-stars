import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TaskIcon } from './TaskIcon';
import type { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
}

export const TaskCard = ({ task, onToggle }: TaskCardProps) => {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.96 }}
      onClick={onToggle}
      className={`relative w-full flex items-center p-5 md:p-6 rounded-[24px] transition-all duration-300 text-left ${
        task.completed
          ? 'bg-muted opacity-60 grayscale-[0.5]'
          : 'bg-card shadow-card'
      }`}
    >
      <div
        className={`p-3 md:p-4 rounded-2xl mr-4 md:mr-6 shrink-0 transition-colors ${
          task.completed ? 'bg-muted' : 'bg-primary/10 text-primary'
        }`}
      >
        <TaskIcon iconKey={task.icon} size={40} strokeWidth={2.5} className="md:w-12 md:h-12" />
      </div>
      <span className="text-xl md:text-2xl font-semibold text-foreground flex-1">
        {task.title}
      </span>
      <div
        className={`w-11 h-11 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center transition-colors shrink-0 ${
          task.completed
            ? 'bg-success border-success text-success-foreground'
            : 'border-border'
        }`}
      >
        {task.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            <Check size={26} strokeWidth={4} />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};
