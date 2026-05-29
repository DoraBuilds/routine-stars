import { useRef, useState } from 'react';
import { MascotBubble } from './MascotBubble';
import { MorningBackdrop } from './MorningBackdrop';
import { NightBackdrop } from './NightBackdrop';
import { getMascot } from '@/lib/mascots';
import type { Child } from '@/lib/types';

interface KidHomeProps {
  kids: Child[];
  theme: 'morning' | 'evening';
  onPick: (id: string) => void;
  onParent: () => void;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

export const KidHome = ({ kids, theme, onPick, onParent }: KidHomeProps) => {
  const isMorning = theme === 'morning';
  const [holdPct, setHoldPct] = useState(0);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    const start = performance.now();
    progRef.current = setInterval(() => {
      const p = Math.min(100, ((performance.now() - start) / 1500) * 100);
      setHoldPct(p);
    }, 16);
    holdRef.current = setTimeout(() => {
      if (progRef.current) clearInterval(progRef.current);
      setHoldPct(0);
      onParent();
    }, 1500);
  };

  const cancelHold = () => {
    if (holdRef.current) clearTimeout(holdRef.current);
    if (progRef.current) clearInterval(progRef.current);
    setHoldPct(0);
  };

  const greeting = isMorning ? 'Good morning,' : 'Good evening,';
  const tagline = isMorning ? 'little stars!' : 'little dreamers';
  const sub = isMorning ? "Who's ready to shine?" : 'Time to wind down';

  return (
    <div
      style={{
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: isMorning ? INK : '#fff',
      }}
    >
      {isMorning ? <MorningBackdrop /> : <NightBackdrop />}

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px 18px 16px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 18, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: isMorning ? '#d97706' : '#fde68a',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            {isMorning ? '☀️' : '🌙'}{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}{' '}
            {isMorning ? 'morning' : 'evening'}
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 4, lineHeight: 1.15 }}>
            {greeting}
            <br />
            {tagline}
          </div>
          <div
            style={{
              fontSize: 13,
              color: isMorning ? INK_MUTE : 'rgba(255,255,255,0.7)',
              marginTop: 4,
            }}
          >
            {sub}
          </div>
        </div>

        {/* Kid cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {kids.map((k) => {
            const m = getMascot(k.mascotId ?? k.avatarAnimal);
            const tasks = isMorning ? k.morning : k.evening;
            const done = tasks.filter((t) => t.completed).length;
            const total = tasks.length;
            const pct = total ? (done / total) * 100 : 0;
            const streak = k.streak ?? 0;

            return (
              <button
                key={k.id}
                onClick={() => onPick(k.id)}
                style={{
                  background: isMorning
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 24,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: isMorning
                    ? '0 6px 16px rgba(180,120,80,0.1)'
                    : '0 6px 20px rgba(0,0,0,0.25)',
                  border:
                    '1.5px solid ' +
                    (isMorning ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)'),
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  textAlign: 'left',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.15s',
                  flexShrink: 0,
                }}
              >
                <MascotBubble
                  mascotId={k.mascotId ?? k.avatarAnimal}
                  size={56}
                  showStreak
                  streak={streak}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{k.name}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isMorning ? INK_MUTE : 'rgba(255,255,255,0.75)',
                      marginTop: 1,
                    }}
                  >
                    with {m.name} · {done} / {total} done
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{
                      height: 4,
                      background: isMorning
                        ? 'rgba(0,0,0,0.06)'
                        : 'rgba(255,255,255,0.12)',
                      borderRadius: 99,
                      marginTop: 6,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: m.color,
                        borderRadius: 99,
                        transition: 'width 0.5s',
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: m.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    boxShadow: `0 3px 0 ${m.color}66`,
                    flexShrink: 0,
                  }}
                >
                  ›
                </div>
              </button>
            );
          })}
        </div>

        {/* Parent gate */}
        <button
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            margin: '14px auto 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isMorning ? INK_MUTE : 'rgba(255,255,255,0.6)',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 500 }}>⚙️ Hold to open parent settings</span>
          <div
            style={{
              width: 90,
              height: 4,
              borderRadius: 99,
              background: isMorning
                ? 'rgba(180,120,80,0.15)'
                : 'rgba(255,255,255,0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${holdPct}%`,
                background: '#f97316',
                borderRadius: 99,
                transition: 'width 0.06s linear',
              }}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
