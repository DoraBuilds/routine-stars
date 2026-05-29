interface ExistingFamilyRecoveryScreenProps {
  onStartFresh: () => void;
  onSignOut: () => void;
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
  amber: '#f59e0b',
  amberLight: '#fef3c7',
};

export const ExistingFamilyRecoveryScreen = ({
  onStartFresh,
  onSignOut,
}: ExistingFamilyRecoveryScreenProps) => (
  <div
    style={{
      minHeight: '100svh',
      background: T.cream,
      fontFamily: T.fonts,
      color: T.ink,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Blobs */}
    <div style={{ position: 'fixed', top: -80, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(251,191,36,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />
    <div style={{ position: 'fixed', bottom: -60, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(249,115,22,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />

    <div style={{ position: 'relative', maxWidth: 680, width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Safety banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f0fdf4', borderRadius: 18, padding: '12px 16px', border: '1.5px solid rgba(34,197,94,0.2)' }}>
        <span style={{ fontSize: 24 }}>🛡️</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your data is safe</div>
          <div style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>
            Your kids and routines are not lost — they just need to be imported from the browser where they were first created.
          </div>
        </div>
      </div>

      {/* Main card */}
      <div style={{ background: T.white, borderRadius: 26, padding: '22px 20px', border: `1.5px solid ${T.border}`, boxShadow: '0 6px 20px rgba(180,120,80,0.08)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.amberLight, borderRadius: 99, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#92400e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
          🔍 Looking for your family?
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, margin: '0 0 12px' }}>
          This browser looks brand new
        </h1>
        <p style={{ fontSize: 14, color: T.inkMute, marginBottom: 22, lineHeight: 1.6 }}>
          You're signed in, but we didn't find any saved family routines here yet. If your kids and routines were created in a different browser, the routines can only be imported from that original place.
        </p>

        {/* Option cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginBottom: 20 }}>
          <div style={{ background: '#eff6ff', borderRadius: 18, padding: '14px 14px', border: '1.5px solid rgba(59,130,246,0.15)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#1d4ed8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>⏰ Safest next step</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Go back to the original browser once</div>
            <div style={{ fontSize: 12, color: T.inkMute, lineHeight: 1.6 }}>
              Open the browser where routines were first created, sign in there, then import that family into your account.
            </div>
          </div>
          <div style={{ background: T.cream, borderRadius: 18, padding: '14px 14px', border: `1.5px solid ${T.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.inkMute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>→ Only if intentional</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Start a brand-new family here</div>
            <div style={{ fontSize: 12, color: T.inkMute, lineHeight: 1.6 }}>
              Choose this only if you want a clean household and you're not trying to recover existing kids and routines.
            </div>
          </div>
        </div>

        {/* Why this happens */}
        <div style={{ background: T.cream, borderRadius: 16, padding: '12px 14px', border: `1.5px solid ${T.border}`, marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Why this happens</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Older routines may still live only in the browser where they were originally created.',
              'Signing in on a different browser context can look like an empty family account.',
              'Once the original setup is imported, new devices can load it from the cloud.',
            ].map((note, i) => (
              <div key={i} style={{ fontSize: 12, color: T.inkMute, display: 'flex', gap: 8 }}>
                <span style={{ color: T.orange, fontWeight: 700 }}>{i + 1}.</span> {note}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={onStartFresh}
            style={{
              background: T.orange,
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '12px 22px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 3px 0 rgba(194,65,12,0.35)',
            }}
          >
            Start fresh on this device →
          </button>
          <button
            onClick={onSignOut}
            style={{
              background: T.white,
              color: T.ink,
              border: `1.5px solid ${T.border}`,
              borderRadius: 16,
              padding: '12px 20px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Sign out here
          </button>
        </div>
      </div>
    </div>
  </div>
);
