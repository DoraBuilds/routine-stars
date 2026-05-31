import {
  Bed, Utensils, Shirt, Bath, Footprints, MoonStar,
  Smile, Sparkles, Brush, Scissors, Apple, BookOpen,
  Music, Heart, Backpack, Hand, PackageOpen, ChefHat, type LucideProps,
} from 'lucide-react';
import type { FC } from 'react';

// Vibrant per-icon accent colors — used for icon stroke and wrapper tints
export const TASK_ICON_COLORS: Record<string, string> = {
  sparkles:       '#a855f7', // violet   — toilet / misc
  brush:          '#ec4899', // pink     — brush teeth
  shirt:          '#3b82f6', // blue     — get dressed
  utensils:       '#f97316', // orange   — eat breakfast
  footprints:     '#0ea5e9', // sky      — put on shoes
  bed:            '#8b5cf6', // purple   — make bed / sleep
  scissors:       '#f43f5e', // rose     — comb hair
  bath:           '#14b8a6', // teal     — shower / wash
  hand:           '#22c55e', // green    — wash hands
  smile:          '#f59e0b', // amber    — happy / mood
  apple:          '#ef4444', // red      — food / fruit
  'book-open':    '#0284c7', // sky-700  — reading
  backpack:       '#f59e0b', // amber    — pack bag
  heart:          '#f43f5e', // rose     — heart
  'moon-star':    '#6366f1', // indigo   — night / sleep
  music:          '#a855f7', // violet   — music
  'package-open': '#f97316', // orange   — package
  'chef-hat':     '#ef4444', // red      — cooking / vitamins
};

export const getTaskIconColor = (iconKey: string): string =>
  TASK_ICON_COLORS[iconKey] ?? '#f97316';

const iconMap: Record<string, FC<LucideProps>> = {
  bed:            Bed,
  utensils:       Utensils,
  shirt:          Shirt,
  bath:           Bath,
  footprints:     Footprints,
  'moon-star':    MoonStar,
  smile:          Smile,
  sparkles:       Sparkles,
  brush:          Brush,
  scissors:       Scissors,
  apple:          Apple,
  'book-open':    BookOpen,
  music:          Music,
  heart:          Heart,
  backpack:       Backpack,
  hand:           Hand,
  'package-open': PackageOpen,
  'chef-hat':     ChefHat,
};

interface TaskIconProps extends Omit<LucideProps, 'color'> {
  iconKey: string;
  color?: string;
}

export const TaskIcon = ({ iconKey, color, size = 22, strokeWidth = 2.5, ...props }: TaskIconProps) => {
  const Icon = iconMap[iconKey] ?? Smile;
  const iconColor = color ?? getTaskIconColor(iconKey);
  return <Icon size={size} strokeWidth={strokeWidth} color={iconColor} {...props} />;
};
