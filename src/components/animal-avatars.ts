export const ANIMAL_AVATARS = [
  { key: 'bear', label: 'Bear', emoji: '🐻', background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)' },
  { key: 'bunny', label: 'Bunny', emoji: '🐰', background: 'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)' },
  { key: 'fox', label: 'Fox', emoji: '🦊', background: 'linear-gradient(135deg, #fdba74 0%, #f97316 100%)' },
  { key: 'cat', label: 'Cat', emoji: '🐱', background: 'linear-gradient(135deg, #f5d0fe 0%, #c084fc 100%)' },
  { key: 'dog', label: 'Dog', emoji: '🐶', background: 'linear-gradient(135deg, #fed7aa 0%, #fb923c 100%)' },
  { key: 'panda', label: 'Panda', emoji: '🐼', background: 'linear-gradient(135deg, #e5e7eb 0%, #cbd5e1 100%)' },
  { key: 'lion', label: 'Lion', emoji: '🦁', background: 'linear-gradient(135deg, #fde68a 0%, #facc15 100%)' },
  { key: 'koala', label: 'Koala', emoji: '🐨', background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)' },
  { key: 'frog', label: 'Frog', emoji: '🐸', background: 'linear-gradient(135deg, #bbf7d0 0%, #4ade80 100%)' },
  { key: 'monkey', label: 'Monkey', emoji: '🐵', background: 'linear-gradient(135deg, #fcd34d 0%, #fb7185 100%)' },
] as const;

export type AnimalAvatarKey = (typeof ANIMAL_AVATARS)[number]['key'];
