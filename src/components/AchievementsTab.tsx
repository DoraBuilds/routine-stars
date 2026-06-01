import { PainterlyBanner } from './PainterlyBanner';
import { getMascot, BADGE_CATALOG, WEEK_DAYS } from '@/lib/mascots';
import type { Child } from '@/lib/types';

interface AchievementsTabProps {
  kid: Child;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';
const ROUTINES_ORANGE = '#f97316';

export const AchievementsTab = ({ kid }: AchievementsTabProps) => {
  const m = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const badges = kid.badges ?? {};
  const earnedCount = Object.values(badges).filter(Boolean).length;
  const streak = kid.streak ?? 0;

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        paddingBottom: 80,
        background: 'linear-gradient(180deg,#fff9f0,#fef3c7)',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: INK,
      }}
    >
      <PainterlyBanner
        label={`${m.emoji} ${kid.name}'s`}
        title="Awards"
        palette="amber"
      />

      <div style={{ padding: '0 16px' }}>
        {/* Streak card */}
        <div
          style={{
            background: 'linear-gradient(135deg,#fed7aa,#fdba74)',
            borderRadius: 22,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 4px 12px rgba(249,115,22,0.18)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Sun-ray decoration */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 38,
                top: '50%',
                width: 110,
                height: 6,
                background: 'rgba(255,255,255,0.16)',
                transformOrigin: 'left center',
                transform: `rotate(${i * 45}deg) translateY(-3px)`,
              }}
            />
          ))}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'radial-gradient(circle,#fef3c7,#fbbf24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              position: 'relative',
              boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.08), 0 4px 0 rgba(180,83,9,0.3)',
              flexShrink: 0,
            }}
          >
            🔥
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: '#7c2d12', lineHeight: 1 }}>{streak}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#9a3412', marginTop: 4 }}>day streak!</div>
          </div>
        </div>

        {/* Week chips */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, gap: 4 }}>
          {WEEK_DAYS.map((d, i) => {
            const filled = streak > 0 && i < Math.min(streak, 7);
            return (
              <div
                key={d}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '8px 0',
                  borderRadius: 12,
                  background: filled ? ROUTINES_ORANGE : 'rgba(180,120,80,0.1)',
                  color: filled ? '#fff' : INK_MUTE,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <div>{d[0]}</div>
                <div style={{ fontSize: 16, marginTop: 2 }}>{filled ? '✓' : '·'}</div>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: INK_MUTE,
            margin: '20px 0 10px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Badges · {earnedCount} of {BADGE_CATALOG.length}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {BADGE_CATALOG.map((b) => {
            const earned = Boolean(badges[b.id]);
            return (
              <div
                key={b.id}
                style={{
                  background: earned ? '#fff' : 'rgba(180,120,80,0.06)',
                  borderRadius: 18,
                  padding: '14px 8px',
                  textAlign: 'center',
                  border: earned ? '1.5px solid #fed7aa' : '1.5px dashed rgba(180,120,80,0.2)',
                  opacity: earned ? 1 : 0.6,
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: 34, filter: earned ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: earned ? INK : INK_MUTE,
                    marginTop: 6,
                    lineHeight: 1.2,
                  }}
                >
                  {b.name}
                </div>
                {!earned && (
                  <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 14 }}>🔒</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
