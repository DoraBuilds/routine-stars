export const MorningBackdrop = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg,#fff9f0 0%,#ffe8d6 45%,#ffd9c2 100%)',
      }}
    />
    {/* Sun */}
    <div
      style={{
        position: 'absolute',
        top: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'radial-gradient(circle,#fef3c7 0%,#fbbf24 90%)',
        boxShadow: '0 0 60px rgba(251,191,36,0.45)',
      }}
    />
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 54,
          top: 54,
          width: 3,
          height: 18,
          background: 'rgba(251,191,36,0.5)',
          borderRadius: 2,
          transformOrigin: 'center center',
          transform: `rotate(${i * 45}deg) translateY(-26px)`,
        }}
      />
    ))}
    {/* Clouds */}
    <div style={{ position: 'absolute', top: 64, left: 24, fontSize: 30, opacity: 0.7 }}>☁️</div>
    <div style={{ position: 'absolute', top: 38, left: 110, fontSize: 20, opacity: 0.55 }}>☁️</div>
    <div style={{ position: 'absolute', top: 92, right: 110, fontSize: 22, opacity: 0.6 }}>☁️</div>
    {/* Hills */}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: -30,
        width: 180,
        height: 90,
        borderRadius: '50% 50% 0 0',
        background: '#fdba74',
        opacity: 0.5,
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: -20,
        width: 200,
        height: 100,
        borderRadius: '50% 50% 0 0',
        background: '#fbb583',
        opacity: 0.45,
      }}
    />
  </div>
);
