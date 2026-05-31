// Vibrant per-icon accent colors — used for bubble backgrounds in RoutinesTab
export const TASK_ICON_COLORS: Record<string, string> = {
  sparkles:       '#a855f7',
  brush:          '#ec4899',
  shirt:          '#3b82f6',
  utensils:       '#f97316',
  footprints:     '#0ea5e9',
  bed:            '#8b5cf6',
  scissors:       '#f43f5e',
  bath:           '#14b8a6',
  hand:           '#22c55e',
  smile:          '#f59e0b',
  apple:          '#ef4444',
  'book-open':    '#0284c7',
  backpack:       '#f59e0b',
  heart:          '#f43f5e',
  'moon-star':    '#6366f1',
  music:          '#a855f7',
  'package-open': '#f97316',
  'chef-hat':     '#ef4444',
};

// Apple emoji mapped to each icon key
export const TASK_ICON_EMOJIS: Record<string, string> = {
  sparkles:       '✨',
  brush:          '🪥',
  shirt:          '👕',
  utensils:       '🍽️',
  footprints:     '👟',
  bed:            '🛏️',
  scissors:       '✂️',
  bath:           '🛁',
  hand:           '🧼',
  smile:          '😊',
  apple:          '🍎',
  'book-open':    '📚',
  backpack:       '🎒',
  heart:          '💕',
  'moon-star':    '🌙',
  music:          '🎵',
  'package-open': '📦',
  'chef-hat':     '🍳',
};

export const getTaskIconColor = (iconKey: string): string =>
  TASK_ICON_COLORS[iconKey] ?? '#f97316';

export const getTaskIconEmoji = (iconKey: string): string =>
  TASK_ICON_EMOJIS[iconKey] ?? '✨';

interface TaskIconProps {
  iconKey: string;
  size?: number | string;
  strokeWidth?: number; // kept for API compatibility, not used for emoji
  color?: string;       // kept for API compatibility
  className?: string;
}

export const TaskIcon = ({ iconKey, size = 22, className }: TaskIconProps) => (
  <span
    role="img"
    aria-label={iconKey}
    className={className}
    style={{ fontSize: size, lineHeight: 1, display: 'inline-block', userSelect: 'none' }}
  >
    {getTaskIconEmoji(iconKey)}
  </span>
);
