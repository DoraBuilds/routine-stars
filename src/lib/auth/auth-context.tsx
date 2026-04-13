import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { HouseholdRecord } from '@/lib/data/models';
import { ensureHousehold } from './household-bootstrap';
import { getSupabaseClient, getSupabaseEmailRedirectUrl, isSupabaseConfigured } from '@/lib/supabase/client';

type AuthStatus = 'unavailable' | 'loading' | 'signed_out' | 'signed_in';
type HouseholdStatus = 'idle' | 'loading' | 'ready' | 'error';
type AuthLinkMode = 'signin' | 'signup';

export interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  householdStatus: HouseholdStatus;
  household: HouseholdRecord | null;
  error: string | null;
  sendEmailLink: (email: string, mode: AuthLinkMode) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  configured: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const configured = isSupabaseConfigured();
  const [status, setStatus] = useState<AuthStatus>(configured ? 'loading' : 'unavailable');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [householdStatus, setHouseholdStatus] = useState<HouseholdStatus>('idle');
  const [household, setHousehold] = useState<HouseholdRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus('unavailable');
      return;
    }

    let isMounted = true;

    const syncSession = async (nextSession: Session | null) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setHousehold(null);
        setHouseholdStatus('idle');
        setStatus('signed_out');
        return;
      }

      setStatus('signed_in');
      setHouseholdStatus('loading');

      try {
        const provisioned = await ensureHousehold(nextSession.user);
        if (!isMounted) return;
        setHousehold(provisioned);
        setHouseholdStatus('ready');
      } catch (bootstrapError) {
        if (!isMounted) return;
        setHousehold(null);
        setHouseholdStatus('error');
        setError(
          bootstrapError instanceof Error
            ? bootstrapError.message
            : 'Could not prepare the family household in Supabase.'
        );
      }
    };

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) return;
      if (sessionError) {
        setError(sessionError.message);
        setStatus('signed_out');
        return;
      }

      void syncSession(data.session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  const authActions = useMemo<AuthContextValue>(
    () => ({
      configured,
      status,
      session,
      user,
      householdStatus,
      household,
      error,
      clearError: () => setError(null),
      sendEmailLink: async (email, mode) => {
        const supabase = getSupabaseClient();
        if (!supabase) {
          setError('Supabase is not configured yet.');
          return false;
        }

        const { error: authError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: getSupabaseEmailRedirectUrl(),
            shouldCreateUser: mode === 'signup',
          },
        });

        if (authError) {
          setError(authError.message);
          return false;
        }

        setError(null);
        return true;
      },
      signOut: async () => {
        const supabase = getSupabaseClient();
        if (!supabase) return;

        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          setError(signOutError.message);
        } else {
          setError(null);
        }
      },
    }),
    [configured, error, household, householdStatus, session, status, user]
  );

  return <AuthContext.Provider value={authActions}>{children}</AuthContext.Provider>;
};

export { AuthContext };
