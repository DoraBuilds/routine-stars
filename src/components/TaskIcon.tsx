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
  toilet:         '#60a5fa',
  'shower-head':  '#67e8f9',
  'glass-water':  '#38bdf8',
  milk:           '#94a3b8',
  banana:         '#facc15',
  sandwich:       '#fb923c',
  pill:           '#f87171',
  sun:            '#fbbf24',
  star:           '#f59e0b',
  palette:        '#f472b6',
  pencil:         '#fbbf24',
  puzzle:         '#a78bfa',
  bike:           '#22d3ee',
  dumbbell:       '#fb923c',
  trophy:         '#eab308',
  'alarm-clock':  '#fb923c',
  flower:         '#f472b6',
  gamepad:        '#60a5fa',
  wand:           '#c084fc',
  egg:            '#fef08a',
  cookie:         '#d97706',
  'ice-cream':    '#f9a8d4',
  flame:          '#fb923c',
  fish:           '#22d3ee',
  bird:           '#60a5fa',
  snowflake:      '#bae6fd',
  salad:          '#86efac',
  pizza:          '#f87171',
  'cup-soda':     '#f9a8d4',
  'biceps-flexed':'#fb923c',
  baby:           '#f9a8d4',
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
  toilet:         '🚽',
  'shower-head':  '🚿',
  'glass-water':  '💧',
  milk:           '🥛',
  banana:         '🍌',
  sandwich:       '🥪',
  pill:           '💊',
  sun:            '☀️',
  star:           '⭐',
  palette:        '🎨',
  pencil:         '✏️',
  puzzle:         '🧩',
  bike:           '🚲',
  dumbbell:       '🏋️',
  trophy:         '🏆',
  'alarm-clock':  '⏰',
  flower:         '🌸',
  gamepad:        '🎮',
  wand:           '🪄',
  egg:            '🥚',
  cookie:         '🍪',
  'ice-cream':    '🍦',
  flame:          '🕯️',
  fish:           '🐟',
  bird:           '🐦',
  snowflake:      '❄️',
  salad:          '🥗',
  pizza:          '🍕',
  'cup-soda':     '🥤',
  'biceps-flexed':'💪',
  baby:           '👶',
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
