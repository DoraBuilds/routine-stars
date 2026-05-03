import { Cloud, Sparkles } from 'lucide-react';
import { AccountSettingsCard } from './AccountSettingsCard';

export const AccountEntryScreen = () => (
    <div className="relative min-h-svh overflow-hidden px-5 py-10 md:px-6 md:py-14">
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-72 w-[42rem] max-w-full rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute left-6 top-24 -z-10 h-28 w-28 rounded-full bg-accent/20 blur-2xl" />
      <div className="absolute right-8 top-16 -z-10 h-36 w-36 rounded-full bg-success/15 blur-2xl" />

      <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[minmax(0,1.1fr)_440px] xl:items-start">
        <section className="rounded-[36px] border border-border bg-card/95 p-7 shadow-card md:p-9">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-primary">
            <Cloud size={16} />
            New Device Setup
          </div>

          <h1 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
            Sign in to open your family routines
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Routine Stars now works as an account-based app. Sign in or create a parent account to load your
            household, set up routines, and keep data synced across devices.
          </p>

          <div className="mt-8 rounded-[28px] bg-primary/8 p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Required</p>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Use your parent account to continue</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              After you sign in, Routine Stars will load the household saved to your account and guide you through
              setup if this is a brand-new family space.
            </p>
          </div>

          <div className="mt-8 rounded-[28px] border border-border bg-background/80 p-5">
            <div className="flex items-center gap-2 text-foreground">
              <Sparkles size={18} className="text-primary" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">What happens next</p>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <p>1. Parent signs in or creates an account with an email link.</p>
              <p>2. Routine Stars loads the synced household or starts first-time setup.</p>
              <p>3. Kids return here later and just tap their profile to begin.</p>
            </div>
          </div>
        </section>

        <AccountSettingsCard />
      </div>
    </div>
);
