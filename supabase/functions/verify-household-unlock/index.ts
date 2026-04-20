import { handleVerificationRequest } from './shared.ts';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

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

  const result = handleVerificationRequest(payload);

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: jsonHeaders,
  });
});
