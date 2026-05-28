import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { HouseholdRecord } from '@/lib/data/models';
import { clearLocalAppState } from '@/lib/storage/local-app-state';
import { ensureHousehold } from './household-bootstrap';
import {
  getSupabaseClient,
  getSupabaseEmailRedirectUrl,
  getSupabaseProjectUrl,
  isSupabaseConfigured,
} from '@/lib/supabase/client';

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
  sendEmailLink: (email: string, mode: AuthLinkMode, options?: { parentName?: string }) => Promise<boolean>;
  retryHousehold: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
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

  const syncHousehold = async (nextUser: User | null) => {
    setUser(nextUser);

    if (!nextUser) {
      setHousehold(null);
      setHouseholdStatus('idle');
      setStatus('signed_out');
      return;
    }

    setStatus('signed_in');
    setHouseholdStatus('loading');

    try {
      const provisioned = await ensureHousehold(nextUser);
      setHousehold(provisioned);
      setHouseholdStatus('ready');
      setError(null);
    } catch (bootstrapError) {
      setHousehold(null);
      setHouseholdStatus('error');
      setError(
        bootstrapError instanceof Error
          ? bootstrapError.message
          : 'Could not prepare the family household in Supabase.'
      );
    }
  };

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
      await syncHousehold(nextSession?.user ?? null);
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
      sendEmailLink: async (email, mode, options) => {
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
            // For new signups, keep a friendly parent name on the user metadata so
            // we can name the first household without guessing from the email.
            ...(mode === 'signup' && options?.parentName
              ? { data: { parent_name: options.parentName.trim() } }
              : {}),
          },
        });

        if (authError) {
          setError(authError.message);
          return false;
        }

        setError(null);
        return true;
      },
      retryHousehold: async () => {
        setError(null);
        await syncHousehold(user);
      },
      signOut: async () => {
        const supabase = getSupabaseClient();
        if (!supabase) return;

        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          setError(signOutError.message);
        } else {
          clearLocalAppState(user?.id ? { userId: user.id } : undefined);
          setError(null);
        }
      },
      deleteAccount: async () => {
        const supabase = getSupabaseClient();
        if (!supabase) {
          setError('Supabase is not configured yet.');
          return false;
        }

        const {
          data: { session: activeSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError(sessionError.message);
          return false;
        }

        const accessToken = activeSession?.access_token;
        if (!accessToken) {
          setError('You need to be signed in to delete this account.');
          return false;
        }

        try {
          const baseUrl = getSupabaseProjectUrl();
          if (!baseUrl) {
            setError('Supabase is not configured yet.');
            return false;
          }

          const response = await fetch(new URL('functions/v1/delete-account', baseUrl).toString(), {
            method: 'POST',
            headers: {
              authorization: `Bearer ${accessToken}`,
              'content-type': 'application/json',
            },
            body: JSON.stringify({}),
          });

          if (!response.ok) {
            const message = await response.text().catch(() => '');
            setError(message.trim() || 'Could not delete the account. Please try again.');
            return false;
          }

          // Clear device-local data even if sign-out errors, so the app resets cleanly.
          clearLocalAppState(user?.id ? { userId: user.id } : undefined);
          await supabase.auth.signOut();
          setError(null);
          return true;
        } catch (deleteError) {
          setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the account. Please try again.');
          return false;
        }
      },
    }),
    [configured, error, household, householdStatus, session, status, user]
  );

  return <AuthContext.Provider value={authActions}>{children}</AuthContext.Provider>;
};

export { AuthContext };
