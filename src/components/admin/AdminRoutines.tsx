import { useState } from 'react';
import { AdminBar } from './AdminBar';
import type { Child, RoutineType } from '@/lib/types';

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

interface AdminRoutinesProps {
  kid: Child;
  onBack: () => void;
  onAddTask: (kidId: string, routine: RoutineType) => void;
  onRemoveTask: (kidId: string, routine: RoutineType, taskId: string) => void;
}

export const AdminRoutines = ({
  kid,
  onBack,
  onAddTask,
  onRemoveTask,
}: AdminRoutinesProps) => {
  const [tab, setTab] = useState<RoutineType>('morning');
  const tasks = tab === 'morning' ? kid.morning : kid.evening;

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
      <AdminBar sub={`${kid.name}'s setup`} title="Routines" onBack={onBack} />

      {/* Morning / Evening toggle */}
      <div style={{ padding: '12px 14px 6px' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 4,
            display: 'flex',
            gap: 4,
            border: '1.5px solid rgba(180,120,80,0.08)',
          }}
        >
          {[
            {
              id: 'morning' as const,
              label: '☀️ Morning',
              bg: 'linear-gradient(135deg,#fed7aa,#fdba74)',
              tx: '#7c2d12',
            },
            {
              id: 'evening' as const,
              label: '🌙 Evening',
              bg: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
              tx: '#fff',
            },
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => setTab(o.id)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                background: tab === o.id ? o.bg : 'transparent',
                color: tab === o.id ? o.tx : INK_MUTE,
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks header */}
      <div
        style={{
          padding: '8px 18px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: INK_MUTE,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Tasks ({tasks.length})
        </div>
        <button
          onClick={() => onAddTask(kid.id, tab)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            color: '#f97316',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          + Add task
        </button>
      </div>

      {/* Tasks list */}
      <div style={{ padding: '0 14px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {tasks.map((t) => (
          <div
            key={t.id}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1.5px solid rgba(180,120,80,0.05)',
            }}
          >
            <div style={{ fontSize: 16, color: INK_MUTE, cursor: 'grab' }}>≡</div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#fff9f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              {t.icon}
            </div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{t.title}</div>
            <button
              onClick={() => onRemoveTask(kid.id, tab, t.id)}
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
        {tasks.length === 0 && (
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
            No tasks yet. Tap "+ Add task" to start.
          </div>
        )}
      </div>
    </div>
  );
};
