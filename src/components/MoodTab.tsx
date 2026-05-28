import { useState } from 'react';
import { PainterlyBanner } from './PainterlyBanner';
import { getMascot, MOOD_OPTIONS, WEEK_DAYS } from '@/lib/mascots';
import type { Child } from '@/lib/types';

interface MoodTabProps {
  kid: Child;
  onSetMood: (kidId: string, dayIdx: number, emoji: string) => void;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';
const MOOD_PURPLE = '#a855f7';

export const MoodTab = ({ kid, onSetMood }: MoodTabProps) => {
  const m = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const [note, setNote] = useState('');

  // Today's index (Mon=0 … Sun=6)
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const moods = kid.moods ?? WEEK_DAYS.map((day) => ({ day, emoji: null }));
  const todayMood = moods[todayIdx]?.emoji ?? null;

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        paddingBottom: 80,
        background: 'linear-gradient(180deg,#fff9f0,#e9defc)',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: INK,
      }}
    >
      <PainterlyBanner
        label={`${m.emoji} ${kid.name}'s`}
        title="How are you?"
        palette="purple"
      />

      {/* Emoji picker grid */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {MOOD_OPTIONS.map((mood) => {
            const selected = todayMood === mood.emoji;
            return (
              <button
                key={mood.label}
                onClick={() => onSetMood(kid.id, todayIdx, mood.emoji)}
                style={{
                  background: selected ? mood.color : '#fff',
                  borderRadius: 18,
                  padding: '12px 6px',
                  textAlign: 'center',
                  border: selected ? `2.5px solid ${mood.color}` : '2px solid rgba(180,120,80,0.08)',
                  boxShadow: selected ? `0 4px 12px ${mood.color}55` : '0 2px 6px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <div style={{ fontSize: 32 }}>{mood.emoji}</div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: selected ? '#fff' : INK,
                    marginTop: 2,
                  }}
                >
                  {mood.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div style={{ padding: '14px 16px 0' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            padding: '12px 14px',
            border: '1.5px solid rgba(180,120,80,0.08)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: INK_MUTE,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Tell me more (optional)
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="I had a great morning!"
            style={{
              width: '100%',
              border: 'none',
              resize: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 13,
              color: MOOD_PURPLE,
              marginTop: 6,
              fontStyle: 'italic',
              minHeight: 30,
            }}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button
              style={{
                background: '#fef3c7',
                color: '#92400e',
                border: 'none',
                borderRadius: 10,
                padding: '5px 10px',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ✏️ Draw
            </button>
            <button
              style={{
                background: '#dbeafe',
                color: '#1e40af',
                border: 'none',
                borderRadius: 10,
                padding: '5px 10px',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              🎤 Voice
            </button>
          </div>
        </div>
      </div>

      {/* Week calendar */}
      <div style={{ padding: '14px 16px 0' }}>
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
          This week
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          {WEEK_DAYS.map((d, i) => (
            <div
              key={d}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '8px 0',
                background: '#fff',
                borderRadius: 12,
                border: i === todayIdx ? `2px solid ${MOOD_PURPLE}` : '1.5px solid rgba(180,120,80,0.08)',
              }}
            >
              <div style={{ fontSize: 18, opacity: moods[i]?.emoji ? 1 : 0.25 }}>
                {moods[i]?.emoji ?? '·'}
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: INK_MUTE, marginTop: 1 }}>
                {d[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
