export const NightBackdrop = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)',
      }}
    />
    {/* Stars */}
    {Array.from({ length: 30 }).map((_, i) => {
      const x = (i * 137.5) % 100;
      const y = (i * 73.3) % 70;
      const s = 1 + (i % 3);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: s,
            height: s,
            borderRadius: '50%',
            background: 'rgba(255,255,200,0.85)',
            boxShadow: '0 0 6px rgba(255,255,200,0.6)',
          }}
        />
      );
    })}
    {/* Moon */}
    <div
      style={{
        position: 'absolute',
        top: 28,
        right: 28,
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%,#fef3c7,#fcd34d)',
        boxShadow: '0 0 50px rgba(252,211,77,0.4)',
      }}
    />
    <div style={{ position: 'absolute', top: 96, left: 32, fontSize: 18, color: '#fde68a', opacity: 0.85 }}>✦</div>
    <div style={{ position: 'absolute', top: 64, left: 72, fontSize: 14, color: '#fde68a', opacity: 0.6 }}>✧</div>
    <div style={{ position: 'absolute', top: 130, right: 100, fontSize: 12, color: '#fde68a', opacity: 0.7 }}>✦</div>
    {/* Hills */}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: -30,
        width: 180,
        height: 80,
        borderRadius: '50% 50% 0 0',
        background: '#1e1b4b',
        opacity: 0.7,
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: -20,
        width: 200,
        height: 90,
        borderRadius: '50% 50% 0 0',
        background: '#312e81',
        opacity: 0.6,
      }}
    />
  </div>
);
