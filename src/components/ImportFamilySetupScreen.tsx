import { ArrowRight, CloudUpload, LoaderCircle, Sparkles } from 'lucide-react';

interface ImportFamilySetupScreenProps {
  onImport: () => void;
  onStartFresh: () => void;
  isImporting: boolean;
  error?: string | null;
}

export const ImportFamilySetupScreen = ({
  onImport,
  onStartFresh,
  isImporting,
  error,
}: ImportFamilySetupScreenProps) => (
  <div className="relative min-h-svh overflow-hidden px-5 py-10 md:px-6 md:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-72 w-[42rem] max-w-full rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute left-6 top-24 -z-10 h-28 w-28 rounded-full bg-accent/20 blur-2xl" />
    <div className="absolute right-8 top-16 -z-10 h-36 w-36 rounded-full bg-success/15 blur-2xl" />

    <div className="mx-auto max-w-4xl rounded-[36px] border border-border bg-card/95 p-7 shadow-card md:p-9">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-primary">
        <CloudUpload size={16} />
        Bring Your Family Setup
      </div>

      <h1 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
        We found routines already saved on this device
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        You can import this family setup into your parent account or start fresh for this household instead.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] bg-primary/8 p-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Recommended</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground">Import this family setup</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep the children, routines, schedules, and home scene already saved on this device.
          </p>
        </div>

        <div className="rounded-[28px] bg-muted/55 p-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Alternative</p>
          <h2 className="mt-3 text-2xl font-bold text-foreground">Start fresh instead</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Leave this device&apos;s old setup behind and create a brand-new household setup in your account.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-border bg-background/80 p-5">
        <div className="flex items-center gap-2 text-foreground">
          <Sparkles size={18} className="text-primary" />
          <p className="text-sm font-black uppercase tracking-[0.18em]">Import notes</p>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <p>1. Children, schedules, and routines move into your account.</p>
          <p>2. Daily completion progress does not get merged into cloud yet.</p>
          <p>3. This device keeps working for kids after setup is ready.</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onImport}
          disabled={isImporting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isImporting ? <LoaderCircle size={16} className="animate-spin" /> : <CloudUpload size={16} />}
          Import this family setup
        </button>

        <button
          type="button"
          onClick={onStartFresh}
          disabled={isImporting}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowRight size={16} />
          Start fresh instead
        </button>
      </div>
    </div>
  </div>
);
