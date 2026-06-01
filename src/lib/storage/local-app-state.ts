import type { Child, HomeScene } from '@/lib/types';

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

const normalizeTask = (raw: unknown) => {
  if (!isObject(raw)) return null;
  if (typeof raw.id !== 'string' || !raw.id) return null;
  if (typeof raw.title !== 'string' || !raw.title) return null;
  return {
    id: raw.id,
    title: raw.title,
    icon: typeof raw.icon === 'string' ? raw.icon : 'smile',
    completed: raw.completed === true,
  };
};

const normalizeChild = (raw: unknown) => {
  if (!isObject(raw)) return null;
  if (typeof raw.id !== 'string' || !raw.id) return null;
  if (typeof raw.name !== 'string' || !raw.name) return null;

  const morning = Array.isArray(raw.morning)
    ? raw.morning.map(normalizeTask).filter(Boolean)
    : [];
  const evening = Array.isArray(raw.evening)
    ? raw.evening.map(normalizeTask).filter(Boolean)
    : [];

  return {
    ...raw,
    id: raw.id,
    name: raw.name,
    morning,
    evening,
  };
};

const normalizeLocalAppState = (value: unknown): LocalAppState | null => {
  if (!isObject(value) || !Array.isArray(value.children)) {
    return null;
  }

  const legacy = value as LegacyLocalAppState;
  const children = legacy.children
    ?.map(normalizeChild)
    .filter(Boolean) ?? [];

  return {
    version:
      typeof value.version === 'number' && Number.isFinite(value.version)
        ? value.version
        : CURRENT_LOCAL_APP_STATE_VERSION,
    children: children as LocalAppState['children'],
    homeScene: legacy.homeScene ?? 'bike',
    lastReset: legacy.lastReset ?? new Date().toDateString(),
    setupComplete: legacy.setupComplete ?? true,
  };
};

export const loadLocalAppState = (): LocalAppState | null => {
  const saved = localStorage.getItem(LOCAL_APP_STATE_STORAGE_KEY);
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

  localStorage.setItem(LOCAL_APP_STATE_STORAGE_KEY, JSON.stringify(payload));
};

export const clearLocalAppState = () => {
  localStorage.removeItem(LOCAL_APP_STATE_STORAGE_KEY);
};
