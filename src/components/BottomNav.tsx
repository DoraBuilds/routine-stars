export type KidTab = 'routines' | 'affirmations' | 'achievements' | 'mood';

interface BottomNavProps {
  active: KidTab;
  onChange: (tab: KidTab) => void;
  theme?: 'morning' | 'evening';
  placement?: 'side' | 'bottom';
}

const TABS: { id: KidTab; icon: string; label: string; tint: string }[] = [
  { id: 'routines',     icon: '📋', label: 'Routines', tint: '#f97316' },
  { id: 'affirmations', icon: '💫', label: 'Affirm.',  tint: '#ec4899' },
  { id: 'achievements', icon: '🏆', label: 'Awards',   tint: '#f59e0b' },
  { id: 'mood',         icon: '😌', label: 'Mood',     tint: '#a855f7' },
];

export const BottomNav = ({ active, onChange, theme = 'morning', placement = 'side' }: BottomNavProps) => {
  const isNight = theme === 'evening';
  const activeTint = TABS.find((t) => t.id === active)?.tint ?? '#f97316';
  const isBottom = placement === 'bottom';

  if (isBottom) {
    return (
      <div
        style={{
          width: '100%',
          height: 74,
          flexShrink: 0,
          background: isNight ? 'rgba(40,32,110,0.97)' : 'rgba(255,250,243,0.97)',
          backdropFilter: 'blur(12px)',
          borderTop: `1px solid ${isNight ? 'rgba(255,255,255,0.07)' : 'rgba(180,120,80,0.08)'}`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          zIndex: 30,
          fontFamily: "'Fredoka', system-ui, sans-serif",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '8px 4px',
              background: t.id === active ? `${activeTint}18` : 'transparent',
              border: 'none',
              borderTop: t.id === active ? `3px solid ${activeTint}` : '3px solid transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              WebkitTapHighlightColor: 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                fontSize: 32,
                lineHeight: 1,
                filter: t.id === active ? 'none' : 'grayscale(0.5)',
                opacity: t.id === active ? 1 : isNight ? 0.4 : 0.5,
                transition: 'all 0.2s',
              }}
            >
              {t.icon}
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Side placement (tablet / desktop)
  return (
    <div
      style={{
        width: 160,
        flexShrink: 0,
        background: isNight ? 'rgba(40,32,110,0.97)' : 'rgba(255,250,243,0.97)',
        backdropFilter: 'blur(12px)',
        borderRight: `1px solid ${isNight ? 'rgba(255,255,255,0.07)' : 'rgba(180,120,80,0.08)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: '16px 8px',
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
            gap: 8,
            padding: '16px 10px',
            borderRadius: 24,
            width: 144,
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
              fontSize: 52,
              lineHeight: 1,
              filter: t.id === active ? 'none' : 'grayscale(0.6)',
              opacity: t.id === active ? 1 : isNight ? 0.4 : 0.45,
              transition: 'all 0.2s',
            }}
          >
            {t.icon}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.02em',
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
