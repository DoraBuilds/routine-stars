import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/use-auth';
import { finalizeSupabaseAuthFromUrl } from '@/lib/supabase/client';

const CALLBACK_TIMEOUT_MS = 20000;

const AuthCallback = () => {
  const navigate = useNavigate();
  const { configured, status, householdStatus, error, clearError } = useAuth();
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!configured) {
      return;
    }

    let cancelled = false;

    void finalizeSupabaseAuthFromUrl().then((result) => {
      if (!cancelled && result.error) {
        setCallbackError(result.error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [configured]);

  useEffect(() => {
    if (!configured) {
      return;
    }

    if (status === 'signed_in' && householdStatus !== 'loading') {
      navigate('/', { replace: true });
    }
  }, [configured, householdStatus, navigate, status]);

  useEffect(() => {
    if (!configured || callbackError || (status === 'signed_in' && householdStatus !== 'loading')) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimedOut(true);
    }, CALLBACK_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [callbackError, configured, householdStatus, status]);

  const resolvedError = callbackError ?? error;

  return (
    <div className="flex min-h-svh items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-border bg-card p-8 text-center shadow-card">
        {status === 'signed_in' && householdStatus === 'error' ? (
          <>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-destructive">Sign-in needs one more step</p>
            <h1 className="mt-4 text-3xl font-bold text-foreground">We signed you in, but could not open the family space yet</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {resolvedError ?? 'Please try this link again in a moment.'}
            </p>
            <button
              type="button"
              onClick={() => {
                clearError();
                navigate('/', { replace: true });
              }}
              className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
            >
              Continue to Routine Stars
            </button>
          </>
        ) : resolvedError || timedOut ? (
          <>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-destructive">
              {timedOut ? 'Sign-in is taking too long' : 'Sign-in link problem'}
            </p>
            <h1 className="mt-4 text-3xl font-bold text-foreground">
              {timedOut ? 'This device did not finish connecting' : 'This sign-in link did not finish cleanly'}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {resolvedError ?? 'Please refresh once, or request a new sign-in link if this keeps happening.'}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  clearError();
                  setCallbackError(null);
                  setTimedOut(false);
                  window.location.reload();
                }}
                className="rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Refresh and try again
              </button>
              <button
                type="button"
                onClick={() => {
                  clearError();
                  navigate('/', { replace: true });
                }}
                className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
              >
                Back to sign in
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LoaderCircle size={28} className="animate-spin" />
            </div>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-primary">Finishing sign-in</p>
            <h1 className="mt-4 text-3xl font-bold text-foreground">Opening your family account</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Please keep this page open for a moment while we connect this device.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
