export type Task = {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
};

export type RoutineType = 'morning' | 'evening';

export type Child = {
  id: string;
  name: string;
  morning: Task[];
  evening: Task[];
};

export type AppView = 'home' | 'routine' | 'parent';

export const ICON_OPTIONS = [
  { key: 'bed', label: 'Bed' },
  { key: 'utensils', label: 'Eating' },
  { key: 'shirt', label: 'Clothes' },
  { key: 'bath', label: 'Bath' },
  { key: 'footprints', label: 'Shoes' },
  { key: 'moon-star', label: 'Bedtime' },
  { key: 'smile', label: 'Smile' },
  { key: 'sparkles', label: 'Sparkles' },
  { key: 'brush', label: 'Brush' },
  { key: 'scissors', label: 'Hair' },
  { key: 'apple', label: 'Snack' },
  { key: 'book-open', label: 'Reading' },
  { key: 'music', label: 'Music' },
  { key: 'heart', label: 'Love' },
  { key: 'backpack', label: 'Backpack' },
  { key: 'hand', label: 'Wash hands' },
] as const;

export const DEFAULT_CHILDREN: Child[] = [
  {
    id: '1',
    name: 'Lily',
    morning: [
      { id: 'm1', title: 'Make bed', icon: 'bed', completed: false },
      { id: 'm2', title: 'Brush teeth', icon: 'brush', completed: false },
      { id: 'm3', title: 'Get dressed', icon: 'shirt', completed: false },
      { id: 'm4', title: 'Comb hair', icon: 'scissors', completed: false },
      { id: 'm5', title: 'Eat breakfast', icon: 'utensils', completed: false },
      { id: 'm6', title: 'Put on shoes', icon: 'footprints', completed: false },
    ],
    evening: [
      { id: 'e1', title: 'Finish dinner', icon: 'utensils', completed: false },
      { id: 'e2', title: 'Put on pajamas', icon: 'shirt', completed: false },
      { id: 'e3', title: 'Brush teeth', icon: 'brush', completed: false },
      { id: 'e4', title: 'Comb hair', icon: 'scissors', completed: false },
      { id: 'e5', title: 'Tidy room', icon: 'sparkles', completed: false },
      { id: 'e6', title: 'Go to bed', icon: 'moon-star', completed: false },
    ],
  },
  {
    id: '2',
    name: 'Mila',
    morning: [
      { id: 'mm1', title: 'Make bed', icon: 'bed', completed: false },
      { id: 'mm2', title: 'Brush teeth', icon: 'brush', completed: false },
      { id: 'mm3', title: 'Get dressed', icon: 'shirt', completed: false },
      { id: 'mm4', title: 'Eat breakfast', icon: 'utensils', completed: false },
      { id: 'mm5', title: 'Put on shoes', icon: 'footprints', completed: false },
    ],
    evening: [
      { id: 'me1', title: 'Finish dinner', icon: 'utensils', completed: false },
      { id: 'me2', title: 'Put on pajamas', icon: 'shirt', completed: false },
      { id: 'me3', title: 'Brush teeth', icon: 'brush', completed: false },
      { id: 'me4', title: 'Go to bed', icon: 'moon-star', completed: false },
    ],
  },
  {
    id: '3',
    name: 'Ellie',
    morning: [
      { id: 'em1', title: 'Make bed', icon: 'bed', completed: false },
      { id: 'em2', title: 'Brush teeth', icon: 'brush', completed: false },
      { id: 'em3', title: 'Get dressed', icon: 'shirt', completed: false },
      { id: 'em4', title: 'Comb hair', icon: 'scissors', completed: false },
      { id: 'em5', title: 'Eat breakfast', icon: 'utensils', completed: false },
    ],
    evening: [
      { id: 'ee1', title: 'Finish dinner', icon: 'utensils', completed: false },
      { id: 'ee2', title: 'Put on pajamas', icon: 'shirt', completed: false },
      { id: 'ee3', title: 'Brush teeth', icon: 'brush', completed: false },
      { id: 'ee4', title: 'Tidy room', icon: 'sparkles', completed: false },
      { id: 'ee5', title: 'Go to bed', icon: 'moon-star', completed: false },
    ],
  },
];
