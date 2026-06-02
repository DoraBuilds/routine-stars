import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/use-auth';
import { finalizeSupabaseAuthFromUrl } from '@/lib/supabase/client';

const CALLBACK_SLOW_MS = 20000;
const CALLBACK_FAILURE_MS = 60000;

const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  otp_expired: 'This sign-in link expired. Please request a new link and try again.',
  token_expired: 'This sign-in link expired. Please request a new link and try again.',
  access_denied: 'Access was denied. Please try signing in again.',
  unauthorized: 'This sign-in link is no longer valid. Please request a new one.',
  invalid_grant: 'This sign-in link is no longer valid. Please request a new one.',
  email_not_confirmed: 'Please confirm your email address before signing in.',
  user_not_found: 'No account was found for this sign-in link. Please try again.',
  server_error: 'Something went wrong on our end. Please try again in a moment.',
};

const FALLBACK_ERROR = 'This sign-in link did not finish cleanly. Please request a new one.';

const getCallbackErrorFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    const error = url.searchParams.get('error');
    const errorCode = url.searchParams.get('error_code');
    const description = url.searchParams.get('error_description') ?? url.searchParams.get('message');

    if (!error && !errorCode && !description) {
      return null;
    }

    // Log raw params for debugging without exposing them to the user.
    console.error('[auth-callback] url error params', { error, errorCode, description });

    const normalizedCode = (errorCode ?? error ?? '').toLowerCase().replace(/\+/g, '_');
    return KNOWN_ERROR_MESSAGES[normalizedCode] ?? FALLBACK_ERROR;
  } catch {
    return null;
  }
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { configured, status, householdStatus, error, clearError } = useAuth();
  const [callbackError, setCallbackError] = useState<string | null>(() => getCallbackErrorFromUrl());
  const [takingLongerThanExpected, setTakingLongerThanExpected] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!configured) {
      return;
    }

    let cancelled = false;

    const urlError = getCallbackErrorFromUrl();
    if (urlError) {
      setCallbackError(urlError);
      return () => {
        cancelled = true;
      };
    }

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

    // The callback route should finish quickly: once auth succeeds, route the user
    // into the app and let the main UI show any ongoing cloud bootstrap state.
    // If the bootstrap failed, keep the user here with a clear recovery path.
    if (status === 'signed_in' && householdStatus !== 'error') {
      navigate('/', { replace: true });
    }
  }, [configured, householdStatus, navigate, status]);

  useEffect(() => {
    if (!configured || callbackError || status === 'signed_in') {
      return;
    }

    const slowTimer = window.setTimeout(() => {
      setTakingLongerThanExpected(true);
    }, CALLBACK_SLOW_MS);

    const failureTimer = window.setTimeout(() => {
      setTimedOut(true);
    }, CALLBACK_FAILURE_MS);

    return () => {
      window.clearTimeout(slowTimer);
      window.clearTimeout(failureTimer);
    };
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
        ) : takingLongerThanExpected ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LoaderCircle size={28} className="animate-spin" />
            </div>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-primary">Still connecting</p>
            <h1 className="mt-4 text-3xl font-bold text-foreground">We&apos;re still opening your family account</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              This can take a little longer on some browsers. If this screen stays for more than a minute, we&apos;ll show recovery options.
            </p>
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
