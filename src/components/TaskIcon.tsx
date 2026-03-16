import {
  Bed, Utensils, Shirt, Bath, Footprints, MoonStar,
  Smile, Sparkles, Brush, Scissors, Apple, BookOpen,
  Music, Heart, Backpack, Hand, type LucideProps,
} from 'lucide-react';
import type { FC } from 'react';

const iconMap: Record<string, FC<LucideProps>> = {
  bed: Bed,
  utensils: Utensils,
  shirt: Shirt,
  bath: Bath,
  footprints: Footprints,
  'moon-star': MoonStar,
  smile: Smile,
  sparkles: Sparkles,
  brush: Brush,
  scissors: Scissors,
  apple: Apple,
  'book-open': BookOpen,
  music: Music,
  heart: Heart,
  backpack: Backpack,
  hand: Hand,
};

interface TaskIconProps extends LucideProps {
  iconKey: string;
}

export const TaskIcon = ({ iconKey, ...props }: TaskIconProps) => {
  const Icon = iconMap[iconKey] || Smile;
  return <Icon {...props} />;
};
