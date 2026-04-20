import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { HouseholdEntitlementRecord, HouseholdRecord } from '@/lib/data/models';
import { SupabaseHouseholdEntitlementRepository } from '@/lib/data/supabase-household-entitlement-repository';
import { ensureHousehold } from './household-bootstrap';
import { getSupabaseClient, getSupabaseEmailRedirectUrl, isSupabaseConfigured } from '@/lib/supabase/client';

type AuthStatus = 'unavailable' | 'loading' | 'signed_out' | 'signed_in';
type HouseholdStatus = 'idle' | 'loading' | 'ready' | 'error';
type EntitlementStatus = 'idle' | 'loading' | 'ready' | 'error';
type AuthLinkMode = 'signin' | 'signup';

export interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  householdStatus: HouseholdStatus;
  household: HouseholdRecord | null;
  entitlementStatus: EntitlementStatus;
  householdEntitlement: HouseholdEntitlementRecord | null;
  error: string | null;
  sendEmailLink: (email: string, mode: AuthLinkMode) => Promise<boolean>;
  retryHousehold: () => Promise<void>;
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
  const [entitlementStatus, setEntitlementStatus] = useState<EntitlementStatus>('idle');
  const [householdEntitlement, setHouseholdEntitlement] = useState<HouseholdEntitlementRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const syncHousehold = async (nextUser: User | null) => {
    setUser(nextUser);

    if (!nextUser) {
      setHousehold(null);
      setHouseholdStatus('idle');
      setHouseholdEntitlement(null);
      setEntitlementStatus('idle');
      setStatus('signed_out');
      return;
    }

    setStatus('signed_in');
    setHouseholdStatus('loading');
    setEntitlementStatus('loading');

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase is not configured yet.');
      }

      const provisioned = await ensureHousehold(nextUser);
      setHousehold(provisioned);
      setHouseholdStatus('ready');

      try {
        const entitlementRepository = new SupabaseHouseholdEntitlementRepository(supabase);
        const entitlement = await entitlementRepository.getByHousehold(provisioned.id);
        setHouseholdEntitlement(entitlement);
        setEntitlementStatus('ready');
        setError(null);
      } catch (entitlementError) {
        setHouseholdEntitlement(null);
        setEntitlementStatus('error');
        setError(
          entitlementError instanceof Error
            ? entitlementError.message
            : 'Could not load the household billing access yet.'
        );
      }
    } catch (bootstrapError) {
      setHousehold(null);
      setHouseholdEntitlement(null);
      setHouseholdStatus('error');
      setEntitlementStatus('error');
      setError(
        bootstrapError instanceof Error
          ? bootstrapError.message
          : 'Could not prepare the family household and billing access in Supabase.'
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
      entitlementStatus,
      householdEntitlement,
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
          setError(null);
        }
      },
    }),
    [configured, entitlementStatus, error, household, householdEntitlement, householdStatus, session, status, user]
  );

  return <AuthContext.Provider value={authActions}>{children}</AuthContext.Provider>;
};

export { AuthContext };
