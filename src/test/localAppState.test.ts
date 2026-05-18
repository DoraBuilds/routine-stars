import { describe, expect, it, vi } from 'vitest';

describe('local app state storage', () => {
  it('falls back to in-memory storage when localStorage rejects writes (iOS Safari private mode)', async () => {
    // Simulate environments where localStorage exists but throws on writes.
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const removeItemSpy = vi.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const { saveLocalAppState, loadLocalAppState, clearLocalAppState } = await import('@/lib/storage/local-app-state');

    expect(() =>
      saveLocalAppState({
        children: [],
        homeScene: 'bike',
        lastReset: 'today',
        setupComplete: false,
      })
    ).not.toThrow();

    // The module should still be able to read what it wrote (from memory fallback).
    expect(loadLocalAppState()).toEqual({
      version: 1,
      children: [],
      homeScene: 'bike',
      lastReset: 'today',
      setupComplete: false,
    });

    expect(() => clearLocalAppState()).not.toThrow();

    // Restore to avoid leaking mocks into other tests.
    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });
});
