import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Cloud, CloudOff, LoaderCircle, LogIn, LogOut, Mail, RefreshCcw, ShieldCheck, Trash2, UserRound, UserRoundPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth/use-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
    sendEmailLink,
    retryHousehold,
    signOut,
    deleteAccount,
  } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isCreateMode = mode === 'signup';
  const trimmedEmail = useMemo(() => email.trim(), [email]);
  const trimmedParentName = useMemo(() => parentName.trim(), [parentName]);

  const primaryLabel = isCreateMode ? 'Create account' : 'Send sign-in link';
  const submitLabel = isSubmitting ? 'Sending…' : emailSentTo ? 'Email sent' : primaryLabel;
  const canSubmit =
    !isSubmitting &&
    status !== 'loading' &&
    Boolean(trimmedEmail) &&
    (!isCreateMode || Boolean(trimmedParentName)) &&
    !emailSentTo;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    clearError();
    setValidationError(null);
    setEmailSentTo(null);

    if (isCreateMode && !trimmedParentName) {
      setValidationError('Please enter the parent name before creating the account.');
      setIsSubmitting(false);
      return;
    }

    const ok = await sendEmailLink(trimmedEmail, mode, isCreateMode ? { parentName: trimmedParentName } : undefined);
    if (ok) {
      setEmailSentTo(trimmedEmail);
    }
    setIsSubmitting(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    clearError();
    const ok = await deleteAccount();
    if (ok) {
      setEmail('');
      setParentName('');
      setEmailSentTo(null);
      setMode('signin');
    }
    setIsDeleting(false);
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
            Sign in to load and manage the household saved to this account.
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
                Routine Stars needs these keys before account-based household access can work.
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
              This browser is connected to the household saved under this parent account.
            </p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <LogOut size={16} />
              Sign out
            </button>

            <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle size={16} />
                <p className="text-xs font-black uppercase tracking-[0.22em]">Danger zone</p>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">Delete parent account</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This permanently deletes the parent account and the synced household data. This cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-destructive/30 bg-background px-4 py-2.5 text-sm font-bold text-destructive transition-colors hover:border-destructive/50"
                  >
                    <Trash2 size={16} />
                    Delete account
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this parent account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove your parent login and the synced family space. You will need to create a new account to use Routine Stars again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => void handleDeleteAccount()}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? <LoaderCircle size={16} className="mr-2 inline animate-spin" /> : null}
                      Delete account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-background p-5">
            <div className="flex items-center gap-2 text-foreground">
              {householdStatus === 'loading' ? (
                <LoaderCircle size={18} className="animate-spin text-primary" />
              ) : (
                <UserRoundPlus size={18} className="text-primary" />
              )}
              <p className="text-sm font-black uppercase tracking-[0.18em]">Family space</p>
            </div>
            <p className="mt-4 text-lg font-bold text-foreground">
              {household?.name ?? 'Preparing family space'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {householdStatus === 'ready'
                ? 'Your parent account is connected to the family space in Supabase.'
                : householdStatus === 'error'
                  ? 'We hit a problem while setting up the family space. If the live Supabase project is missing the household schema, retry will keep failing until that database setup is applied.'
                  : 'We are preparing the first synced family space for this parent account.'}
            </p>
            {householdStatus === 'error' && (
              <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                <p className="text-sm text-destructive">{error ?? 'The family space is not ready yet.'}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  After the Supabase household schema is applied, return here and choose <span className="font-semibold text-foreground">Try again</span>.
                </p>
                <button
                  type="button"
                  onClick={() => void retryHousehold()}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <RefreshCcw size={16} />
                  Try again
                </button>
              </div>
            )}
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
                  setValidationError(null);
                  setEmailSentTo(null);
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

          <div className="mt-5">
            {isCreateMode && (
              <label className="block text-sm font-semibold text-muted-foreground">
                Parent name
                <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                  <UserRound size={18} className="text-muted-foreground" />
                  <input
                    type="text"
                    value={parentName}
                    onChange={(event) => setParentName(event.target.value)}
                    className="w-full bg-transparent text-base font-medium text-foreground outline-none"
                    placeholder="e.g. Dora"
                    autoComplete="name"
                  />
                </div>
              </label>
            )}

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
                  autoComplete="email"
                />
              </div>
            </label>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {mode === 'signin'
              ? 'We will email a sign-in link to this address so this device can open the household saved to your account.'
              : 'We will email a one-time sign-up link. After you confirm it, the household bootstrap will run automatically.'}
          </p>

          {emailSentTo && (
            <div className="mt-4 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 text-success" />
                <div>
                  <p className="font-bold text-foreground">Check your email</p>
                  <p className="mt-1 text-muted-foreground">
                    We sent a secure link to <span className="font-semibold text-foreground">{emailSentTo}</span>.
                    Open it on this device to finish {mode === 'signin' ? 'signing in' : 'creating the parent account'}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {validationError && (
            <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {validationError}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting || status === 'loading' ? <LoaderCircle size={16} className="animate-spin" /> : <LogIn size={16} />}
            {submitLabel}
          </button>

          {emailSentTo && (
            <button
              type="button"
              onClick={() => {
                setEmailSentTo(null);
                void handleSubmit();
              }}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Resend email link
            </button>
          )}
        </div>
      )}
    </section>
  );
};
