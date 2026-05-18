import type { Child, HomeScene } from '@/lib/types';
import { getSafeStorage } from './safe-storage';

export const LOCAL_APP_STATE_STORAGE_KEY = 'routine_stars_data';
export const CURRENT_LOCAL_APP_STATE_VERSION = 1;

export interface LocalAppState {
  version: number;
  children: Child[];
  homeScene: HomeScene;
  lastReset: string;
  setupComplete: boolean;
}

type LegacyLocalAppState = Partial<Omit<LocalAppState, 'version'>> & {
  children?: Child[];
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeLocalAppState = (value: unknown): LocalAppState | null => {
  if (!isObject(value) || !Array.isArray(value.children)) {
    return null;
  }

  const legacy = value as LegacyLocalAppState;

  return {
    version:
      typeof value.version === 'number' && Number.isFinite(value.version)
        ? value.version
        : CURRENT_LOCAL_APP_STATE_VERSION,
    children: legacy.children,
    homeScene: legacy.homeScene ?? 'bike',
    lastReset: legacy.lastReset ?? new Date().toDateString(),
    setupComplete: legacy.setupComplete ?? true,
  };
};

export const loadLocalAppState = (): LocalAppState | null => {
  const storage = getSafeStorage('__routine_stars_local_app_state_test__');
  const saved = storage.getItem(LOCAL_APP_STATE_STORAGE_KEY);
  if (!saved) return null;

  try {
    return normalizeLocalAppState(JSON.parse(saved));
  } catch {
    return null;
  }
};

export const saveLocalAppState = (state: Omit<LocalAppState, 'version'>) => {
  const payload: LocalAppState = {
    version: CURRENT_LOCAL_APP_STATE_VERSION,
    ...state,
  };

  const storage = getSafeStorage('__routine_stars_local_app_state_test__');
  storage.setItem(LOCAL_APP_STATE_STORAGE_KEY, JSON.stringify(payload));
};

export const clearLocalAppState = () => {
  const storage = getSafeStorage('__routine_stars_local_app_state_test__');
  storage.removeItem(LOCAL_APP_STATE_STORAGE_KEY);
};
