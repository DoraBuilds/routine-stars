import { useRef } from 'react';
import confetti from 'canvas-confetti';
import { PainterlyBanner } from './PainterlyBanner';
import { TaskIcon, getTaskIconColor } from './TaskIcon';
import { getMascot } from '@/lib/mascots';
import type { Child, RoutineType } from '@/lib/types';

interface RoutinesTabProps {
  kid: Child;
  theme: 'morning' | 'evening';
  onToggleTask: (kidId: string, routine: RoutineType, taskId: string) => void;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';
const PEACH = '#ffe8d6';
const LAVENDER = '#e9defc';
const ROUTINES_ORANGE = '#f97316';
const MOOD_PURPLE = '#a855f7';

function fireTaskConfetti(el: HTMLElement | null) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const x = (r.left + r.width / 2) / window.innerWidth;
  const y = (r.top + r.height / 2) / window.innerHeight;
  void confetti({
    particleCount: 50,
    spread: 80,
    origin: { x, y },
    colors: ['#f97316', '#ec4899', '#a855f7', '#22c55e', '#f59e0b'],
    startVelocity: 30,
    gravity: 0.85,
    scalar: 0.85,
    ticks: 120,
  });
}

function fireRoutineConfetti() {
  const fire = (ratio: number, opts: confetti.Options) =>
    confetti({
      particleCount: Math.floor(180 * ratio),
      origin: { y: 0.65 },
      colors: ['#f97316', '#ec4899', '#a855f7', '#22c55e', '#f59e0b', '#0ea5e9'],
      ...opts,
    });
  void fire(0.3, { spread: 30, startVelocity: 55 });
  void fire(0.3, { spread: 70 });
  void fire(0.4, { spread: 110, decay: 0.91, scalar: 0.85 });
}

export const RoutinesTab = ({ kid, theme, onToggleTask }: RoutinesTabProps) => {
  const isMorning = theme === 'morning';
  const tasks = isMorning ? kid.morning : kid.evening;
  const done = tasks.filter((t) => t.completed).length;
  const m = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleTap = (taskId: string) => {
    const wasCompleted = tasks.find((t) => t.id === taskId)?.completed;
    onToggleTask(kid.id, isMorning ? 'morning' : 'evening', taskId);
    if (!wasCompleted) {
      fireTaskConfetti(buttonRefs.current[taskId] ?? null);
      // Check all-done after state update
      const remaining = tasks.filter((t) => t.id !== taskId && !t.completed);
      if (remaining.length === 0) {
        setTimeout(() => fireRoutineConfetti(), 120);
      }
    }
  };

  const nightCard1 = 'rgba(255,255,255,0.06)';
  const nightCard2 = 'rgba(255,255,255,0.04)';
  const nightDone  = 'rgba(139,92,246,0.18)';

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        paddingBottom: 24,
        background: isMorning
          ? 'linear-gradient(180deg,#fff9f0 0%,#fef0e1 100%)'
          : 'linear-gradient(180deg,#0f0a2e 0%,#1a1040 100%)',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: isMorning ? INK : 'rgba(255,255,255,0.92)',
      }}
    >
      <PainterlyBanner
        label={`${m.emoji} ${kid.name}'s`}
        title={isMorning ? 'Morning Routine' : 'Night Routine'}
        palette={isMorning ? 'morning' : 'evening'}
      />

      {/* Progress row */}
      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: isMorning ? INK_MUTE : 'rgba(255,255,255,0.45)' }}>
          {done} of {tasks.length} done
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {tasks.map((t) => (
            <div
              key={t.id}
              style={{
                width: 16,
                height: 4,
                borderRadius: 99,
                background: t.completed
                  ? ROUTINES_ORANGE
                  : isMorning ? 'rgba(180,120,80,0.18)' : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Task cards */}
      <div style={{ padding: '4px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map((t, i) => {
          const cardBg = isMorning
            ? (t.completed ? LAVENDER : i % 2 === 0 ? PEACH : '#fff1e1')
            : (t.completed ? nightDone : i % 2 === 0 ? nightCard1 : nightCard2);
          const iconColor = getTaskIconColor(t.icon);
          return (
            <button
              key={t.id}
              ref={(el) => { buttonRefs.current[t.id] = el; }}
              onClick={() => handleTap(t.id)}
              style={{
                background: cardBg,
                borderRadius: 18,
                padding: '13px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: t.completed ? 0.7 : 1,
                border: `1px solid ${isMorning ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                fontFamily: 'inherit',
                color: 'inherit',
                textAlign: 'left',
                width: '100%',
                WebkitTapHighlightColor: 'transparent',
                transition: 'transform 0.1s, opacity 0.3s',
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 15,
                  background: t.completed
                    ? (isMorning ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)')
                    : `${iconColor}28`,
                  border: `1.5px solid ${t.completed ? 'rgba(255,255,255,0.35)' : `${iconColor}50`}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                }}
              >
                <TaskIcon iconKey={t.icon} size={24} />
              </div>
              <div
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: t.completed ? 'line-through' : 'none',
                  opacity: t.completed ? 0.6 : 1,
                }}
              >
                {t.title}
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: t.completed ? (isMorning ? MOOD_PURPLE : '#7c3aed') : 'transparent',
                  border: t.completed
                    ? 'none'
                    : `2px solid ${isMorning ? 'rgba(180,120,80,0.3)' : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {t.completed && '✓'}
              </div>
            </button>
          );
        })}
        {tasks.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              color: isMorning ? INK_MUTE : 'rgba(255,255,255,0.35)',
              fontSize: 13,
            }}
          >
            No tasks yet — ask a parent to add some! 🌟
          </div>
        )}
      </div>
    </div>
  );
};
