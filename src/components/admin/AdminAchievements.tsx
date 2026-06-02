import { AdminBar } from './AdminBar';
import { BADGE_CATALOG } from '@/lib/mascots';
import type { Child } from '@/lib/types';

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

interface AdminAchievementsProps {
  kid: Child;
  onBack: () => void;
  onToggleBadge: (kidId: string, badgeId: string) => void;
  onToggleCelebration?: (kidId: string) => void;
}

export const AdminAchievements = ({
  kid,
  onBack,
  onToggleBadge,
  onToggleCelebration,
}: AdminAchievementsProps) => {
  const badges = kid.badges ?? {};
  const earnedCount = Object.values(badges).filter(Boolean).length;
  const streak = kid.streak ?? 0;
  const celebrateStreaks = kid.celebrateStreaks ?? true;

  return (
    <div
      style={{
        height: '100%',
        background: '#fff9f0',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: INK,
        overflowY: 'auto',
      }}
    >
      <AdminBar sub={`${kid.name}'s setup`} title="Awards" onBack={onBack} />

      {/* Streak summary */}
      <div style={{ padding: '12px 14px 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg,#fed7aa,#fdba74)',
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 32 }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#7c2d12', lineHeight: 1 }}>
              {streak}
              <span style={{ fontSize: 15, fontWeight: 600 }}> day streak</span>
            </div>
            <div style={{ fontSize: 13, color: '#9a3412', marginTop: 2 }}>Keep it up! 🌟</div>
          </div>
        </div>
      </div>

      {/* Celebration toggle */}
      <div style={{ padding: '8px 14px 0' }}>
        <button
          onClick={() => onToggleCelebration?.(kid.id)}
          style={{
            width: '100%',
            background: '#fff',
            borderRadius: 16,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            border: '1.5px solid rgba(180,120,80,0.05)',
            cursor: onToggleCelebration ? 'pointer' : 'default',
            fontFamily: 'inherit',
            textAlign: 'left',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <div style={{ fontSize: 22 }}>🎉</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Celebrate streaks</div>
            <div style={{ fontSize: 13, color: INK_MUTE }}>Confetti & balloons when routine is done</div>
          </div>
          <div
            style={{
              width: 40,
              height: 24,
              borderRadius: 99,
              background: celebrateStreaks ? '#f59e0b' : '#e2e8f0',
              position: 'relative',
              transition: 'background 0.18s',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 3,
                left: celebrateStreaks ? 19 : 3,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                transition: 'left 0.18s',
              }}
            />
          </div>
        </button>
      </div>

      {/* Badges */}
      <div style={{ padding: '14px 14px 24px' }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: INK_MUTE,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Badges · {earnedCount} of {BADGE_CATALOG.length}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {BADGE_CATALOG.map((b) => {
            const earned = Boolean(badges[b.id]);
            return (
              <div
                key={b.id}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: `1.5px solid ${earned ? '#fed7aa' : 'rgba(180,120,80,0.05)'}`,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: earned ? '#fef3c7' : '#fff9f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    filter: earned ? 'none' : 'grayscale(0.7)',
                    opacity: earned ? 1 : 0.5,
                    flexShrink: 0,
                  }}
                >
                  {b.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{b.name}</div>
                  <div style={{ fontSize: 13, color: INK_MUTE }}>{b.desc}</div>
                </div>
                <button
                  onClick={() => onToggleBadge(kid.id, b.id)}
                  style={{
                    width: 40,
                    height: 24,
                    borderRadius: 99,
                    background: earned ? '#f59e0b' : '#e2e8f0',
                    position: 'relative',
                    cursor: 'pointer',
                    border: 'none',
                    fontFamily: 'inherit',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'background 0.18s',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: earned ? 19 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      transition: 'left 0.18s',
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
