import type { ReactNode } from 'react';

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

interface AdminBarProps {
  title: string;
  sub?: string;
  onBack: () => void;
  right?: ReactNode;
}

export const AdminBar = ({ title, sub, onBack, right }: AdminBarProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 14px 10px',
      background: '#fff9f0',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderBottom: '1px solid rgba(180,120,80,0.06)',
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
        boxShadow: '0 2px 6px rgba(180,120,80,0.08)',
        fontFamily: 'inherit',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      ‹
    </button>
    <div style={{ flex: 1 }}>
      {sub && (
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: INK_MUTE,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {sub}
        </div>
      )}
      <div style={{ fontSize: 17, fontWeight: 600, color: INK }}>{title}</div>
    </div>
    {right}
  </div>
);
