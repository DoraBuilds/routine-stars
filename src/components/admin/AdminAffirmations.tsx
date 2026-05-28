import { useState } from 'react';
import { AdminBar } from './AdminBar';
import type { Child } from '@/lib/types';

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

const FAVE_COLORS = ['#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3'];
const FAVE_ICONS = ['🌟', '🦁', '💙', '💗'];

interface AdminAffirmationsProps {
  kid: Child;
  onBack: () => void;
  onAdd: (kidId: string, text: string) => void;
  onRemove: (kidId: string, idx: number) => void;
}

export const AdminAffirmations = ({
  kid,
  onBack,
  onAdd,
  onRemove,
}: AdminAffirmationsProps) => {
  const [draft, setDraft] = useState('');
  const affirmations = kid.affirmations ?? [];

  const handleAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(kid.id, trimmed);
    setDraft('');
  };

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
      <AdminBar sub={`${kid.name}'s setup`} title="Affirmations" onBack={onBack} />

      {/* Daily affirmation banner */}
      <div style={{ padding: '12px 14px 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 26 }}>💫</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#831843' }}>Daily affirmation</div>
            <div style={{ fontSize: 11, color: '#be185d', marginTop: 1 }}>A new one each morning</div>
          </div>
          {/* Toggle (static on) */}
          <div
            style={{
              width: 38,
              height: 22,
              borderRadius: 99,
              background: '#ec4899',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Add input */}
      <div style={{ padding: '12px 14px 0' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: INK_MUTE,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Add new
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '10px 12px',
            border: '1.5px solid rgba(180,120,80,0.05)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder='"I am brave and kind."'
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
            }}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 13,
              color: INK,
              fontStyle: 'italic',
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!draft.trim()}
            style={{
              background: draft.trim() ? '#ec4899' : '#f1f5f9',
              color: draft.trim() ? '#fff' : INK_MUTE,
              border: 'none',
              borderRadius: 10,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              cursor: draft.trim() ? 'pointer' : 'default',
              fontFamily: 'inherit',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Saved list */}
      <div style={{ padding: '14px 14px 24px' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: INK_MUTE,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Saved ({affirmations.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {affirmations.map((aff, i) => (
            <div
              key={i}
              style={{
                background: FAVE_COLORS[i % FAVE_COLORS.length],
                borderRadius: 14,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 16 }}>{FAVE_ICONS[i % FAVE_ICONS.length]}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500, fontStyle: 'italic' }}>
                "{aff}"
              </div>
              <button
                onClick={() => onRemove(kid.id, i)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: INK_MUTE,
                  padding: 4,
                  fontFamily: 'inherit',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                ×
              </button>
            </div>
          ))}
          {affirmations.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '20px 14px',
                color: INK_MUTE,
                fontSize: 12,
                border: '1.5px dashed rgba(180,120,80,0.15)',
                borderRadius: 14,
              }}
            >
              No affirmations yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
