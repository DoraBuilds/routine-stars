import { CloudOff, RefreshCw, ShieldAlert } from 'lucide-react';

interface HouseholdLoadErrorScreenProps {
  error: string;
  onRetry: () => void;
}

export const HouseholdLoadErrorScreen = ({ error, onRetry }: HouseholdLoadErrorScreenProps) => (
  <div className="relative min-h-svh overflow-hidden px-5 py-10 md:px-6 md:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-72 w-[42rem] max-w-full rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute left-6 top-24 -z-10 h-28 w-28 rounded-full bg-warning/20 blur-2xl" />
    <div className="absolute right-8 top-16 -z-10 h-36 w-36 rounded-full bg-destructive/10 blur-2xl" />

    <div className="mx-auto max-w-4xl rounded-[36px] border border-border bg-card/95 p-7 shadow-card md:p-9">
      <div className="inline-flex items-center gap-2 rounded-full bg-warning/10 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-warning">
        <CloudOff size={16} />
        Household Sync Paused
      </div>

      <h1 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
        We could not load this family account yet
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        This device is signed in, but we could not confirm the household from the cloud right now. We are pausing here
        so we do not accidentally treat the account like a brand-new family.
      </p>

      <div className="mt-8 rounded-[28px] border border-destructive/20 bg-destructive/5 p-5">
        <div className="flex items-center gap-2 text-destructive">
          <ShieldAlert size={18} />
          <p className="text-sm font-black uppercase tracking-[0.18em]">Why we paused</p>
        </div>
        <p className="mt-3 text-sm text-foreground">{error}</p>
      </div>

      <div className="mt-8 rounded-[28px] border border-border bg-background/80 p-5 text-sm text-muted-foreground">
        <p>1. We did not open a fresh setup flow because that could overwrite the wrong family data.</p>
        <p className="mt-2">2. Retry once the connection or family sync service is available again.</p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
      >
        <RefreshCw size={16} />
        Retry loading the household
      </button>
    </div>
  </div>
);
