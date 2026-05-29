interface HouseholdLoadErrorScreenProps {
  error: string;
  onRetry: () => void;
}

const T = {
  fonts: `'Fredoka', system-ui, sans-serif`,
  ink: '#3d2c1f',
  inkMute: '#8a7866',
  cream: '#fff9f0',
  white: '#ffffff',
  border: 'rgba(180,120,80,0.10)',
  orange: '#f97316',
};

export const HouseholdLoadErrorScreen = ({ error, onRetry }: HouseholdLoadErrorScreenProps) => (
  <div
    style={{
      minHeight: '100svh',
      background: T.cream,
      fontFamily: T.fonts,
      color: T.ink,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Blobs */}
    <div style={{ position: 'fixed', top: -80, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(251,191,36,0.1)', filter: 'blur(60px)', pointerEvents: 'none' }} />
    <div style={{ position: 'fixed', bottom: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(239,68,68,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />

    <div style={{ position: 'relative', maxWidth: 600, width: '100%' }}>
      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef3c7', borderRadius: 99, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#92400e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>
        ⚠️ Household sync paused
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, margin: '0 0 12px' }}>
        We could not load this family account yet
      </h1>
      <p style={{ fontSize: 14, color: T.inkMute, marginBottom: 22, lineHeight: 1.6 }}>
        This device is signed in, but we could not confirm the household from the cloud right now. We're pausing here so we don't accidentally treat the account like a brand-new family.
      </p>

      {/* Error detail */}
      <div style={{ background: '#fff5f5', borderRadius: 18, padding: '14px 16px', border: '1.5px solid rgba(220,38,38,0.15)', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>🛡️ Why we paused</div>
        <div style={{ fontSize: 12, color: '#dc2626', lineHeight: 1.6 }}>{error}</div>
      </div>

      {/* What to do */}
      <div style={{ background: T.white, borderRadius: 18, padding: '14px 16px', border: `1.5px solid ${T.border}`, marginBottom: 22 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'We did not open a fresh setup flow because that could overwrite the wrong family data.',
            'Retry once the connection or family sync service is available again.',
          ].map((note, i) => (
            <div key={i} style={{ fontSize: 12, color: T.inkMute, display: 'flex', gap: 8 }}>
              <span style={{ color: T.orange, fontWeight: 700 }}>{i + 1}.</span> {note}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRetry}
        style={{
          background: T.orange,
          color: '#fff',
          border: 'none',
          borderRadius: 16,
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 3px 0 rgba(194,65,12,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        🔄 Retry loading the household
      </button>
    </div>
  </div>
);
