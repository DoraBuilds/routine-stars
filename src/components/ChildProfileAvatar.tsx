import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMAL_AVATARS } from './animal-avatars';

type ChildProfileAvatarProps = {
  name: string;
  seed: string;
  animalKey?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'h-24 w-24',
  md: 'h-32 w-32',
  lg: 'h-36 w-36 md:h-40 md:w-40',
};

const emojiSizeClasses = {
  sm: 'text-4xl',
  md: 'text-5xl',
  lg: 'text-6xl',
};

const seededIndex = (value: string, length: number) => {
  let total = 0;
  for (const char of value) {
    total += char.charCodeAt(0);
  }
  return total % length;
};

const getAnimalAvatar = (animalKey: string | undefined, seed: string) => {
  if (animalKey) {
    const selected = ANIMAL_AVATARS.find((avatar) => avatar.key === animalKey);
    if (selected) return selected;
  }

  return ANIMAL_AVATARS[seededIndex(seed, ANIMAL_AVATARS.length)];
};

export const ChildProfileAvatar = ({
  name,
  seed,
  animalKey,
  size = 'md',
  className,
}: ChildProfileAvatarProps) => {
  const animal = getAnimalAvatar(animalKey, seed);
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      animate={{ y: [0, -4, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'relative isolate rounded-full p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]',
        sizeClasses[size],
        className
      )}
      style={{ background: animal.background }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full border border-white/70" />
      <div className="flex h-full w-full items-center justify-center rounded-full bg-white/25 backdrop-blur-[1px]">
        <span className={emojiSizeClasses[size]}>{animal.emoji}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-[45%] text-center">
        <div className="mx-auto max-w-[90%] rounded-full bg-white/95 px-2 py-1 text-[10px] font-black tracking-[0.24em] text-slate-700 shadow-sm">
          {initials || name.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </motion.div>
  );
};
