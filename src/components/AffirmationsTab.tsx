import { useState } from 'react';
import { PainterlyBanner } from './PainterlyBanner';
import { getMascot } from '@/lib/mascots';
import type { Child } from '@/lib/types';

interface AffirmationsTabProps {
  kid: Child;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

export const AffirmationsTab = ({ kid }: AffirmationsTabProps) => {
  const [idx, setIdx] = useState(0);
  const m = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const list = kid.affirmations?.length ? kid.affirmations : ['I am exactly enough.'];
  const current = idx % list.length;
  const text = list[current];

  const FAVE_ICONS = ['🌟', '🦁', '💙', '💗'];
  const FAVE_COLORS = ['#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3'];

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        paddingBottom: 80,
        background: 'linear-gradient(180deg,#fff9f0,#fde7f3)',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: INK,
      }}
    >
      <PainterlyBanner
        label={`${m.emoji} ${kid.name}'s`}
        title="Daily Affirmation"
        palette="pink"
      />

      {/* Main card */}
      <div style={{ padding: '4px 18px 0' }}>
        <div
          style={{
            background: 'linear-gradient(160deg,#fce7f3,#ffe4e6)',
            borderRadius: 28,
            padding: '24px 22px',
            textAlign: 'center',
            border: '2px solid rgba(236,72,153,0.15)',
            boxShadow: '0 8px 24px rgba(236,72,153,0.1)',
            position: 'relative',
          }}
        >
          {/* Decorations */}
          <div style={{ position: 'absolute', top: 10, left: 14, fontSize: 16, opacity: 0.45 }}>✿</div>
          <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 14, opacity: 0.45 }}>✦</div>
          <div style={{ position: 'absolute', bottom: 10, left: 16, fontSize: 12, opacity: 0.45 }}>✦</div>
          <div style={{ position: 'absolute', bottom: 14, right: 14, fontSize: 16, opacity: 0.45 }}>✿</div>

          <div style={{ fontSize: 60, marginBottom: 12 }}>{m.emoji}</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#831843',
              lineHeight: 1.3,
              fontStyle: 'italic',
              margin: '0 4px',
            }}
          >
            "{text}"
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#be185d',
              marginTop: 12,
              fontWeight: 500,
            }}
          >
            {m.name} says: take a deep breath 🌸
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
            <button
              onClick={() => window.alert('Audio playback coming soon!')}
              style={{
                background: '#ec4899',
                color: '#fff',
                border: 'none',
                width: 52,
                height: 52,
                borderRadius: '50%',
                fontSize: 22,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 0 #be185d',
              }}
            >
              ▶
            </button>
            <button
              onClick={() => setIdx((i) => i + 1)}
              style={{
                background: '#fff',
                color: '#be185d',
                border: 'none',
                padding: '0 18px',
                height: 52,
                borderRadius: 26,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 0 rgba(236,72,153,0.2)',
              }}
            >
              ↻ Next
            </button>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              borderRadius: 99,
              background: i === current ? '#ec4899' : 'rgba(236,72,153,0.25)',
              transition: 'width 0.25s',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Favourites list */}
      <div style={{ padding: '18px 18px 0' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: INK_MUTE,
            marginBottom: 8,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {kid.name}'s favourites
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.slice(0, 4).map((aff, i) => (
            <div
              key={i}
              style={{
                background: FAVE_COLORS[i % FAVE_COLORS.length],
                borderRadius: 16,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 18 }}>{FAVE_ICONS[i % FAVE_ICONS.length]}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500, fontStyle: 'italic' }}>
                "{aff}"
              </div>
              <div style={{ fontSize: 16, color: '#ec4899' }}>♡</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
