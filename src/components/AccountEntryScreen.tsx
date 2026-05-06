import { CheckCircle2, Cloud, ShieldCheck, TimerReset } from 'lucide-react';
import { AccountSettingsCard } from './AccountSettingsCard';

export const AccountEntryScreen = () => (
  <div className="relative min-h-svh overflow-hidden bg-[linear-gradient(180deg,#eef8ff_0%,#fffdf7_52%,#fff6ea_100%)] px-5 py-10 md:px-6 md:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-80 w-[48rem] max-w-full rounded-full bg-primary/15 blur-3xl" />
    <div className="absolute -left-10 top-24 -z-10 h-44 w-44 rounded-full bg-accent/25 blur-3xl" />
    <div className="absolute right-0 top-8 -z-10 h-52 w-52 rounded-full bg-success/20 blur-3xl" />

    <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[minmax(0,1.1fr)_440px] xl:items-start">
      <section className="relative overflow-hidden rounded-[40px] border border-white/70 bg-card/95 p-7 shadow-card md:p-9">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-primary">
          <Cloud size={16} />
          Parent Sign In
        </div>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold text-foreground md:text-6xl">
          Bring your family&apos;s routines onto this device
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Sign in with your parent email to load the household saved to your account. Routine Stars will bring back
          your children, routines, and progress on this device.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 size={18} className="text-primary" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">Fast setup</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Open the account once on a new device and Routine Stars restores the family setup already saved there.
            </p>
          </div>

          <div className="rounded-[28px] border border-border bg-white/85 p-5">
            <div className="flex items-center gap-2 text-foreground">
              <TimerReset size={18} className="text-accent" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">Less daily friction</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Keep routines, schedules, and child profiles in one place so mornings and evenings are easier to run.
            </p>
          </div>

          <div className="rounded-[28px] border border-border bg-white/85 p-5">
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck size={18} className="text-success" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">Parent controlled</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Sign-in is for adults only. Once connected, the shared device can go back to the routine flow.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[30px] border border-border bg-background/85 p-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-foreground">What to expect</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>1. Enter your parent email and we&apos;ll send you a secure sign-in link.</p>
            <p>2. After sign-in, this device loads the household saved to your account.</p>
            <p>3. If the account is empty, you can start fresh or recover an existing family from the original device.</p>
          </div>
        </div>
      </section>

      <AccountSettingsCard />
    </div>
  </div>
);
