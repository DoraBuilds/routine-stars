type BannerPalette = 'morning' | 'evening' | 'pink' | 'amber' | 'purple';

interface PainterlyBannerProps {
  label: string;
  title: string;
  palette?: BannerPalette;
}

const PALETTES: Record<BannerPalette, { bg: string; sub: string; main: string; deco1: string; deco2: string }> = {
  morning: { bg: 'linear-gradient(135deg,#fed7aa,#fbcfe8,#ddd6fe)', sub: '#9a3412', main: '#7c2d12', deco1: '☀️', deco2: '🌈' },
  evening: { bg: 'linear-gradient(135deg,#312e81,#7c3aed,#a78bfa)', sub: '#fde68a', main: '#fff',    deco1: '🌙', deco2: '✨' },
  pink:    { bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8,#fda4af)', sub: '#9d174d', main: '#831843', deco1: '✿',  deco2: '💫' },
  amber:   { bg: 'linear-gradient(135deg,#fef3c7,#fed7aa,#fdba74)', sub: '#9a3412', main: '#7c2d12', deco1: '🏆', deco2: '⭐' },
  purple:  { bg: 'linear-gradient(135deg,#e9defc,#ddd6fe,#c4b5fd)', sub: '#5b21b6', main: '#4c1d95', deco1: '💗', deco2: '🌸' },
};

export const PainterlyBanner = ({ label, title, palette = 'morning' }: PainterlyBannerProps) => {
  const p = PALETTES[palette];
  return (
    <div
      style={{
        position: 'relative',
        margin: '8px 14px 12px',
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(180,120,80,0.08)',
      }}
    >
      <div style={{ background: p.bg, padding: '22px 20px', position: 'relative', minHeight: 110 }}>
        <div style={{ position: 'absolute', left: 12, top: 10, fontSize: 36, opacity: 0.85 }}>{p.deco1}</div>
        <div style={{ position: 'absolute', right: 14, bottom: 10, fontSize: 26, opacity: 0.7 }}>{p.deco2}</div>
        <div style={{ position: 'absolute', left: 110, top: 18, fontSize: 14, color: p.sub, opacity: 0.6 }}>✦</div>
        <div style={{ position: 'absolute', right: 60, top: 36, fontSize: 11, color: p.sub, opacity: 0.5 }}>✦</div>
        <div style={{ textAlign: 'center', position: 'relative', marginTop: 4 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: p.sub,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: p.main,
              marginTop: 4,
              fontStyle: 'italic',
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </div>
  );
};
