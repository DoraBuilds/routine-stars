import type { AgeBucket, IconKey } from './task-catalog';
import { AGE_BUCKETS, DEFAULT_CHILDREN, groupTasksByAge, ICON_OPTIONS, TASK_CATALOG, TASK_CATALOG_BY_ID, TASK_LIBRARY } from './task-catalog';

export type Task = {
  id: string;
  title: string;
  icon: IconKey;
  completed: boolean;
};

export type RoutineType = 'morning' | 'evening';
export type HomeScene = 'bike' | 'school' | 'kite' | 'sandcastle';

export type RoutineSchedule = {
  start: string;
  end: string;
};

export type Child = {
  id: string;
  name: string;
  age?: number;
  ageBucket?: AgeBucket;
  avatarSeed?: string;
  avatarAnimal?: string;
  schedule?: Record<RoutineType, RoutineSchedule>;
  morning: Task[];
  evening: Task[];
};

export type AppView = 'account' | 'setup' | 'home' | 'routine' | 'parent';

export { AGE_BUCKETS, DEFAULT_CHILDREN, groupTasksByAge, ICON_OPTIONS, TASK_CATALOG, TASK_CATALOG_BY_ID, TASK_LIBRARY };
