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
          <div style={{ fontSize: 28 }}>💫</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#831843' }}>Daily affirmations</div>
            <div style={{ fontSize: 13, color: '#be185d', marginTop: 2, lineHeight: 1.5 }}>
              By default, {kid.name} sees affirmations from our built-in library.
              Add your own below and <em>only yours</em> will be shown — perfect
              if you have specific phrases you'd love {kid.name} to repeat every day.
            </div>
          </div>
        </div>
      </div>

      {/* Add input */}
      <div style={{ padding: '12px 14px 0' }}>
        <div
          style={{
            fontSize: 13,
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
              fontSize: 15,
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
              padding: '7px 14px',
              fontSize: 13,
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
            fontSize: 13,
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
                padding: '11px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 18 }}>{FAVE_ICONS[i % FAVE_ICONS.length]}</div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 500, fontStyle: 'italic' }}>
                "{aff}"
              </div>
              <button
                onClick={() => onRemove(kid.id, i)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
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
                padding: '24px 14px',
                color: INK_MUTE,
                fontSize: 14,
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
