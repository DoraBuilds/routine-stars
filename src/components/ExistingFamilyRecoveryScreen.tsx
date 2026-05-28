import { ArrowRight, Clock3, LogOut, Search, ShieldCheck } from 'lucide-react';

interface ExistingFamilyRecoveryScreenProps {
  onStartFresh: () => void;
  onSignOut: () => void;
}

export const ExistingFamilyRecoveryScreen = ({
  onStartFresh,
  onSignOut,
}: ExistingFamilyRecoveryScreenProps) => (
  <div className="relative min-h-svh overflow-hidden bg-[linear-gradient(180deg,#eef8ff_0%,#fffdf7_52%,#fff6ea_100%)] px-5 py-10 md:px-6 md:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-80 w-[44rem] max-w-full rounded-full bg-amber-200/30 blur-3xl" />
    <div className="absolute left-10 top-20 -z-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl" />
    <div className="absolute right-0 top-16 -z-10 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />

    <div className="mx-auto max-w-4xl space-y-5">
      {/* Reassurance banner — shown prominently before anything else */}
      <div className="flex items-center gap-3 rounded-[28px] border border-success/30 bg-success/8 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-success">Your data is safe</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your kids and routines are not lost — they just need to be imported from the browser where they were first created.
          </p>
        </div>
      </div>

      <div className="rounded-[40px] border border-white/80 bg-card/95 p-7 shadow-card md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-amber-800">
          <Search size={16} />
          Looking for your family?
        </div>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold text-foreground md:text-5xl">
          This browser looks brand new
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          You&apos;re signed in, but we didn&apos;t find any saved family routines here yet. If your kids and routines
          were created in a different browser, laptop profile, or older tab, Routine Stars can only import them from
          that original place.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[30px] border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-center gap-3 text-foreground">
              <Clock3 size={18} className="text-primary" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">Safest next step</p>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Go back to the original browser once</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Open the exact browser context where the routines were first created, sign in there, and import that saved
              family into your account. After that, this device will load the synced household normally.
            </p>
          </div>

          <div className="rounded-[30px] border border-border bg-background/80 p-5">
            <div className="flex items-center gap-3 text-foreground">
              <ArrowRight size={18} className="text-accent" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">Only if this is intentional</p>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Start a brand-new family here</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Choose this only if you really want a clean household on this account and you are not trying to recover
              existing kids and routines.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[30px] border border-border bg-background/85 p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-foreground">Why this happens</p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            <p>1. Older routines may still live only in the browser where they were originally created.</p>
            <p>2. Signing in on a different browser context can look like an empty family account.</p>
            <p>3. Once the original setup is imported, new devices can load it from the cloud.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onStartFresh}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
          >
            <ArrowRight size={16} />
            Start fresh on this device
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <LogOut size={16} />
            Sign out here
          </button>
        </div>
      </div>
    </div>
  </div>
);
