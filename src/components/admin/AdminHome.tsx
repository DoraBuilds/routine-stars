import { AdminBar } from './AdminBar';
import { getMascot, BADGE_CATALOG } from '@/lib/mascots';
import type { Child } from '@/lib/types';

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';

interface AdminHomeProps {
  kids: Child[];
  onBack: () => void;
  onPickKid: (kidId: string, section: string) => void;
  onAddKid: () => void;
  cloudSyncStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onSignOut?: () => void;
  onOpenAdvancedSettings?: () => void;
  onRestartSetup?: () => void;
  onResetAppData?: () => void;
}

export const AdminHome = ({
  kids,
  onBack,
  onPickKid,
  onAddKid,
  cloudSyncStatus,
  onSignOut,
  onOpenAdvancedSettings,
  onRestartSetup,
  onResetAppData,
}: AdminHomeProps) => (
  <div
    style={{
      height: '100%',
      background: '#fff9f0',
      fontFamily: "'Fredoka', system-ui, sans-serif",
      color: INK,
      overflowY: 'auto',
    }}
  >
    <AdminBar
      sub="Parent settings"
      title="Your family"
      onBack={onBack}
      right={
        <button
          onClick={onAddKid}
          style={{
            background: '#f97316',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '7px 14px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 3px 0 rgba(194,65,12,0.4)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          + Add
        </button>
      }
    />

    <div
      style={{
        padding: '12px 14px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {kids.map((k) => {
        const m = getMascot(k.mascotId ?? k.avatarAnimal);
        const streak = k.streak ?? 0;
        const badges = k.badges ?? {};
        const earnedBadges = Object.values(badges).filter(Boolean).length;

        const sections = [
          {
            id: 'routines',
            label: 'Routines',
            icon: '✅',
            meta: `${k.morning.length} morn · ${k.evening.length} eve`,
          },
          {
            id: 'affirmations',
            label: 'Affirmations',
            icon: '💫',
            meta: `${(k.affirmations ?? []).length} saved`,
          },
          {
            id: 'achievements',
            label: 'Awards',
            icon: '🏆',
            meta: `${earnedBadges} of ${BADGE_CATALOG.length} badges`,
          },
          { id: 'mood', label: 'Mood', icon: '💗', meta: 'Daily check-in' },
        ];

        return (
          <div
            key={k.id}
            style={{
              background: '#fff',
              borderRadius: 22,
              padding: 14,
              boxShadow: '0 4px 12px rgba(180,120,80,0.06)',
              border: '1.5px solid rgba(180,120,80,0.04)',
            }}
          >
            {/* Kid header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${m.light}, ${m.color}33)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                {m.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  {k.name}{k.age ? `, age ${k.age}` : ''}
                </div>
                <div style={{ fontSize: 11, color: INK_MUTE }}>
                  with {m.name}{streak > 0 ? ` · ${streak} day streak` : ''}
                </div>
              </div>
              <button
                onClick={() => onPickKid(k.id, 'profile')}
                style={{
                  fontSize: 18,
                  color: INK_MUTE,
                  padding: 4,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ···
              </button>
            </div>

            {/* Section pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onPickKid(k.id, s.id)}
                  style={{
                    background: '#fff9f0',
                    borderRadius: 12,
                    padding: '9px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    border: '1px solid rgba(180,120,80,0.06)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    color: 'inherit',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{ fontSize: 16 }}>{s.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{s.label}</div>
                    <div
                      style={{
                        fontSize: 9,
                        color: INK_MUTE,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {s.meta}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: INK_MUTE }}>›</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Account footer */}
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          border: '1.5px solid rgba(180,120,80,0.04)',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: INK_MUTE, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Account
        </div>
        {cloudSyncStatus && cloudSyncStatus !== 'idle' && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: cloudSyncStatus === 'saved' ? '#16a34a' : cloudSyncStatus === 'error' ? '#dc2626' : '#2563eb',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {cloudSyncStatus === 'saved' ? '✓' : cloudSyncStatus === 'error' ? '⚠' : '↻'}{' '}
            {cloudSyncStatus === 'saved' ? 'Family data synced' : cloudSyncStatus === 'error' ? 'Sync error — check connection' : 'Saving…'}
          </div>
        )}
        {onOpenAdvancedSettings && (
          <button
            onClick={onOpenAdvancedSettings}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 500,
              color: INK,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: 16 }}>⚙️</span> Advanced settings
            <span style={{ marginLeft: 'auto', fontSize: 14, color: INK_MUTE }}>›</span>
          </button>
        )}
        {onRestartSetup && (
          <button
            onClick={onRestartSetup}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 500,
              color: INK_MUTE,
              width: '100%',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Restart setup wizard
          </button>
        )}
        {onResetAppData && (
          <button
            onClick={onResetAppData}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              textAlign: 'left',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 500,
              color: '#dc2626',
              width: '100%',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Delete all data &amp; start over
          </button>
        )}
        {onSignOut && (
          <button
            onClick={onSignOut}
            style={{
              background: '#fff9f0',
              border: '1px solid rgba(180,120,80,0.1)',
              borderRadius: 10,
              cursor: 'pointer',
              padding: '8px 14px',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 700,
              color: '#dc2626',
              width: '100%',
              textAlign: 'center',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  </div>
);
