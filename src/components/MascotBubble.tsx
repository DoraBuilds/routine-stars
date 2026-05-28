import { getMascot } from '@/lib/mascots';

interface MascotBubbleProps {
  mascotId: string | undefined;
  size?: number;
  showStreak?: boolean;
  streak?: number;
  className?: string;
}

export const MascotBubble = ({ mascotId, size = 56, showStreak = false, streak = 0 }: MascotBubbleProps) => {
  const m = getMascot(mascotId);
  const fontSize = Math.round(size * 0.54);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${m.light}, ${m.color}33)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        border: `2.5px solid ${m.color}44`,
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {m.emoji}
      {showStreak && streak > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: -3,
            right: -5,
            background: '#fff',
            borderRadius: 99,
            padding: '1px 6px',
            fontSize: 9,
            fontWeight: 700,
            color: '#f97316',
            border: '1.5px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            whiteSpace: 'nowrap',
          }}
        >
          🔥 {streak}
        </div>
      )}
    </div>
  );
};
