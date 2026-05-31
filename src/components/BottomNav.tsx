export type KidTab = 'routines' | 'affirmations' | 'achievements' | 'mood';

interface BottomNavProps {
  active: KidTab;
  onChange: (tab: KidTab) => void;
}

const TABS: { id: KidTab; icon: string; label: string; tint: string }[] = [
  { id: 'routines',     icon: '✅', label: 'Routines', tint: '#f97316' },
  { id: 'affirmations', icon: '💫', label: 'Affirm.',  tint: '#ec4899' },
  { id: 'achievements', icon: '🏆', label: 'Awards',   tint: '#f59e0b' },
  { id: 'mood',         icon: '💗', label: 'Mood',     tint: '#a855f7' },
];

export const BottomNav = ({ active, onChange }: BottomNavProps) => {
  const activeTint = TABS.find((t) => t.id === active)?.tint ?? '#f97316';

  return (
    <div
      style={{
        width: 76,
        flexShrink: 0,
        background: 'rgba(255,250,243,0.97)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(180,120,80,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: '16px 6px',
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
            gap: 4,
            padding: '10px 8px',
            borderRadius: 16,
            width: 62,
            background: t.id === active ? `${activeTint}18` : 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              fontSize: 22,
              filter: t.id === active ? 'none' : 'grayscale(0.55)',
              opacity: t.id === active ? 1 : 0.5,
              transition: 'all 0.2s',
            }}
          >
            {t.icon}
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: t.id === active ? activeTint : '#8a7866',
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
