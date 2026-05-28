import { useState } from 'react';
import { MascotBubble } from './MascotBubble';
import { BottomNav, type KidTab } from './BottomNav';
import { RoutinesTab } from './RoutinesTab';
import { AffirmationsTab } from './AffirmationsTab';
import { AchievementsTab } from './AchievementsTab';
import { MoodTab } from './MoodTab';
import { getMascot } from '@/lib/mascots';
import type { Child, RoutineType } from '@/lib/types';

interface KidAppProps {
  kid: Child;
  theme: 'morning' | 'evening';
  onBack: () => void;
  onToggleTask: (kidId: string, routine: RoutineType, taskId: string) => void;
  onSetMood: (kidId: string, dayIdx: number, emoji: string) => void;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

export const KidApp = ({ kid, theme, onBack, onToggleTask, onSetMood }: KidAppProps) => {
  const [tab, setTab] = useState<KidTab>('routines');
  const m = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const streak = kid.streak ?? 0;

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        background: '#fff9f0',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          background: 'transparent',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: INK,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(180,120,80,0.1)',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ‹
        </button>
        <MascotBubble mascotId={kid.mascotId ?? kid.avatarAnimal} size={34} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: INK_MUTE,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            with {m.name}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginTop: -1 }}>
            Hi, {kid.name}!
          </div>
        </div>
        {streak > 0 && (
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 6px rgba(180,120,80,0.08)',
            }}
          >
            🔥 {streak}
          </div>
        )}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {tab === 'routines' && (
            <RoutinesTab kid={kid} theme={theme} onToggleTask={onToggleTask} />
          )}
          {tab === 'affirmations' && <AffirmationsTab kid={kid} />}
          {tab === 'achievements' && <AchievementsTab kid={kid} />}
          {tab === 'mood' && <MoodTab kid={kid} onSetMood={onSetMood} />}
        </div>
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};
