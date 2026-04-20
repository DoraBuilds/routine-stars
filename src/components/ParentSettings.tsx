import { useState } from 'react';
import { Reorder } from 'framer-motion';
import {
  Sun, Moon, Trash2, Plus, GripVertical, UserPlus, ArrowLeft, X, Check, Shuffle, Clock3, Palette, ChevronDown,
  Users, House, Shield, CreditCard, LogOut, UserRound,
} from 'lucide-react';
import { TaskIcon } from './TaskIcon';
import { TaskSuggestionPicker } from './TaskSuggestionPicker';
import { ChildProfileAvatar } from './ChildProfileAvatar';
import { AccountSettingsCard } from './AccountSettingsCard';
import { ANIMAL_AVATARS } from './animal-avatars';
import { useAuth } from '@/lib/auth/use-auth';
import { useBilling } from '@/lib/billing/billing-context';
import type { Child, HomeScene, RoutineType } from '@/lib/types';
import { AGE_BUCKETS, groupTasksByAge, ICON_OPTIONS, TASK_CATALOG } from '@/lib/types';
import type { TaskCatalogItem } from '@/lib/task-catalog';

interface ParentSettingsProps {
  children: Child[];
  homeScene: HomeScene;
  onChange: (children: Child[]) => void;
  onHomeSceneChange: (scene: HomeScene) => void;
  onRestartSetup: () => void;
  onResetAppData: () => void;
  onBack: () => void;
}

const DEFAULT_SCHEDULE = {
  morning: { start: '07:00', end: '09:00' },
  evening: { start: '17:00', end: '20:00' },
} as const;

/* ---- Add / Edit Task Modal ---- */
interface TaskModalProps {
  initial?: { title: string; icon: string };
  routine: RoutineType;
  mode: 'add' | 'edit';
  suggestions: readonly TaskCatalogItem[];
  onSave: (title: string, icon: string) => void;
  onClose: () => void;
}

interface TaskAgeGroupProps {
  group: ReturnType<typeof groupTasksByAge>[number];
  onQuickAdd: (task: TaskCatalogItem) => void;
}

type ParentSection = 'kids' | 'parents' | 'household' | 'admin' | 'billing';
type KidEditorTab = 'profile' | 'routines';

const TaskModal = ({ initial, routine, mode, suggestions, onSave, onClose }: TaskModalProps) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? 'smile');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);

  const handleSelectSuggestion = (suggestion: TaskCatalogItem) => {
    setTitle(suggestion.title);
    setIcon(suggestion.icon);
    setSelectedSuggestionId(suggestion.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card rounded-[32px] p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {mode === 'edit' ? 'Edit Task' : 'New Task'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === 'edit'
                ? 'Tweak the task for this child.'
                : `Start with a ${routine === 'morning' ? 'morning' : 'bedtime'} suggestion or build your own.`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={22} />
          </button>
        </div>

        {mode === 'add' && (
          <TaskSuggestionPicker
            suggestions={suggestions}
            selectedSuggestionId={selectedSuggestionId}
            onSelectSuggestion={handleSelectSuggestion}
          />
        )}

        <label className="block mb-2 text-sm font-semibold text-muted-foreground">Task Name</label>
        <input
          className="w-full px-4 py-3 rounded-xl bg-muted text-foreground text-lg font-medium outline-none focus:ring-2 focus:ring-primary mb-6"
          placeholder="e.g. Brush teeth"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <label className="block mb-2 text-sm font-semibold text-muted-foreground">Icon</label>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {ICON_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setIcon(opt.key)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all text-sm gap-1 ${
                icon === opt.key
                  ? 'bg-primary/15 text-primary ring-2 ring-primary'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <TaskIcon iconKey={opt.key} size={24} strokeWidth={2.5} />
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (title.trim()) onSave(title.trim(), icon);
          }}
          disabled={!title.trim()}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-lg font-bold disabled:opacity-40 shadow-button active:translate-y-0.5 transition-transform flex items-center justify-center gap-2"
        >
          <Check size={20} /> Save
        </button>
      </div>
    </div>
  );
};

/* ---- Routine Column ---- */
interface RoutineColumnProps {
  type: RoutineType;
  tasks: Child['morning'];
  onReorder: (tasks: Child['morning']) => void;
  onDelete: (taskId: string) => void;
  onQuickAdd: (task: TaskCatalogItem) => void;
  onAdd: () => void;
  onEdit: (taskId: string) => void;
}

const RoutineColumn = ({ type, tasks, onReorder, onDelete, onQuickAdd, onAdd, onEdit }: RoutineColumnProps) => {
  const isMorning = type === 'morning';
  const otherTasks = TASK_CATALOG[type].filter(
    (suggestion) => !tasks.some((task) => task.title === suggestion.title)
  );

  const TaskAgeGroup = ({ group, onQuickAdd }: TaskAgeGroupProps) => (
    <details className="rounded-2xl border border-border bg-background/80">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left">
        <div>
          <h6 className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
            {group.label}
          </h6>
          <p className="mt-1 text-xs text-muted-foreground">{group.description}</p>
        </div>
        <ChevronDown size={16} className="text-muted-foreground transition-transform duration-200" />
      </summary>
      <div className="border-t border-border px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {group.tasks.map((task) => (
            <button
              key={`${type}-${task.id}`}
              type="button"
              onClick={() => onQuickAdd(task)}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <TaskIcon iconKey={task.icon} size={16} strokeWidth={2.5} />
              {task.title}
              <Plus size={14} />
            </button>
          ))}
        </div>
      </div>
    </details>
  );

  return (
    <div>
      <h4 className="flex items-center font-bold text-foreground mb-4 text-lg gap-2">
        {isMorning ? (
          <Sun size={18} className="text-primary" />
        ) : (
          <Moon size={18} className="text-indigo-500" />
        )}
        {isMorning ? 'Morning' : 'Evening'}
      </h4>

      <Reorder.Group axis="y" values={tasks} onReorder={onReorder} className="space-y-2">
        {tasks.map((task) => (
          <Reorder.Item key={task.id} value={task} className="flex items-center bg-muted p-3 rounded-xl group cursor-grab active:cursor-grabbing">
            <GripVertical size={16} className="text-muted-foreground/40 mr-2 shrink-0" />
            <TaskIcon iconKey={task.icon} size={18} strokeWidth={2.5} className="text-muted-foreground mr-2 shrink-0" />
            <button
              onClick={() => onEdit(task.id)}
              className="flex-1 text-foreground text-left hover:text-primary transition-colors"
            >
              {task.title}
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 min-w-[28px]"
            >
              <Trash2 size={16} />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {otherTasks.length > 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h5 className="text-sm font-black uppercase tracking-[0.24em] text-muted-foreground">
                Age Buckets
              </h5>
              <p className="mt-1 text-xs text-muted-foreground">
                Expand a bucket to add tasks to this routine.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {groupTasksByAge(otherTasks).map((group) => (
              <TaskAgeGroup
                key={`${type}-${group.key}`}
                group={group}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onAdd}
        className={`mt-3 w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all font-medium ${
          isMorning
            ? 'border-primary/30 text-primary/60 hover:border-primary hover:text-primary'
            : 'border-indigo-300/50 text-indigo-400 hover:border-indigo-400 hover:text-indigo-500'
        }`}
      >
        <Plus size={18} /> Add Task
      </button>
    </div>
  );
};

const HOME_SCENE_OPTIONS: { key: HomeScene; label: string; preview: string; description: string }[] = [
  { key: 'bike', label: 'Bike ride', preview: '🚲', description: 'Sunny grass and a playful bicycle sketch.' },
  { key: 'school', label: 'School time', preview: '📚', description: 'Books, stars, and notebook doodles.' },
  { key: 'kite', label: 'Fly a kite', preview: '🪁', description: 'A breezy sky with a colorful kite.' },
  { key: 'sandcastle', label: 'Sandcastle', preview: '🏖️', description: 'Beach colors, towers, and a happy umbrella.' },
];

/* ---- Main Component ---- */
export const ParentSettings = ({
  children,
  homeScene,
  onChange,
  onHomeSceneChange,
  onRestartSetup,
  onResetAppData,
  onBack,
}: ParentSettingsProps) => {
  const { status: authStatus, signOut, configured, householdStatus, household, entitlementStatus, householdEntitlement } = useAuth();
  const { householdUnlockProduct, isProcessing, purchaseHouseholdUnlock, restorePurchases } = useBilling();
  const [confirmReset, setConfirmReset] = useState(false);
  const [billingNotice, setBillingNotice] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    childId: string;
    routine: RoutineType;
    taskId?: string;
  } | null>(null);
  const [activeSection, setActiveSection] = useState<ParentSection>('kids');
  const [kidEditorTab, setKidEditorTab] = useState<KidEditorTab>('profile');
  const [editorChildId, setEditorChildId] = useState<string>(children[0]?.id ?? '');
  const [editorRoutine, setEditorRoutine] = useState<RoutineType>('morning');

  const updateChild = (id: string, updater: (c: Child) => Child) => {
    onChange(children.map((c) => (c.id === id ? updater(c) : c)));
  };

  const addChild = () => {
    onChange([
      ...children,
      {
        id: crypto.randomUUID(),
        name: 'New Child',
        age: 5,
        ageBucket: '4-6',
        avatarSeed: crypto.randomUUID(),
        avatarAnimal: undefined,
        schedule: {
          morning: DEFAULT_SCHEDULE.morning,
          evening: DEFAULT_SCHEDULE.evening,
        },
        morning: [],
        evening: [],
      },
    ]);
  };

  const handleSaveTask = (title: string, icon: string) => {
    if (!modal) return;
    const { childId, routine, taskId } = modal;

    updateChild(childId, (c) => ({
      ...c,
      [routine]: taskId
        ? c[routine].map((t) => (t.id === taskId ? { ...t, title, icon } : t))
        : [
            ...c[routine],
            { id: crypto.randomUUID(), title, icon, completed: false },
          ],
    }));
    setModal(null);
  };

  const editingTask = modal?.taskId
    ? children
        .find((c) => c.id === modal.childId)
        ?.[modal.routine]?.find((t) => t.id === modal.taskId)
    : undefined;
  const selectedSuggestions = modal ? TASK_CATALOG[modal.routine] : [];
  const editorChild = children.find((child) => child.id === editorChildId) ?? children[0];
  const sections: Array<{
    key: ParentSection;
    label: string;
    description: string;
    icon: typeof Users;
  }> = [
    { key: 'kids', label: 'Kids', description: `${children.length} profile${children.length === 1 ? '' : 's'}`, icon: Users },
    { key: 'parents', label: 'Parents', description: 'Account access', icon: UserRound },
    { key: 'household', label: 'Household setup', description: 'Scenes and family home', icon: House },
    { key: 'admin', label: 'Admin', description: 'Reset and restart', icon: Shield },
    { key: 'billing', label: 'Billing', description: 'Coming soon', icon: CreditCard },
  ];

  return (
    <div className="mx-auto min-h-svh max-w-7xl px-4 py-8 sm:px-5 md:px-6 md:py-12">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="rounded-2xl bg-card p-3 text-muted-foreground shadow-sm transition-transform active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Parent Settings</h2>
            <p className="text-muted-foreground text-sm md:text-base">Manage children and their daily routines.</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="w-full rounded-xl bg-foreground px-5 py-2.5 text-base font-bold text-background shadow-button transition-transform active:translate-y-0.5 sm:w-auto"
        >
          Done
        </button>
      </header>

      <div className="grid gap-8 xl:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="rounded-[32px] border border-border bg-card p-5 shadow-sm">
          <div className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`flex w-full items-center gap-3 rounded-[24px] px-4 py-3 text-left transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-button'
                      : 'bg-background text-foreground hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  <Icon size={18} />
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em]">{section.label}</p>
                    <p className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {section.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-[24px] bg-muted/50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">Quick view</p>
            <p className="mt-3 text-lg font-bold text-foreground">{children.length} kids</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a section on the left instead of scrolling through everything at once.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (authStatus === 'signed_in') {
                void signOut();
              }
            }}
            disabled={authStatus !== 'signed_in'}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <div className="space-y-8">
          {activeSection === 'kids' && (
            <section className="rounded-[32px] border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Kids</h3>
                  <p className="text-sm text-muted-foreground">
                    Pick one child, then switch between profile details and routine setup.
                  </p>
                </div>
                {children.length < 3 && (
                  <button
                    onClick={addChild}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
                  >
                    <UserPlus size={18} /> Add another child
                  </button>
                )}
              </div>

              {children.length === 0 ? (
                <div className="mt-8 rounded-[28px] border border-dashed border-primary/35 bg-primary/5 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound size={26} />
                  </div>
                  <h4 className="mt-4 text-2xl font-bold text-foreground">Create the first child profile</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add a child here first, then you can switch over to routines when you are ready.
                  </p>
                  <button
                    type="button"
                    onClick={addChild}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
                  >
                    <Plus size={16} /> Create first profile
                  </button>
                </div>
              ) : editorChild ? (
                <div className="mt-8 space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {children.map((child) => (
                      <button
                        key={`kid-tab-child-${child.id}`}
                        type="button"
                        onClick={() => setEditorChildId(child.id)}
                        className={`flex items-center gap-3 rounded-[24px] border px-4 py-3 text-left transition-all ${
                          editorChild.id === child.id
                            ? 'border-primary bg-primary/10 ring-2 ring-primary'
                            : 'border-border bg-background hover:border-primary/40'
                        }`}
                      >
                        <ChildProfileAvatar
                          name={child.name}
                          seed={child.avatarSeed ?? child.id}
                          animalKey={child.avatarAnimal}
                          size="sm"
                        />
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">Child</p>
                          <p className="text-xl font-bold text-foreground">{child.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex rounded-full bg-muted p-1">
                    {([
                      ['profile', 'Profile'],
                      ['routines', 'Routines'],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setKidEditorTab(value)}
                        className={`rounded-full px-5 py-3 text-sm font-black uppercase tracking-[0.22em] transition-colors ${
                          kidEditorTab === value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {kidEditorTab === 'profile' ? (
                    <section className="rounded-[28px] bg-muted/35 p-5 md:p-6">
                      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:items-start">
                        <div className="rounded-[28px] bg-card p-5 text-center">
                          <ChildProfileAvatar
                            name={editorChild.name}
                            seed={editorChild.avatarSeed ?? editorChild.id}
                            animalKey={editorChild.avatarAnimal}
                            size="md"
                            className="mx-auto"
                          />
                          <div className="mt-5 flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateChild(editorChild.id, (c) => ({
                                  ...c,
                                  avatarSeed: crypto.randomUUID(),
                                  avatarAnimal: undefined,
                                }))
                              }
                              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                            >
                              <Shuffle size={16} /> Shuffle avatar
                            </button>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">Choose animal avatar</p>
                            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                              {ANIMAL_AVATARS.map((avatar) => {
                                const isSelected = (editorChild.avatarAnimal ?? '') === avatar.key;

                                return (
                                  <button
                                    key={`${editorChild.id}-${avatar.key}`}
                                    type="button"
                                    onClick={() =>
                                      updateChild(editorChild.id, (c) => ({
                                        ...c,
                                        avatarAnimal: avatar.key,
                                      }))
                                    }
                                    className={`rounded-2xl border p-3 text-center transition-all ${
                                      isSelected
                                        ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                        : 'border-border bg-background hover:border-primary/40'
                                    }`}
                                    aria-label={`Choose ${avatar.label} avatar`}
                                  >
                                    <div className="text-2xl">{avatar.emoji}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[28px] bg-card p-5 md:p-6">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <input
                              className="w-full border-b-2 border-transparent bg-transparent text-xl font-bold text-foreground outline-none focus:border-primary sm:max-w-xs md:text-2xl"
                              value={editorChild.name}
                              onChange={(e) =>
                                updateChild(editorChild.id, (c) => ({ ...c, name: e.target.value }))
                              }
                            />
                            {children.length > 1 && (
                              <button
                                onClick={() => onChange(children.filter((c) => c.id !== editorChild.id))}
                                className="self-start p-2 text-destructive/50 transition-colors hover:text-destructive sm:self-auto"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>

                          <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                              Age
                              <input
                                type="number"
                                min={2}
                                max={12}
                                value={editorChild.age ?? 5}
                                onChange={(event) =>
                                  updateChild(editorChild.id, (c) => ({
                                    ...c,
                                    age: Number(event.target.value),
                                  }))
                                }
                                className="mt-2 w-full rounded-xl bg-muted px-4 py-3 text-base font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                              />
                            </label>
                            <label className="text-sm font-semibold text-muted-foreground">
                              Suggested age bucket
                              <select
                                value={editorChild.ageBucket ?? '4-6'}
                                onChange={(event) =>
                                  updateChild(editorChild.id, (c) => ({
                                    ...c,
                                    ageBucket: event.target.value as Child['ageBucket'],
                                  }))
                                }
                                className="mt-2 w-full rounded-xl bg-muted px-4 py-3 text-base font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                              >
                                {AGE_BUCKETS.map((bucket) => (
                                  <option key={bucket.key} value={bucket.key}>
                                    {bucket.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div className="mt-5 rounded-[24px] bg-background p-4">
                            <div className="flex items-center gap-2 text-foreground">
                              <Clock3 size={18} />
                              <p className="text-sm font-black uppercase tracking-[0.18em]">Routine schedule</p>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {(['morning', 'evening'] as const).map((routine) => (
                                <div key={`${editorChild.id}-${routine}`} className="rounded-2xl bg-muted/55 p-4">
                                  <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
                                    {routine}
                                  </p>
                                  <div className="mt-3 grid grid-cols-2 gap-3">
                                    <input
                                      type="time"
                                      value={editorChild.schedule?.[routine].start ?? (routine === 'morning' ? '07:00' : '17:00')}
                                      onChange={(event) =>
                                        updateChild(editorChild.id, (c) => ({
                                          ...c,
                                          schedule: {
                                            morning: c.schedule?.morning ?? DEFAULT_SCHEDULE.morning,
                                            evening: c.schedule?.evening ?? DEFAULT_SCHEDULE.evening,
                                            [routine]: {
                                              start: event.target.value,
                                              end: c.schedule?.[routine].end ?? (routine === 'morning' ? '09:00' : '20:00'),
                                            },
                                          },
                                        }))
                                      }
                                      className="rounded-xl bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <input
                                      type="time"
                                      value={editorChild.schedule?.[routine].end ?? (routine === 'morning' ? '09:00' : '20:00')}
                                      onChange={(event) =>
                                        updateChild(editorChild.id, (c) => ({
                                          ...c,
                                          schedule: {
                                            morning: c.schedule?.morning ?? DEFAULT_SCHEDULE.morning,
                                            evening: c.schedule?.evening ?? DEFAULT_SCHEDULE.evening,
                                            [routine]: {
                                              start: c.schedule?.[routine].start ?? (routine === 'morning' ? '07:00' : '17:00'),
                                              end: event.target.value,
                                            },
                                          },
                                        }))
                                      }
                                      className="rounded-xl bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  ) : (
                    <section className="rounded-[28px] bg-muted/35 p-5 md:p-6">
                      <div className="mb-5 flex flex-wrap gap-3">
                        {(['morning', 'evening'] as const).map((routine) => (
                          <button
                            key={`editor-routine-${routine}`}
                            type="button"
                            onClick={() => setEditorRoutine(routine)}
                            className={`rounded-full px-5 py-3 text-sm font-black uppercase tracking-[0.24em] transition-all ${
                              editorRoutine === routine
                                ? routine === 'morning'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-indigo-500 text-white'
                                : 'bg-card text-muted-foreground'
                            }`}
                          >
                            {routine}
                          </button>
                        ))}
                      </div>

                      <div className="rounded-[28px] bg-card p-4 md:p-5">
                        <RoutineColumn
                          type={editorRoutine}
                          tasks={editorChild[editorRoutine]}
                          onReorder={(newOrder) => updateChild(editorChild.id, (c) => ({ ...c, [editorRoutine]: newOrder }))}
                          onDelete={(taskId) =>
                            updateChild(editorChild.id, (c) => ({
                              ...c,
                              [editorRoutine]: c[editorRoutine].filter((t) => t.id !== taskId),
                            }))
                          }
                          onQuickAdd={(task) =>
                            updateChild(editorChild.id, (c) => ({
                              ...c,
                              [editorRoutine]: [
                                ...c[editorRoutine],
                                { id: crypto.randomUUID(), title: task.title, icon: task.icon, completed: false },
                              ],
                            }))
                          }
                          onAdd={() => setModal({ childId: editorChild.id, routine: editorRoutine })}
                          onEdit={(taskId) => setModal({ childId: editorChild.id, routine: editorRoutine, taskId })}
                        />
                      </div>
                    </section>
                  )}
                </div>
              ) : null}
            </section>
          )}

          {activeSection === 'parents' && <AccountSettingsCard />}

          {activeSection === 'household' && (
            <section className="rounded-[32px] border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Palette size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Household setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Pick the child-like doodle scene that appears when no routine is due.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {HOME_SCENE_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => onHomeSceneChange(option.key)}
                    className={`rounded-[28px] border p-4 text-left transition-all ${
                      homeScene === option.key
                        ? 'border-primary bg-primary/10 ring-2 ring-primary'
                        : 'border-border bg-background hover:border-primary/40'
                    }`}
                  >
                    <div className="text-4xl">{option.preview}</div>
                    <p className="mt-3 text-lg font-black text-foreground">{option.label}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'admin' && (
            <section className="rounded-[32px] border border-destructive/20 bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <Trash2 size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Admin</h3>
                  <p className="text-sm text-muted-foreground">
                    Restart setup if you want to walk through profiles and routines again, or clear everything and start over.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-border bg-background p-5">
                  <h4 className="text-lg font-bold text-foreground">Restart setup</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Keep the current children and open the setup flow again so you can review profiles and routines from the start.
                  </p>
                  <button
                    type="button"
                    onClick={onRestartSetup}
                    className="mt-5 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Restart setup
                  </button>
                </div>

                <div className="rounded-[28px] border border-destructive/20 bg-destructive/5 p-5">
                  <h4 className="text-lg font-bold text-foreground">Reset app data</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Remove all saved children, routines, schedules, and progress from this browser and return to a fresh start.
                  </p>
                  {confirmReset ? (
                    <div className="mt-5 space-y-3">
                      <p className="text-sm font-medium text-destructive">
                        This clears everything saved in this browser. Are you sure?
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={onResetAppData}
                          className="rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground transition-transform active:translate-y-0.5"
                        >
                          Yes, reset everything
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="mt-5 rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground transition-transform active:translate-y-0.5"
                    >
                      Reset everything
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeSection === 'billing' && (
            <section className="rounded-[32px] border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Billing</h3>
                  <p className="text-sm text-muted-foreground">
                    Parent-only purchase and restore actions live here without touching the child-facing shared-device flow.
                  </p>
                </div>
              </div>

              {!configured ? (
                <div className="mt-6 rounded-[28px] border border-dashed border-primary/25 bg-primary/5 p-6">
                  <p className="text-lg font-bold text-foreground">Connect Supabase first</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Billing and restore flows need the parent account and household backend before we can safely unlock access across devices.
                  </p>
                </div>
              ) : authStatus !== 'signed_in' ? (
                <div className="mt-6 rounded-[28px] border border-dashed border-primary/25 bg-primary/5 p-6">
                  <p className="text-lg font-bold text-foreground">Sign in as a parent first</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The purchase flow belongs to the household account, so we only show it after the parent signs in.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="rounded-[28px] border border-border bg-background p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">Household access</p>
                    <h4 className="mt-3 text-2xl font-bold text-foreground">
                      {entitlementStatus === 'loading'
                        ? 'Checking access'
                        : householdEntitlement?.status === 'active'
                          ? 'Lifetime unlock active'
                          : householdEntitlement?.status === 'pending'
                            ? 'Verification in progress'
                          : householdEntitlement?.status === 'revoked'
                            ? 'Access needs attention'
                            : 'Unlock this household'}
                    </h4>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {entitlementStatus === 'loading'
                        ? 'We are checking the latest paid access state for this family.'
                        : householdEntitlement?.status === 'active'
                          ? `Paid access is already saved for ${household?.name ?? 'this household'}.`
                          : householdEntitlement?.status === 'pending'
                            ? 'The household submitted purchase evidence and is waiting for verification to complete.'
                          : householdEntitlement?.status === 'revoked'
                            ? 'This household had paid access before. Use restore after we wire the store flows, or re-purchase if needed.'
                            : `This parent-only area is where the ${householdUnlockProduct.priceLabel} native store unlock and restore flows will start.`}
                    </p>
                    {entitlementStatus !== 'loading' && householdEntitlement?.status !== 'active' && (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            void purchaseHouseholdUnlock().then((result) => {
                              setBillingNotice(result.message);
                            });
                          }}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
                        >
                          {isProcessing ? <LoaderCircle size={16} className="animate-spin" /> : <CreditCard size={16} />}
                          Start purchase for {householdUnlockProduct.priceLabel}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void restorePurchases().then((result) => {
                              setBillingNotice(result.message);
                            });
                          }}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <RefreshCcw size={16} />
                          Restore purchases
                        </button>
                      </div>
                    )}
                    {billingNotice && (
                      <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
                        <p className="text-sm text-foreground">{billingNotice}</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-[28px] border border-border bg-background p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">What stays the same</p>
                    <h4 className="mt-3 text-xl font-bold text-foreground">Kids can keep using the device</h4>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Billing stays inside parent-gated areas only. The shared-device home and routine screens stay simple for children.
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {modal && (
        <TaskModal
          initial={editingTask ? { title: editingTask.title, icon: editingTask.icon } : undefined}
          routine={modal.routine}
          mode={modal.taskId ? 'edit' : 'add'}
          suggestions={selectedSuggestions}
          onSave={handleSaveTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};
