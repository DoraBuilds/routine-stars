import {
  Bed, Utensils, Shirt, Bath, Footprints, MoonStar,
  Smile, Sparkles, Brush, Scissors, Apple, BookOpen,
  Music, Heart, Backpack, Hand, PackageOpen, ChefHat,
  Toilet, ShowerHead, GlassWater, Milk, Banana, Sandwich,
  Pill, Sun, Star, Palette, Pencil, Puzzle, Bike, Dumbbell,
  Trophy, AlarmClock, Flower2, Gamepad2, WandSparkles, Egg,
  Cookie, IceCreamCone, Flame, Fish, Bird, Snowflake, Salad,
  Pizza, CupSoda, BicepsFlexed, Baby,
  type LucideProps,
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
  'package-open': PackageOpen,
  'chef-hat': ChefHat,
  // New icons
  toilet: Toilet,
  'shower-head': ShowerHead,
  'glass-water': GlassWater,
  milk: Milk,
  banana: Banana,
  sandwich: Sandwich,
  pill: Pill,
  sun: Sun,
  star: Star,
  palette: Palette,
  pencil: Pencil,
  puzzle: Puzzle,
  bike: Bike,
  dumbbell: Dumbbell,
  trophy: Trophy,
  'alarm-clock': AlarmClock,
  flower: Flower2,
  gamepad: Gamepad2,
  wand: WandSparkles,
  egg: Egg,
  cookie: Cookie,
  'ice-cream': IceCreamCone,
  flame: Flame,
  fish: Fish,
  bird: Bird,
  snowflake: Snowflake,
  salad: Salad,
  pizza: Pizza,
  'cup-soda': CupSoda,
  'biceps-flexed': BicepsFlexed,
  baby: Baby,
};

interface TaskIconProps extends LucideProps {
  iconKey: string;
}

export const TaskIcon = ({ iconKey, ...props }: TaskIconProps) => {
  const Icon = iconMap[iconKey] || Smile;
  return <Icon {...props} />;
};
