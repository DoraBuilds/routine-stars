import { useState } from 'react';
import { Cloud, CloudOff, LoaderCircle, LogIn, LogOut, Mail, ShieldCheck, UserRoundPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth/use-auth';

type AuthMode = 'signin' | 'signup';

export const AccountSettingsCard = () => {
  const {
    configured,
    status,
    user,
    householdStatus,
    household,
    error,
    clearError,
    signIn,
    signOut,
    signUp,
  } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    clearError();
    const ok =
      mode === 'signin'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);
    if (ok) {
      setPassword('');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="rounded-[32px] border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Cloud size={22} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Parent Account</h3>
          <p className="text-sm text-muted-foreground">
            Sign in to prepare household sync without interrupting the child flow on a shared device.
          </p>
        </div>
      </div>

      {!configured ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-primary/25 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-2xl bg-background p-3 text-primary">
              <CloudOff size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">Supabase not connected yet</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable real parent sign in.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                The shared-device child experience will keep working locally until those keys are in place.
              </p>
            </div>
          </div>
        </div>
      ) : status === 'signed_in' && user ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-border bg-background p-5">
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck size={18} className="text-primary" />
              <p className="text-sm font-black uppercase tracking-[0.18em]">Signed in</p>
            </div>
            <p className="mt-4 text-lg font-bold text-foreground">{user.email}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This shared device can keep showing child profiles while the parent account handles sync and setup.
            </p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>

          <div className="rounded-[28px] border border-border bg-background p-5">
            <div className="flex items-center gap-2 text-foreground">
              {householdStatus === 'loading' ? (
                <LoaderCircle size={18} className="animate-spin text-primary" />
              ) : (
                <UserRoundPlus size={18} className="text-primary" />
              )}
              <p className="text-sm font-black uppercase tracking-[0.18em]">Household bootstrap</p>
            </div>
            <p className="mt-4 text-lg font-bold text-foreground">
              {household?.name ?? 'Preparing family household'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {householdStatus === 'ready'
                ? 'The parent account is connected to a household record in Supabase.'
                : householdStatus === 'error'
                  ? 'We could not prepare the household in Supabase yet.'
                  : 'We are preparing the first synced family space for this parent account.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[28px] border border-border bg-background p-5">
          <div className="inline-flex w-full rounded-full bg-muted p-1 sm:w-auto">
            {([
              ['signin', 'Sign in'],
              ['signup', 'Create account'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  clearError();
                  setMode(value);
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors sm:flex-none ${
                  mode === value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-muted-foreground">
              Parent email
              <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                <Mail size={18} className="text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-base font-medium text-foreground outline-none"
                  placeholder="parent@example.com"
                />
              </div>
            </label>

            <label className="text-sm font-semibold text-muted-foreground">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl bg-muted px-4 py-3 text-base font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="At least 6 characters"
              />
            </label>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {mode === 'signin'
              ? 'Sign in when you want this device to connect to a parent account.'
              : 'Create the parent account first. The household bootstrap will run right after the first successful login.'}
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || !email.trim() || password.length < 6 || status === 'loading'}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting || status === 'loading' ? <LoaderCircle size={16} className="animate-spin" /> : <LogIn size={16} />}
            {mode === 'signin' ? 'Sign in parent account' : 'Create parent account'}
          </button>
        </div>
      )}
    </section>
  );
};
