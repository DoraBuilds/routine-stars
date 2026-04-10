import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { ensureProvisionedHousehold, type HouseholdBootstrapState } from './household-bootstrap';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

type AuthStatus = 'unavailable' | 'loading' | 'signed_out' | 'signed_in';
type HouseholdStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  householdStatus: HouseholdStatus;
  household: HouseholdBootstrapState | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
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
  const [household, setHousehold] = useState<HouseholdBootstrapState | null>(null);
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
        const provisioned = await ensureProvisionedHousehold(nextSession.user);
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
            : 'Could not prepare the family household.'
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
      signIn: async (email, password) => {
        const supabase = getSupabaseClient();
        if (!supabase) {
          setError('Supabase is not configured yet.');
          return false;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
          return false;
        }

        setError(null);
        return true;
      },
      signUp: async (email, password) => {
        const supabase = getSupabaseClient();
        if (!supabase) {
          setError('Supabase is not configured yet.');
          return false;
        }

        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(signUpError.message);
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
