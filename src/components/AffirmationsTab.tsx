import { useState } from 'react';
import { PainterlyBanner } from './PainterlyBanner';
import { getMascot } from '@/lib/mascots';
import type { Child } from '@/lib/types';

interface AffirmationsTabProps {
  kid: Child;
  onAddFavourite: (text: string) => void;
  onRemoveFavourite: (text: string) => void;
}

const INK = '#3d2c1f';
const INK_MUTE = '#8a7866';
const PINK = '#ec4899';
const PINK_DARK = '#be185d';

const FAVE_ICONS = ['🌟', '🦁', '💙', '💗', '🌈', '✨'];
const FAVE_COLORS = ['#fef3c7', '#dcfce7', '#dbeafe', '#fce7f3', '#f0fdf4', '#fdf4ff'];

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.82;
  u.pitch = 1.15;
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

// Built-in library shown when no parent-curated affirmations exist yet
const DEFAULT_AFFIRMATIONS = [
  'I am exactly enough.',
  'I am brave and kind.',
  'I can do hard things.',
  'I am loved just as I am.',
  'Today is going to be a great day.',
];

export const AffirmationsTab = ({ kid, onAddFavourite, onRemoveFavourite }: AffirmationsTabProps) => {
  const [idx, setIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const m = getMascot(kid.mascotId ?? kid.avatarAnimal);
  // If parent has added custom affirmations, use those; otherwise show the built-in library
  const list = kid.affirmations?.length ? kid.affirmations : DEFAULT_AFFIRMATIONS;
  const current = idx % list.length;
  const text = list[current];
  // A card is "faved" when it already lives in kid.affirmations
  const isFaved = Boolean(kid.affirmations?.includes(text));
  const favedList = kid.affirmations ?? [];

  const handlePlay = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(text);
    // Reset speaking state when done
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
  };

  const handleFave = () => {
    if (isFaved) onRemoveFavourite(text);
    else onAddFavourite(text);
  };

  const handleNext = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setIdx((i) => i + 1);
  };

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        paddingBottom: 32,
        background: 'linear-gradient(180deg,#fff9f0,#fde7f3)',
        fontFamily: "'Fredoka', system-ui, sans-serif",
        color: INK,
      }}
    >
      <PainterlyBanner
        label={`${m.emoji} ${kid.name}'s`}
        title="Daily Affirmation"
        palette="pink"
      />

      {/* Main card */}
      <div style={{ padding: '4px 18px 0' }}>
        <div
          style={{
            background: 'linear-gradient(160deg,#fce7f3,#ffe4e6)',
            borderRadius: 28,
            padding: '24px 22px',
            textAlign: 'center',
            border: '2px solid rgba(236,72,153,0.15)',
            boxShadow: '0 8px 24px rgba(236,72,153,0.1)',
            position: 'relative',
          }}
        >
          {/* Decorations — corners, no top-right so heart is clear */}
          <div style={{ position: 'absolute', top: 10, left: 14, fontSize: 16, opacity: 0.45 }}>✿</div>
          <div style={{ position: 'absolute', bottom: 10, left: 16, fontSize: 12, opacity: 0.45 }}>✦</div>
          <div style={{ position: 'absolute', bottom: 14, right: 14, fontSize: 16, opacity: 0.45 }}>✿</div>

          {/* Heart favourite button */}
          <button
            onClick={handleFave}
            title={isFaved ? 'Remove from favourites' : 'Save to favourites'}
            style={{
              position: 'absolute',
              top: 10,
              right: 12,
              background: 'none',
              border: 'none',
              fontSize: 24,
              lineHeight: 1,
              cursor: 'pointer',
              color: isFaved ? '#ef4444' : '#3d2c1f',
              transition: 'transform 0.15s, color 0.2s',
              transform: isFaved ? 'scale(1.25)' : 'scale(1)',
              WebkitTapHighlightColor: 'transparent',
              zIndex: 2,
              padding: 4,
            }}
          >
            {isFaved ? '♥' : '♡'}
          </button>

          <div style={{ fontSize: 60, marginBottom: 14 }}>{m.emoji}</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: '#831843',
              lineHeight: 1.35,
              fontStyle: 'italic',
              margin: '0 4px',
            }}
          >
            "{text}"
          </div>
          <div style={{ fontSize: 18, color: PINK_DARK, marginTop: 14, fontWeight: 500 }}>
            {m.name} says: take a deep breath 🌸
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 22 }}>
            {/* Play / Stop button */}
            <button
              onClick={handlePlay}
              style={{
                background: speaking ? PINK_DARK : PINK,
                color: '#fff',
                border: 'none',
                width: 60,
                height: 60,
                borderRadius: '50%',
                fontSize: 24,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: `0 4px 0 ${PINK_DARK}`,
                transition: 'background 0.2s',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {speaking ? '⏹' : '▶'}
            </button>

            {/* Next — only shown when there's more than one affirmation */}
            {list.length > 1 && (
              <button
                onClick={handleNext}
                style={{
                  background: '#fff',
                  color: PINK_DARK,
                  border: 'none',
                  padding: '0 22px',
                  height: 60,
                  borderRadius: 30,
                  fontSize: 20,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 0 rgba(236,72,153,0.2)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                ↻ Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pagination dots — only when multiple affirmations */}
      {list.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); setIdx(i); }}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: i === current ? PINK : 'rgba(236,72,153,0.25)',
                transition: 'width 0.25s',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Favourites list */}
      <div style={{ padding: '20px 18px 0' }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: INK_MUTE,
            marginBottom: 10,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {kid.name}'s favourites
        </div>

        {favedList.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 14px',
              color: 'rgba(236,72,153,0.4)',
              fontSize: 18,
              border: '1.5px dashed rgba(236,72,153,0.2)',
              borderRadius: 18,
            }}
          >
            Tap 🤍 on a card to save a favourite!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {favedList.map((aff, i) => (
              <div
                key={aff}
                style={{
                  background: FAVE_COLORS[i % FAVE_COLORS.length],
                  borderRadius: 18,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 24 }}>{FAVE_ICONS[i % FAVE_ICONS.length]}</div>
                <div style={{ flex: 1, fontSize: 18, fontWeight: 500, fontStyle: 'italic' }}>
                  "{aff}"
                </div>
                <button
                  onClick={() => onRemoveFavourite(aff)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: '#ef4444', padding: 4, WebkitTapHighlightColor: 'transparent', lineHeight: 1 }}
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
