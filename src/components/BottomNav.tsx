export type KidTab = 'routines' | 'affirmations' | 'achievements' | 'mood';

interface BottomNavProps {
  active: KidTab;
  onChange: (tab: KidTab) => void;
  theme?: 'morning' | 'evening';
}

const TABS: { id: KidTab; icon: string; label: string; tint: string }[] = [
  { id: 'routines',     icon: '✅', label: 'Routines', tint: '#f97316' },
  { id: 'affirmations', icon: '💫', label: 'Affirm.',  tint: '#ec4899' },
  { id: 'achievements', icon: '🏆', label: 'Awards',   tint: '#f59e0b' },
  { id: 'mood',         icon: '💗', label: 'Mood',     tint: '#a855f7' },
];

export const BottomNav = ({ active, onChange, theme = 'morning' }: BottomNavProps) => {
  const isNight = theme === 'evening';
  const activeTint = TABS.find((t) => t.id === active)?.tint ?? '#f97316';

  return (
    <div
      style={{
        width: 84,
        flexShrink: 0,
        background: isNight ? 'rgba(15,8,50,0.96)' : 'rgba(255,250,243,0.97)',
        backdropFilter: 'blur(12px)',
        borderRight: `1px solid ${isNight ? 'rgba(255,255,255,0.07)' : 'rgba(180,120,80,0.08)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: '16px 4px',
        zIndex: 30,
        fontFamily: "'Fredoka', system-ui, sans-serif",
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            padding: '12px 8px',
            borderRadius: 18,
            width: 72,
            background: t.id === active ? `${activeTint}22` : 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              fontSize: 30,
              filter: t.id === active ? 'none' : 'grayscale(0.6)',
              opacity: t.id === active ? 1 : isNight ? 0.4 : 0.45,
              transition: 'all 0.2s',
            }}
          >
            {t.icon}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.03em',
              color: t.id === active ? activeTint : isNight ? 'rgba(255,255,255,0.45)' : '#8a7866',
              transition: 'color 0.2s',
            }}
          >
            {t.label}
          </div>
        </button>
      ))}
    </div>
  );
};
