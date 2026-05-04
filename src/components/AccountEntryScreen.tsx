import { Cloud, Sparkles, Star, Wand2 } from 'lucide-react';
import { AccountSettingsCard } from './AccountSettingsCard';

export const AccountEntryScreen = () => (
  <div className="relative min-h-svh overflow-hidden bg-[linear-gradient(180deg,#eef8ff_0%,#fffdf7_52%,#fff6ea_100%)] px-5 py-10 md:px-6 md:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-80 w-[48rem] max-w-full rounded-full bg-primary/15 blur-3xl" />
    <div className="absolute -left-10 top-24 -z-10 h-44 w-44 rounded-full bg-accent/25 blur-3xl" />
    <div className="absolute right-0 top-8 -z-10 h-52 w-52 rounded-full bg-success/20 blur-3xl" />
    <div className="absolute left-[12%] top-28 -z-10 rotate-[-10deg] text-accent/70">
      <Star size={34} fill="currentColor" />
    </div>
    <div className="absolute right-[16%] top-32 -z-10 rotate-[12deg] text-primary/60">
      <Sparkles size={42} />
    </div>
    <div className="absolute bottom-24 left-[8%] -z-10 text-success/60">
      <Wand2 size={36} />
    </div>

    <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[minmax(0,1.1fr)_440px] xl:items-start">
      <section className="relative overflow-hidden rounded-[40px] border border-white/70 bg-card/95 p-7 shadow-card md:p-9">
        <div className="absolute right-6 top-6 hidden rounded-full bg-accent/15 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-accent md:inline-flex">
          Kids open their stars after parent sign-in
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-primary">
          <Cloud size={16} />
          Family Launch Pad
        </div>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold text-foreground md:text-6xl">
          Open your family&apos;s routine world
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Parents sign in first, then Routine Stars brings back the family&apos;s profiles, routines, and progress so
          kids can jump straight into their playful check-in screen.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-[30px] bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(251,191,36,0.16),rgba(34,197,94,0.10))] p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Parent step first</p>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Use your parent account to continue</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              We&apos;ll send a magic link by email. After that, this device opens the household saved to your account
              and brings the kid-facing home screen back into view.
            </p>
          </div>

          <div className="rounded-[30px] border border-primary/15 bg-white/80 p-5">
            <div className="flex items-center gap-2 text-foreground">
              <Sparkles size={18} className="text-primary" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">When it feels right</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>Kids should mostly see their profiles, not a grown-up login wall.</p>
              <p>This screen only appears on a new device or when a parent needs to reconnect the family account.</p>
              <p>Once signed in, the app returns to the warm child-friendly routine flow.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[30px] border border-border bg-background/85 p-5">
          <div className="flex items-center gap-2 text-foreground">
            <Star size={18} className="fill-accent text-accent" />
            <p className="text-sm font-black uppercase tracking-[0.18em]">What happens next</p>
          </div>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
            <div className="rounded-2xl bg-primary/6 p-4">
              <p className="font-black text-foreground">1. Parent signs in</p>
              <p className="mt-2 leading-6 text-muted-foreground">Use the email link to unlock the family account on this device.</p>
            </div>
            <div className="rounded-2xl bg-accent/8 p-4">
              <p className="font-black text-foreground">2. Routine Stars loads the family</p>
              <p className="mt-2 leading-6 text-muted-foreground">Saved kids, routines, and sync setup come back into place automatically.</p>
            </div>
            <div className="rounded-2xl bg-success/8 p-4">
              <p className="font-black text-foreground">3. Kids tap their profile</p>
              <p className="mt-2 leading-6 text-muted-foreground">The shared device goes back to the fun, simple child flow for daily routines.</p>
            </div>
          </div>
        </div>
      </section>

      <AccountSettingsCard />
    </div>
  </div>
);
