import { useState } from 'react';
import { AdminBar } from './AdminBar';
import { getMascot, MASCOTS, BADGE_CATALOG } from '@/lib/mascots';
import type { Child } from '@/lib/types';

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

interface AdminKidProfileProps {
  kid: Child;
  onBack: () => void;
  onPickSection: (section: string) => void;
  onChangeMascot: (kidId: string, mascotId: string) => void;
}

export const AdminKidProfile = ({
  kid,
  onBack,
  onPickSection,
  onChangeMascot,
}: AdminKidProfileProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const m = getMascot(kid.mascotId ?? kid.avatarAnimal);
  const badges = kid.badges ?? {};
  const earnedBadges = Object.values(badges).filter(Boolean).length;

  const sections = [
    {
      id: 'routines',
      icon: '✅',
      label: 'Routines',
      desc: `${kid.morning.length} morning · ${kid.evening.length} evening tasks`,
      tint: '#f97316',
    },
    {
      id: 'affirmations',
      icon: '💫',
      label: 'Affirmations',
      desc: `${(kid.affirmations ?? []).length} saved affirmations`,
      tint: '#ec4899',
    },
    {
      id: 'achievements',
      icon: '🏆',
      label: 'Awards',
      desc: `${earnedBadges} of ${BADGE_CATALOG.length} badges earned`,
      tint: '#f59e0b',
    },
    {
      id: 'mood',
      icon: '💗',
      label: 'Mood',
      desc: 'Daily emoji check-in enabled',
      tint: '#a855f7',
    },
  ];

  return (
    <div
      style={{
        height: '100%',
        background: '#fff9f0',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: INK,
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <AdminBar sub="Parent settings" title={`${kid.name}'s setup`} onBack={onBack} />

      {/* Profile card */}
      <div style={{ padding: '12px 14px 0' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 22,
            padding: 16,
            boxShadow: '0 4px 12px rgba(180,120,80,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setShowPicker(true)}
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${m.light}, ${m.color}33)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 38,
                border: `2.5px solid ${m.color}44`,
                position: 'relative',
                cursor: 'pointer',
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {m.emoji}
              <div
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  background: '#fff',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  border: '1.5px solid rgba(180,120,80,0.15)',
                }}
              >
                ✎
              </div>
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{kid.name}</div>
              <div style={{ fontSize: 14, color: INK_MUTE }}>
                {kid.age ? `age ${kid.age} · ` : ''}with {m.name}
              </div>
              <button
                onClick={() => setShowPicker(true)}
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#f97316',
                  background: '#f9731615',
                  border: 'none',
                  borderRadius: 10,
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Change mascot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ padding: '14px 14px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onPickSection(s.id)}
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              border: '1.5px solid rgba(180,120,80,0.05)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'inherit',
              textAlign: 'left',
              boxShadow: '0 2px 8px rgba(180,120,80,0.04)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `${s.tint}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 14, color: INK_MUTE, marginTop: 2 }}>{s.desc}</div>
            </div>
            <div style={{ fontSize: 20, color: INK_MUTE }}>›</div>
          </button>
        ))}
      </div>

      {/* Mascot picker bottom sheet */}
      {showPicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15,23,42,0.4)',
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setShowPicker(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '24px 24px 0 0',
              padding: '20px 18px 32px',
              width: '100%',
              maxWidth: 480,
              margin: '0 auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 36,
                height: 4,
                background: 'rgba(0,0,0,0.15)',
                borderRadius: 99,
                margin: '0 auto 16px',
              }}
            />
            <div style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
              Pick {kid.name}'s mascot
            </div>
            <div style={{ fontSize: 14, color: INK_MUTE, textAlign: 'center', marginBottom: 20 }}>
              They'll see this everywhere ✨
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
              {MASCOTS.map((opt) => {
                const selected = opt.id === (kid.mascotId ?? kid.avatarAnimal);
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onChangeMascot(kid.id, opt.id);
                      setShowPicker(false);
                    }}
                    style={{
                      background: selected ? opt.light : '#fff9f0',
                      borderRadius: 14,
                      padding: '10px 4px',
                      border: selected ? `2.5px solid ${opt.color}` : '2px solid transparent',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'center',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <div style={{ fontSize: 28 }}>{opt.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: INK, marginTop: 3 }}>
                      {opt.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
