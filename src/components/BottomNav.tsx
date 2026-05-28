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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,250,243,0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(180,120,80,0.08)',
        padding: '8px 6px env(safe-area-inset-bottom, 16px)',
        display: 'flex',
        justifyContent: 'space-around',
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
            gap: 2,
            padding: '6px 10px',
            borderRadius: 16,
            background: t.id === active ? `${activeTint}18` : 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent',
            minWidth: 60,
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
              fontSize: 10,
              fontWeight: 700,
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
