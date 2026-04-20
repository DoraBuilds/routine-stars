import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  buildPendingEntitlementMutation,
  handleVerificationRequest,
  parseVerificationRequest,
  type ExistingEntitlementSnapshot,
} from './shared.ts';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Method not allowed.',
      }),
      {
        status: 405,
        headers: jsonHeaders,
      }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Request body must be valid JSON.',
      }),
      {
        status: 400,
        headers: jsonHeaders,
      }
    );
  }

  const parsed = parseVerificationRequest(payload);
  const result = handleVerificationRequest(payload);

  if (!parsed) {
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: jsonHeaders,
    });
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return new Response(
      JSON.stringify({
        status: 'unsupported',
        message: 'Server verification is not configured yet. Missing Supabase service role environment.',
      }),
      {
        status: 200,
        headers: jsonHeaders,
      }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: existingEntitlement, error: loadError } = await supabase
    .from('household_entitlements')
    .select('*')
    .eq('household_id', parsed.householdId)
    .maybeSingle<ExistingEntitlementSnapshot>();

  if (loadError) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: loadError.message || 'Could not load the current household entitlement.',
      }),
      {
        status: 500,
        headers: jsonHeaders,
      }
    );
  }

  const nowIso = new Date().toISOString();
  const mutation = buildPendingEntitlementMutation(parsed, existingEntitlement ?? null, nowIso);
  const { error: upsertError } = await supabase.from('household_entitlements').upsert(
    {
      household_id: parsed.householdId,
      ...mutation,
    },
    { onConflict: 'household_id' }
  );

  if (upsertError) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: upsertError.message || 'Could not persist the household entitlement state.',
      }),
      {
        status: 500,
        headers: jsonHeaders,
      }
    );
  }

  const responseBody =
    mutation.status === 'active'
      ? {
          status: 'verified' as const,
          message: `Existing paid access for household ${parsed.householdId} was preserved while verification evidence was refreshed.`,
        }
      : result.body;

  return new Response(JSON.stringify(responseBody), {
    status: responseBody.status === 'verified' ? 200 : result.status,
    headers: jsonHeaders,
  });
});
