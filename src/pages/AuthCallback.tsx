import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/use-auth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { configured, status, householdStatus, error, clearError } = useAuth();

  useEffect(() => {
    if (!configured) {
      return;
    }

    if (status === 'signed_in' && householdStatus !== 'loading') {
      navigate('/', { replace: true });
    }
  }, [configured, householdStatus, navigate, status]);

  return (
    <div className="flex min-h-svh items-center justify-center px-5 py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-border bg-card p-8 text-center shadow-card">
        {status === 'signed_in' && householdStatus === 'error' ? (
          <>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-destructive">Sign-in needs one more step</p>
            <h1 className="mt-4 text-3xl font-bold text-foreground">We signed you in, but could not open the family space yet</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {error ?? 'Please try this link again in a moment.'}
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
        ) : status === 'signed_out' && error ? (
          <>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-destructive">Sign-in link problem</p>
            <h1 className="mt-4 text-3xl font-bold text-foreground">This sign-in link did not finish cleanly</h1>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => {
                clearError();
                navigate('/', { replace: true });
              }}
              className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-button transition-transform active:translate-y-0.5"
            >
              Back to sign in
            </button>
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
