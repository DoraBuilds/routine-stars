import React, { useState, useEffect } from 'react';
import { AccountSettingsCard } from './AccountSettingsCard';

const T = {
  fonts: `'Fredoka', system-ui, sans-serif`,
  ink: '#3d2c1f',
  inkMute: '#8a7866',
  cream: '#fff9f0',
  white: '#ffffff',
  border: 'rgba(180,120,80,0.10)',
  orange: '#f97316',
  orangeLight: '#fff1e8',
};

export const AccountEntryScreen = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      style={{
        minHeight: '100svh',
        background: T.cream,
        fontFamily: T.fonts,
        color: T.ink,
        padding: isMobile ? '24px 16px 48px' : '32px 24px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 300, borderRadius: '50%', background: 'rgba(249,115,22,0.08)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -60, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(167,139,250,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div
        style={{
          position: 'relative',
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gap: 20,
          // Mobile: single column, form on top. Desktop: marketing left, form right.
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1.1fr) 420px',
          alignItems: 'start',
        }}
      >
        {/* ── Auth form — shown first on mobile ── */}
        {isMobile && <AccountSettingsCard />}

        {/* ── Marketing copy ── */}
        <section
          style={{
            background: T.white,
            borderRadius: 28,
            padding: isMobile ? '20px 18px' : '28px 26px',
            border: `1.5px solid ${T.border}`,
            boxShadow: '0 6px 20px rgba(180,120,80,0.08)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.orangeLight, borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 700, color: T.orange, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>
            ☁️ Parent Sign In
          </div>

          <h1 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, lineHeight: 1.2, margin: '0 0 12px' }}>
            Bring your family's routines onto this device
          </h1>
          <p style={{ fontSize: 15, color: T.inkMute, lineHeight: 1.65, marginBottom: 20 }}>
            Sign in with your parent email to load the household saved to your account. Routine Stars will restore your children, routines, and progress on this device.
          </p>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginBottom: 18 }}>
            {[
              { emoji: '⚡', title: 'Fast setup', desc: 'Open the account once on a new device and everything is restored automatically.' },
              { emoji: '🌅', title: 'Less daily friction', desc: 'Keep routines, schedules, and child profiles in one place so mornings and evenings are easier to run.' },
              { emoji: '🛡️', title: 'Parent controlled', desc: 'Sign-in is for adults only. Once connected, the shared device goes back to the routine flow.' },
            ].map((card) => (
              <div
                key={card.title}
                style={{ background: T.cream, borderRadius: 18, padding: '14px 14px', border: `1.5px solid ${T.border}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{card.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.title}</span>
                </div>
                <div style={{ fontSize: 13, color: T.inkMute, lineHeight: 1.6 }}>{card.desc}</div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div style={{ background: T.cream, borderRadius: 18, padding: '14px 16px', border: `1.5px solid ${T.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>What to expect</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                "Enter your parent email and we'll send you a secure sign-in link.",
                'After sign-in, this device loads the household saved to your account.',
                "If the account is empty, you can start fresh or recover an existing family from the original device.",
              ].map((step, i) => (
                <div key={i} style={{ fontSize: 13, color: T.inkMute, display: 'flex', gap: 10, lineHeight: 1.5 }}>
                  <span style={{ color: T.orange, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Auth form — shown on the right on desktop ── */}
        {!isMobile && <AccountSettingsCard />}
      </div>
    </div>
  );
};
