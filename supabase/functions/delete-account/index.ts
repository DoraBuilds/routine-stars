/// <reference lib="deno.ns" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { jwtVerify } from 'https://deno.land/x/jose@v5.6.3/jwt/verify.ts';

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? '*';
const corsHeaders = {
  'access-control-allow-origin': allowedOrigin,
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};

const unauthorized = (message = 'Unauthorized') =>
  new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  if (!token) return unauthorized('Missing bearer token');

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET') ?? '';

  if (!supabaseUrl || !serviceRoleKey || !jwtSecret) {
    return new Response(JSON.stringify({ error: 'Server is not configured for account deletion.' }), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  try {
    const secretKey = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secretKey);
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return unauthorized('Invalid token');

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  } catch (_error) {
    return unauthorized('Invalid or expired token');
  }
});
