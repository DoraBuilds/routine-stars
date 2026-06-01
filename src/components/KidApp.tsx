import { useState } from 'react';
import { MascotBubble } from './MascotBubble';
import { BottomNav, type KidTab } from './BottomNav';
import { RoutinesTab } from './RoutinesTab';
import { AffirmationsTab } from './AffirmationsTab';
import { AchievementsTab } from './AchievementsTab';
import { MoodTab } from './MoodTab';
import { NightBackdrop } from './NightBackdrop';
import { MorningBackdrop } from './MorningBackdrop';
import { getMascot } from '@/lib/mascots';
import type { Child, RoutineType } from '@/lib/types';

interface KidAppProps {
  kid: Child;
  theme: 'morning' | 'evening';
  onBack: () => void;
  onToggleTask: (kidId: string, routine: RoutineType, taskId: string) => void;
  onSetMood: (kidId: string, dayIdx: number, emoji: string) => void;
  onSaveNote: (kidId: string, dayIdx: number, note: string) => void;
  onAddAffirmation: (kidId: string, text: string) => void;
  onRemoveAffirmation: (kidId: string, text: string) => void;
}

type KidView = 'hub' | KidTab;

const CATEGORIES: {
  id: KidTab;
  emoji: string;
  label: string;
  desc: string;
  bg: string;
  bgNight: string;
}[] = [
  {
    id: 'routines',
    emoji: '⭐',
    label: 'Routines',
    desc: 'Your daily tasks',
    bg: 'linear-gradient(145deg,#4338ca,#818cf8)',
    bgNight: 'linear-gradient(145deg,#4338ca,#818cf8)',
  },
  {
    id: 'affirmations',
    emoji: '💫',
    label: 'Affirmations',
    desc: 'You are amazing!',
    bg: 'linear-gradient(145deg,#c2410c,#fdba74)',
    bgNight: 'linear-gradient(145deg,#c2410c,#fdba74)',
  },
  {
    id: 'achievements',
    emoji: '🏆',
    label: 'Awards',
    desc: 'Badges & streaks',
    bg: 'linear-gradient(145deg,#047857,#6ee7b7)',
    bgNight: 'linear-gradient(145deg,#047857,#6ee7b7)',
  },
  {
    id: 'mood',
    emoji: '😌',
    label: 'Mood',
    desc: 'How do you feel?',
    bg: 'linear-gradient(145deg,#9d174d,#fda4af)',
    bgNight: 'linear-gradient(145deg,#9d174d,#fda4af)',
  },
];

export const KidApp = ({ kid, theme, onBack, onToggleTask, onSetMood, onSaveNote, onAddAffirmation, onRemoveAffirmation }: KidAppProps) => {
  const [view, setView] = useState<KidView>('hub');
  const m = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const streak = kid.streak ?? 0;
  const isNight = theme === 'evening';

  // ── Hub (category picker) ──────────────────────────────────────────────────
  if (view === 'hub') {
    return (
      <div
        style={{
          position: 'relative',
          height: '100dvh',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          fontFamily: "'Fredoka', system-ui, sans-serif",
        }}
      >
        {/* Full-viewport backdrop */}
        {isNight ? <NightBackdrop /> : <MorningBackdrop />}

        {/* Centred card */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 900,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 20px 28px',
            overflow: 'hidden',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
              flexShrink: 0,
            }}
          >
            <button
              onClick={onBack}
              style={{
                width: 38,
                height: 38,
                borderRadius: 13,
                background: isNight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                color: isNight ? '#fff' : '#3d2c1f',
                border: 'none',
                cursor: 'pointer',
                boxShadow: isNight ? 'none' : '0 2px 8px rgba(180,120,80,0.12)',
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              ‹
            </button>

            <MascotBubble mascotId={kid.mascotId ?? kid.avatarAnimal} size={44} />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: isNight ? 'rgba(255,255,255,0.55)' : '#8a7866',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {isNight ? '🌙 Good evening,' : '☀️ Good morning,'}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: isNight ? '#fff' : '#3d2c1f',
                  lineHeight: 1.1,
                  marginTop: 2,
                }}
              >
                {kid.name}! {m.emoji}
              </div>
            </div>

            {streak > 0 && (
              <div
                style={{
                  background: isNight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 12,
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#f97316',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                🔥 {streak}
              </div>
            )}
          </div>

          {/* 2×2 category grid — rows sized naturally, not stretched */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridAutoRows: 'minmax(160px, 220px)',
              gap: 14,
              alignContent: 'center',
              overflowY: 'auto',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setView(cat.id)}
                style={{
                  background: isNight ? cat.bgNight : cat.bg,
                  borderRadius: 28,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '16px 12px',
                  boxShadow: isNight
                    ? '0 8px 24px rgba(0,0,0,0.4)'
                    : '0 8px 24px rgba(0,0,0,0.15)',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle shine */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    borderRadius: '28px 28px 60% 60%',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ fontSize: 56, lineHeight: 1, position: 'relative' }}>
                  {cat.emoji}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    textAlign: 'center',
                    lineHeight: 1.2,
                    position: 'relative',
                  }}
                >
                  {cat.label}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    opacity: 0.8,
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  {cat.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Tab view ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        height: '100dvh',
        background: isNight ? '#271a6e' : '#f5ede2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        fontFamily: "'Fredoka', system-ui, sans-serif",
      }}
    >
      {/* Centred content card */}
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          background: isNight ? '#312e81' : '#fff9f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: isNight
            ? '0 0 60px rgba(0,0,0,0.4)'
            : '0 0 60px rgba(180,120,80,0.12)',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            background: isNight ? 'rgba(44,38,120,0.97)' : 'rgba(255,249,240,0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${isNight ? 'rgba(255,255,255,0.06)' : 'rgba(180,120,80,0.07)'}`,
            position: 'relative',
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setView('hub')}
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: isNight ? 'rgba(255,255,255,0.1)' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: isNight ? '#fff' : '#3d2c1f',
              border: 'none',
              cursor: 'pointer',
              boxShadow: isNight ? 'none' : '0 2px 6px rgba(180,120,80,0.1)',
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
                fontSize: 16,
                fontWeight: 700,
                color: isNight ? 'rgba(255,255,255,0.45)' : '#8a7866',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              with {m.name}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: isNight ? '#fff' : '#3d2c1f',
                marginTop: 1,
              }}
            >
              Hi, {kid.name}!
            </div>
          </div>
          {streak > 0 && (
            <div
              style={{
                background: isNight ? 'rgba(255,255,255,0.1)' : '#fff',
                borderRadius: 10,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 700,
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: isNight ? 'none' : '0 2px 6px rgba(180,120,80,0.08)',
              }}
            >
              🔥 {streak}
            </div>
          )}
        </div>

        {/* Side nav + tab content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <BottomNav active={view as KidTab} onChange={setView} theme={theme} />

          {/* Tab content */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              {view === 'routines' && (
                <RoutinesTab
                  kid={kid}
                  theme={theme}
                  onToggleTask={onToggleTask}
                  onAllDone={onBack}
                />
              )}
              {view === 'affirmations' && (
                <AffirmationsTab
                  kid={kid}
                  onAddFavourite={(text) => onAddAffirmation(kid.id, text)}
                  onRemoveFavourite={(text) => onRemoveAffirmation(kid.id, text)}
                />
              )}
              {view === 'achievements' && <AchievementsTab kid={kid} />}
              {view === 'mood' && <MoodTab kid={kid} onSetMood={onSetMood} onSaveNote={onSaveNote} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
