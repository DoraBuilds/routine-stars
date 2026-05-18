import { describe, expect, it } from 'vitest';
import { normalizeDeepLinkToPath } from '@/lib/capacitor/deeplinks';

describe('normalizeDeepLinkToPath', () => {
  it('keeps universal links as pathname+query+hash', () => {
    expect(normalizeDeepLinkToPath('https://example.com/auth/callback?code=abc#x=1', '/')).toBe(
      '/auth/callback?code=abc#x=1'
    );
  });

  it('strips a Vite base path when present', () => {
    expect(
      normalizeDeepLinkToPath('https://dorabuilds.github.io/routine-stars/auth/callback?code=abc', '/routine-stars/')
    ).toBe('/auth/callback?code=abc');
  });

  it('best-effort parses custom schemes', () => {
    expect(normalizeDeepLinkToPath('routinestars://auth/callback?token_hash=1&type=magiclink', '/')).toBe(
      '/auth/callback?token_hash=1&type=magiclink'
    );
  });
});

