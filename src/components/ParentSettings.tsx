import { useState } from 'react';
import { Reorder } from 'framer-motion';
import {
  Sun, Moon, Trash2, Plus, GripVertical, UserPlus, ArrowLeft, X, Check,
} from 'lucide-react';
import { TaskIcon } from './TaskIcon';
import type { Child, RoutineType } from '@/lib/types';
import { ICON_OPTIONS } from '@/lib/types';

interface ParentSettingsProps {
  children: Child[];
  onChange: (children: Child[]) => void;
  onBack: () => void;
}

/* ---- Add / Edit Task Modal ---- */
interface TaskModalProps {
  initial?: { title: string; icon: string };
  onSave: (title: string, icon: string) => void;
  onClose: () => void;
}

const TaskModal = ({ initial, onSave, onClose }: TaskModalProps) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? 'smile');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card rounded-[32px] p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">
            {initial ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={22} />
          </button>
        </div>

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
  childId: string;
  onReorder: (tasks: Child['morning']) => void;
  onDelete: (taskId: string) => void;
  onAdd: () => void;
  onEdit: (taskId: string) => void;
}

const RoutineColumn = ({ type, tasks, onReorder, onDelete, onAdd, onEdit }: RoutineColumnProps) => {
  const isMorning = type === 'morning';

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

/* ---- Main Component ---- */
export const ParentSettings = ({ children, onChange, onBack }: ParentSettingsProps) => {
  const [modal, setModal] = useState<{
    childId: string;
    routine: RoutineType;
    taskId?: string;
  } | null>(null);

  const updateChild = (id: string, updater: (c: Child) => Child) => {
    onChange(children.map((c) => (c.id === id ? updater(c) : c)));
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

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-6 py-8 md:py-12 min-h-svh">
      <header className="flex items-center justify-between mb-10 md:mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-card shadow-sm text-muted-foreground active:scale-95 transition-transform"
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
          className="px-5 py-2.5 bg-foreground text-background rounded-xl font-bold text-base shadow-button active:translate-y-0.5 transition-transform"
        >
          Done
        </button>
      </header>

      <div className="grid gap-10 md:gap-12">
        {children.map((child) => (
          <section key={child.id} className="bg-card p-6 md:p-8 rounded-[32px] shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <input
                className="text-xl md:text-2xl font-bold text-foreground bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full max-w-xs"
                value={child.name}
                onChange={(e) =>
                  updateChild(child.id, (c) => ({ ...c, name: e.target.value }))
                }
              />
              {children.length > 1 && (
                <button
                  onClick={() => onChange(children.filter((c) => c.id !== child.id))}
                  className="text-destructive/50 hover:text-destructive p-2 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <RoutineColumn
                type="morning"
                tasks={child.morning}
                childId={child.id}
                onReorder={(newOrder) => updateChild(child.id, (c) => ({ ...c, morning: newOrder }))}
                onDelete={(taskId) =>
                  updateChild(child.id, (c) => ({
                    ...c,
                    morning: c.morning.filter((t) => t.id !== taskId),
                  }))
                }
                onAdd={() => setModal({ childId: child.id, routine: 'morning' })}
                onEdit={(taskId) => setModal({ childId: child.id, routine: 'morning', taskId })}
              />
              <RoutineColumn
                type="evening"
                tasks={child.evening}
                childId={child.id}
                onReorder={(newOrder) => updateChild(child.id, (c) => ({ ...c, evening: newOrder }))}
                onDelete={(taskId) =>
                  updateChild(child.id, (c) => ({
                    ...c,
                    evening: c.evening.filter((t) => t.id !== taskId),
                  }))
                }
                onAdd={() => setModal({ childId: child.id, routine: 'evening' })}
                onEdit={(taskId) => setModal({ childId: child.id, routine: 'evening', taskId })}
              />
            </div>
          </section>
        ))}

        {children.length < 3 && (
          <button
            onClick={() =>
              onChange([
                ...children,
                {
                  id: crypto.randomUUID(),
                  name: 'New Child',
                  morning: [],
                  evening: [],
                },
              ])
            }
            className="py-6 border-4 border-dashed border-border rounded-[32px] text-muted-foreground text-xl font-bold flex items-center justify-center gap-3 hover:bg-card hover:border-primary/40 hover:text-primary transition-all"
          >
            <UserPlus size={24} /> Add Another Child
          </button>
        )}
      </div>

      {/* Task Modal */}
      {modal && (
        <TaskModal
          initial={editingTask ? { title: editingTask.title, icon: editingTask.icon } : undefined}
          onSave={handleSaveTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};
