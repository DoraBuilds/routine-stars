import { useState } from 'react';
import { CheckCircle2, Cloud, CloudOff, CreditCard, LoaderCircle, LogIn, LogOut, Mail, RefreshCcw, ShieldCheck, UserRoundPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth/use-auth';
import { useBilling } from '@/lib/billing/billing-context';

type AuthMode = 'signin' | 'signup';

export const AccountSettingsCard = () => {
  const {
    configured,
    status,
    user,
    householdStatus,
    household,
    entitlementStatus,
    householdEntitlement,
    error,
    clearError,
    sendEmailLink,
    retryHousehold,
    signOut,
  } = useAuth();
  const { householdUnlockProduct, isProcessing, purchaseHouseholdUnlock, restorePurchases } = useBilling();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [billingMessage, setBillingMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    clearError();
    setEmailSentTo(null);
    setBillingMessage(null);
    const trimmedEmail = email.trim();
    const ok = await sendEmailLink(trimmedEmail, mode);
    if (ok) {
      setEmailSentTo(trimmedEmail);
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
        <div className="mt-6 grid gap-4 md:grid-cols-3">
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
              <p className="text-sm font-black uppercase tracking-[0.18em]">Family space</p>
            </div>
            <p className="mt-4 text-lg font-bold text-foreground">
              {household?.name ?? 'Preparing family space'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {householdStatus === 'ready'
                ? 'Your parent account is connected to the family space in Supabase.'
                : householdStatus === 'error'
                  ? 'We hit a problem while setting up the family space. You can try again here.'
                  : 'We are preparing the first synced family space for this parent account.'}
            </p>
            {householdStatus === 'error' && (
              <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                <p className="text-sm text-destructive">{error ?? 'The family space is not ready yet.'}</p>
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

          <div className="rounded-[28px] border border-border bg-background p-5">
            <div className="flex items-center gap-2 text-foreground">
              {entitlementStatus === 'loading' ? (
                <LoaderCircle size={18} className="animate-spin text-primary" />
              ) : (
                <CreditCard size={18} className="text-primary" />
              )}
              <p className="text-sm font-black uppercase tracking-[0.18em]">Access</p>
            </div>
            <p className="mt-4 text-lg font-bold text-foreground">
              {entitlementStatus === 'loading'
                ? 'Checking access'
                : householdEntitlement?.status === 'active'
                  ? 'Lifetime unlock active'
                  : householdEntitlement?.status === 'revoked'
                    ? 'Access needs attention'
                    : 'Not purchased yet'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {entitlementStatus === 'error'
                ? 'We could not verify billing access yet. You can retry from here.'
                : householdEntitlement?.status === 'active'
                  ? 'This household has a verified paid unlock saved to the account.'
                  : householdEntitlement?.status === 'revoked'
                    ? 'This household had paid access before, but the entitlement is no longer active.'
                    : `This household is signed in and ready for the ${householdUnlockProduct.priceLabel} parent-only purchase flow.`}
            </p>
            {(householdEntitlement?.status !== 'active' || entitlementStatus === 'error') && entitlementStatus !== 'loading' && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    void purchaseHouseholdUnlock().then((result) => {
                      setBillingMessage(result.message);
                    });
                  }}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
                >
                  {isProcessing ? <LoaderCircle size={16} className="animate-spin" /> : <CreditCard size={16} />}
                  Unlock Routine Stars for {householdUnlockProduct.priceLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void restorePurchases().then((result) => {
                      setBillingMessage(result.message);
                    });
                  }}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <RefreshCcw size={16} />
                  Restore purchases
                </button>
              </div>
            )}
            {billingMessage && (
              <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
                <p className="text-sm text-foreground">{billingMessage}</p>
              </div>
            )}
            {(entitlementStatus === 'error' || householdEntitlement?.status === 'revoked') && (
              <button
                type="button"
                onClick={() => void retryHousehold()}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <RefreshCcw size={16} />
                Refresh access
              </button>
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
                    setEmailSentTo(null);
                    setBillingMessage(null);
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
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {mode === 'signin'
              ? 'We will email a sign-in link to this address so the shared device can connect safely.'
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

          {error && (
            <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || isProcessing || !email.trim() || status === 'loading'}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting || status === 'loading' ? <LoaderCircle size={16} className="animate-spin" /> : <LogIn size={16} />}
            {mode === 'signin' ? 'Email me a sign-in link' : 'Email me a sign-up link'}
          </button>
        </div>
      )}
    </section>
  );
};
