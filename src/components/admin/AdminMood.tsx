import { AdminBar } from './AdminBar';
import { WEEK_DAYS } from '@/lib/mascots';
import type { Child } from '@/lib/types';

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

interface AdminMoodProps {
  kid: Child;
  onBack: () => void;
}

const SETTINGS = [
  { icon: '💗', label: 'Daily check-in',  desc: 'Ask after morning routine',     on: true,  tint: '#a855f7' },
  { icon: '🎤', label: 'Voice notes',     desc: 'Let them record how they feel', on: true,  tint: '#3b82f6' },
  { icon: '✏️', label: 'Drawing notes',   desc: 'Let them sketch how they feel', on: false, tint: '#f59e0b' },
  { icon: '🔔', label: 'Reminders',       desc: 'Gentle nudge if skipped',       on: false, tint: '#22c55e' },
];

export const AdminMood = ({ kid, onBack }: AdminMoodProps) => {
  const moods = kid.moods ?? WEEK_DAYS.map((day) => ({ day, emoji: null }));

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
      <AdminBar sub={`${kid.name}'s setup`} title="Mood" onBack={onBack} />

      {/* Settings toggles */}
      <div style={{ padding: '12px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SETTINGS.map((o) => (
          <div
            key={o.label}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '1.5px solid rgba(180,120,80,0.05)',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: `${o.tint}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {o.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{o.label}</div>
              <div style={{ fontSize: 11, color: INK_MUTE }}>{o.desc}</div>
            </div>
            <div
              style={{
                width: 38,
                height: 22,
                borderRadius: 99,
                background: o.on ? o.tint : '#e2e8f0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: o.on ? 18 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Week preview */}
      <div style={{ padding: '14px 14px 0' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: INK_MUTE,
            marginBottom: 6,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          This week's moods
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 12,
            border: '1.5px solid rgba(180,120,80,0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            {moods.map((m, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '8px 0',
                  background: '#fff9f0',
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 22, opacity: m.emoji ? 1 : 0.25 }}>{m.emoji ?? '·'}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: INK_MUTE, marginTop: 2 }}>{m.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights card */}
      <div style={{ padding: '12px 14px 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg,#e9defc,#ddd6fe)',
            borderRadius: 16,
            padding: 14,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 22 }}>💜</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#5b21b6' }}>
              This week's pattern
            </div>
            <div style={{ fontSize: 11, color: '#6d28d9', marginTop: 4, lineHeight: 1.5 }}>
              Keep tracking daily moods — insights will appear here over time. 🌸
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
