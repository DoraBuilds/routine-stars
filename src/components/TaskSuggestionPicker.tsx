import { Check } from 'lucide-react';
import { TaskIcon } from './TaskIcon';
import type { TaskCatalogItem } from '@/lib/task-catalog';
import { groupTasksByAge } from '@/lib/types';

interface TaskSuggestionPickerProps {
  suggestions: readonly TaskCatalogItem[];
  selectedSuggestionId: string | null;
  onSelectSuggestion: (suggestion: TaskCatalogItem) => void;
}

export const TaskSuggestionPicker = ({
  suggestions,
  selectedSuggestionId,
  onSelectSuggestion,
}: TaskSuggestionPickerProps) => {
  const groups = groupTasksByAge(suggestions);

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.28em] text-muted-foreground">
            Quick Picks
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Start from a suggested task, then customize it for this child.
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-primary">
          Friendly defaults
        </span>
      </div>

      <div className="max-h-[24rem] space-y-5 overflow-y-auto pr-1">
        {groups.map((group) => (
          <section key={group.key}>
            <div className="mb-3">
              <h5 className="text-sm font-black uppercase tracking-[0.24em] text-foreground">
                {group.label}
              </h5>
              <p className="mt-1 text-xs text-muted-foreground">{group.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.tasks.map((suggestion) => {
                const isSelected = suggestion.id === selectedSuggestionId;

                return (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => onSelectSuggestion(suggestion)}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-muted/60 hover:border-primary/40 hover:bg-muted'
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-card text-primary'
                      }`}
                    >
                      <TaskIcon iconKey={suggestion.icon} size={22} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-foreground">{suggestion.title}</p>
                        {isSelected && <Check size={16} className="mt-0.5 text-primary" />}
                      </div>
                      <p className="mt-1 max-h-9 overflow-hidden text-xs text-muted-foreground">
                        {suggestion.featured ? 'A great family-pilot default' : 'A flexible routine option'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
