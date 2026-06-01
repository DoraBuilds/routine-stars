interface ImportFamilySetupScreenProps {
  onImport: () => void;
  onStartFresh: () => void;
  isImporting: boolean;
  error?: string | null;
}

const T = {
  fonts: `'Fredoka', system-ui, sans-serif`,
  ink: '#3d2c1f',
  inkMute: '#8a7866',
  cream: '#fff9f0',
  white: '#ffffff',
  border: 'rgba(180,120,80,0.10)',
  orange: '#f97316',
  orangeLight: '#fff1e8',
  shadow: '0 6px 20px rgba(180,120,80,0.10)',
};

export const ImportFamilySetupScreen = ({
  onImport,
  onStartFresh,
  isImporting,
  error,
}: ImportFamilySetupScreenProps) => (
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
    <div style={{ position: 'fixed', top: -80, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(249,115,22,0.10)', filter: 'blur(60px)', pointerEvents: 'none' }} />
    <div style={{ position: 'fixed', bottom: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(34,197,94,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />

    <div style={{ position: 'relative', maxWidth: 680, width: '100%' }}>
      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.orangeLight, borderRadius: 99, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: T.orange, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>
        ☁️ Bring your family setup
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.2, margin: '0 0 12px' }}>
        We found routines already saved on this device
      </h1>
      <p style={{ fontSize: 14, color: T.inkMute, marginBottom: 24, lineHeight: 1.6 }}>
        You can import this family setup into your parent account, or start fresh for this household instead.
      </p>

      {/* Option cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ background: T.orangeLight, borderRadius: 22, padding: '18px 16px', border: `2px solid ${T.orange}22` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.orange, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>⭐ Recommended</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Import this family setup</div>
          <div style={{ fontSize: 12, color: T.inkMute, lineHeight: 1.6 }}>
            Keep the children, routines, schedules, and home scene already saved on this device.
          </div>
        </div>
        <div style={{ background: T.white, borderRadius: 22, padding: '18px 16px', border: `1.5px solid ${T.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.inkMute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Alternative</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Start fresh instead</div>
          <div style={{ fontSize: 12, color: T.inkMute, lineHeight: 1.6 }}>
            Leave this device's old setup behind and create a brand-new household in your account.
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={{ background: T.white, borderRadius: 18, padding: '14px 16px', border: `1.5px solid ${T.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>✨ What gets imported</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['Children, schedules, and routines move into your account.', 'Daily completion progress is not merged into the cloud yet.', 'This device keeps working for kids after setup is ready.'].map((note, i) => (
            <div key={i} style={{ fontSize: 12, color: T.inkMute, display: 'flex', gap: 8 }}>
              <span style={{ color: T.orange, fontWeight: 700 }}>{i + 1}.</span> {note}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff5f5', borderRadius: 14, padding: '10px 14px', border: '1.5px solid rgba(220,38,38,0.2)', fontSize: 12, color: '#dc2626', marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={onImport}
          disabled={isImporting}
          style={{
            background: isImporting ? '#fdba74' : T.orange,
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 700,
            cursor: isImporting ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 3px 0 rgba(194,65,12,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isImporting ? '🔄 Importing…' : '☁️ Import this family setup'}
        </button>
        <button
          onClick={onStartFresh}
          disabled={isImporting}
          style={{
            background: T.white,
            color: T.ink,
            border: `1.5px solid ${T.border}`,
            borderRadius: 16,
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 700,
            cursor: isImporting ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Start fresh instead →
        </button>
      </div>
    </div>
  </div>
);
